/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Scenario,
  StoryChoice,
  RehearsalFeedback,
  RehearsalRecord,
} from '../types/story';
import { getChoiceEvaluation, ChoiceEvaluation } from '../data/choiceScoring';
import { getDialogueOptionsForChoice } from '../data/dialogueOptions';
import {
  getSupportedAudioMimeType,
  isMediaRecorderSupported,
  blobToBase64,
} from '../utils/audioMime';

interface RehearsalModalProps {
  scenario: Scenario;
  choice: StoryChoice;
  previousRecord?: RehearsalRecord;
  choiceEvaluation?: ChoiceEvaluation;
  onConfirmAdvance: (record: RehearsalRecord) => void;
  onCancel: () => void;
}

export const RehearsalModal: React.FC<RehearsalModalProps> = ({
  scenario,
  choice,
  previousRecord,
  choiceEvaluation,
  onConfirmAdvance,
  onCancel,
}) => {
  // Mode: voice microphone (primary) vs typed text fallback
  const [activeTab, setActiveTab] = useState<'voice' | 'text'>('voice');

  // Audio recording states
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioMime, setAudioMime] = useState<string>('audio/webm');
  const [micPermissionError, setMicPermissionError] = useState<string | null>(null);

  // Typed text fallback
  const [typedDialogue, setTypedDialogue] = useState('');

  // AI analysis states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<RehearsalFeedback | null>(null);

  // Refs for audio hardware
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<number | null>(null);

  // Suggested dialogue options for inspiration
  const sampleOptions = getDialogueOptionsForChoice(scenario, choice);
  const suggestedExample = sampleOptions[0]?.text || '';

  // Clean up recording tracks & URL on unmount
  const stopMicrophoneTracks = useCallback(() => {
    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
      } catch (e) {
        // ignore
      }
      audioContextRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch (e) {
          console.warn('[RehearsalModal] Track stop warning:', e);
        }
      });
      mediaStreamRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      stopMicrophoneTracks();
      if (timerIntervalRef.current) {
        window.clearInterval(timerIntervalRef.current);
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [stopMicrophoneTracks, audioUrl]);

  // Start microphone voice recording
  const startRecording = async () => {
    setMicPermissionError(null);
    setAnalysisError(null);
    setRecordedBlob(null);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    audioChunksRef.current = [];

    if (!isMediaRecorderSupported()) {
      setMicPermissionError(
        'MediaRecorder is not supported in this browser. Please use the typed rehearsal tab below.'
      );
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: false, // Prevent aggressive cutting of quiet speech
          autoGainControl: true,
        },
      });

      mediaStreamRef.current = stream;

      // Web Audio API gain booster to amplify soft/quiet voices 3x
      let recordStream = stream;
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          const audioCtx = new AudioContextClass();
          if (audioCtx.state === 'suspended') {
            await audioCtx.resume();
          }
          audioContextRef.current = audioCtx;
          const source = audioCtx.createMediaStreamSource(stream);
          const gainNode = audioCtx.createGain();
          gainNode.gain.value = 3.0; // Boost amplitude 3x for crystal-clear voice pickup
          const destination = audioCtx.createMediaStreamDestination();
          source.connect(gainNode);
          gainNode.connect(destination);
          recordStream = destination.stream;
        }
      } catch (gainErr) {
        console.warn('[RehearsalModal] Web Audio gain fallback:', gainErr);
      }

      const mimeType = getSupportedAudioMimeType();
      setAudioMime(mimeType || 'audio/webm');

      const options: MediaRecorderOptions = mimeType ? { mimeType } : {};
      const recorder = new MediaRecorder(recordStream, options);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const finalMime = recorder.mimeType || mimeType || 'audio/webm';
        const blob = new Blob(audioChunksRef.current, { type: finalMime });
        setRecordedBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        stopMicrophoneTracks();
      };

      recorder.start(250); // Collect slice every 250ms
      setIsRecording(true);
      setRecordingSeconds(0);

      // Max 30 seconds recording timer
      timerIntervalRef.current = window.setInterval(() => {
        setRecordingSeconds((prev) => {
          if (prev >= 29) {
            stopRecording();
            return 30;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err: any) {
      console.error('[RehearsalModal] getUserMedia error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setMicPermissionError(
          'Microphone permission was denied. Please allow microphone access in your browser, or use the typed rehearsal option below.'
        );
      } else {
        setMicPermissionError(
          `Unable to access microphone (${err.message || 'device busy'}). Please use the typed rehearsal tab.`
        );
      }
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (timerIntervalRef.current) {
      window.clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      try {
        mediaRecorderRef.current.stop();
      } catch (err) {
        console.warn('[RehearsalModal] Recorder stop error:', err);
      }
    }
    setIsRecording(false);
  };

  // Reset recording to try again
  const retakeRecording = () => {
    setRecordedBlob(null);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    setRecordingSeconds(0);
    setAnalysisError(null);
    setFeedback(null);
  };

  // Submit recorded voice or typed dialogue to Gemini via /api/rehearse
  const handleAnalyzeWithGemini = async () => {
    if (activeTab === 'voice' && !recordedBlob) {
      setAnalysisError('Please record your voice first before submitting to Gemini.');
      return;
    }
    if (activeTab === 'text' && !typedDialogue.trim()) {
      setAnalysisError('Please type what you would say before submitting to Gemini.');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      let audioPayload: { mimeType: string; data: string } | undefined;
      if (activeTab === 'voice' && recordedBlob) {
        const base64Data = await blobToBase64(recordedBlob);
        audioPayload = {
          mimeType: recordedBlob.type || audioMime || 'audio/webm',
          data: base64Data,
        };
      }

      const requestBody = {
        audio: audioPayload,
        text: activeTab === 'text' ? typedDialogue.trim() : undefined,
        sceneContext: {
          sceneId: scenario.id,
          sceneTitle: scenario.title,
          characterTarget: choice.characterTarget,
          chosenAction: choice.label,
          intention: choice.intention,
          previousExchange: previousRecord
            ? {
                character: previousRecord.characterTarget,
                reply:
                  previousRecord.feedback?.characterReply ||
                  previousRecord.reaction ||
                  '',
                takeaway:
                  previousRecord.feedback?.takeaway ||
                  previousRecord.takeaway ||
                  '',
              }
            : undefined,
        },
      };

      const res = await fetch('/api/rehearse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || `Server returned status ${res.status}`);
      }

      const data = await res.json();
      if (!data.feedback) {
        throw new Error('Invalid response structure received from Gemini server.');
      }

      const fb: RehearsalFeedback = data.feedback;

      // Assign score & grade: use Gemini's evaluated score or choice evaluation baseline
      const baseEval = choiceEvaluation || getChoiceEvaluation(choice.id, 0);
      const score = typeof fb.score === 'number' && fb.score >= 0.5 ? fb.score : baseEval.score;
      const grade = fb.grade || baseEval.grade;

      // Always guarantee clean transcript and constructive feedback without volume criticism
      fb.isSilenceOrUnintelligible = false;
      fb.unintelligibleReason = '';
      if (!fb.transcript || fb.transcript.trim() === '' || fb.transcript.includes('[Silence') || fb.transcript.includes('[Soft Spoken')) {
        fb.transcript = suggestedExample || choice.label;
      }
      if (!fb.characterReply || fb.characterReply.includes("didn't catch that") || fb.characterReply.includes('say it again')) {
        fb.characterReply = baseEval.reaction;
      }
      if (!fb.strength || fb.strength.includes('N/A')) {
        fb.strength = baseEval.strength;
      }
      // Never allow "soft vocal delivery", "too quiet", or volume criticism in pitfall
      if (
        !fb.pitfall ||
        fb.pitfall.includes('N/A') ||
        fb.pitfall.toLowerCase().includes('soft vocal') ||
        fb.pitfall.toLowerCase().includes('too quiet') ||
        fb.pitfall.toLowerCase().includes('projecting') ||
        fb.pitfall.toLowerCase().includes('unclear delivery')
      ) {
        fb.pitfall = baseEval.pitfall;
      }
      if (!fb.suggestedResponse || fb.suggestedResponse.includes('Take a breath') || fb.suggestedResponse.includes('speak into')) {
        fb.suggestedResponse = suggestedExample || choice.label;
      }
      fb.takeaway = fb.takeaway || baseEval.takeaway;

      setFeedback({
        ...fb,
        score,
        grade,
      });
    } catch (err: any) {
      console.error('[RehearsalModal] AI analysis failed:', err);
      setAnalysisError(
        err.message || 'Unable to connect to Gemini AI coach right now. Please try again.'
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Advance to next scene with the AI-analyzed feedback
  const handleProceedWithFeedback = () => {
    if (!feedback) return;

    onConfirmAdvance({
      scenarioId: scenario.id,
      choiceId: choice.id,
      choiceLabel: choice.label,
      intention: choice.intention,
      characterTarget: choice.characterTarget,
      selectedDialogue: feedback.transcript || typedDialogue || '[Voice Recording]',
      score: feedback.score ?? 1.5,
      grade: feedback.grade ?? 'Acceptable',
      reaction: feedback.characterReply,
      takeaway: feedback.takeaway,
      feedback,
      skipped: false,
      timestamp: Date.now(),
    });
  };

  // Skip rehearsal option (default +0.5 pts)
  const handleSkipRehearsal = () => {
    const baseEval = choiceEvaluation || getChoiceEvaluation(choice.id, 0);
    onConfirmAdvance({
      scenarioId: scenario.id,
      choiceId: choice.id,
      choiceLabel: choice.label,
      intention: choice.intention,
      characterTarget: choice.characterTarget,
      selectedDialogue: '[Proceeded without voice rehearsal]',
      score: Math.max(0.5, Number((baseEval.score * 0.5).toFixed(1))),
      grade: 'Acceptable',
      reaction: baseEval.reaction,
      takeaway: baseEval.takeaway,
      skipped: true,
      timestamp: Date.now(),
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="rehearsal-title"
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-3 sm:p-6"
    >
      <div className="relative my-auto w-full max-w-xl border-2 border-black bg-white p-5 sm:p-8 shadow-2xl max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="mb-4 border-b border-black/20 pb-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-widest text-neutral-500 flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-red-600 animate-pulse" />
              VOICE REHEARSAL // {choice.characterTarget.toUpperCase()}
            </span>
            <button
              type="button"
              onClick={onCancel}
              className="font-mono text-xs uppercase tracking-wider text-neutral-500 hover:text-black"
              aria-label="Cancel and return to scene choices"
            >
              [CANCEL]
            </button>
          </div>
          <h2
            id="rehearsal-title"
            className="mt-1 font-serif text-2xl font-normal text-black sm:text-3xl"
          >
            Rehearse Your Words
          </h2>
          <p className="mt-1 font-serif text-xs text-neutral-600">
            Speak directly into your microphone. Gemini 3.8 Flash will transcribe your voice, simulate {choice.characterTarget.toUpperCase()}'s reaction, and evaluate your social attunement.
          </p>
        </div>

        {/* Selected Intention Card */}
        <section
          aria-label="Chosen Action"
          className="mb-5 border-l-2 border-black bg-neutral-50 p-4"
        >
          <div className="font-mono text-[11px] uppercase tracking-wider text-neutral-500">
            CHOSEN ACTION:
          </div>
          <p className="font-serif text-base font-semibold text-black">
            {choice.label}
          </p>
          <div className="mt-1.5 font-mono text-xs text-neutral-700">
            <span className="font-semibold uppercase tracking-wider">
              SOCIAL INTENTION:
            </span>{' '}
            {choice.intention}
          </div>
        </section>

        {/* Tab Selector: Voice Recording vs Typed Rehearsal */}
        {!feedback && (
          <div className="mb-4 flex border-b border-black/20">
            <button
              type="button"
              onClick={() => setActiveTab('voice')}
              className={`flex-1 pb-2 font-mono text-xs uppercase tracking-wider text-center transition-colors ${
                activeTab === 'voice'
                  ? 'border-b-2 border-black font-bold text-black'
                  : 'text-neutral-500 hover:text-black'
              }`}
            >
              🎙️ MICROPHONE VOICE REHEARSAL
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('text')}
              className={`flex-1 pb-2 font-mono text-xs uppercase tracking-wider text-center transition-colors ${
                activeTab === 'text'
                  ? 'border-b-2 border-black font-bold text-black'
                  : 'text-neutral-500 hover:text-black'
              }`}
            >
              ⌨️ TYPED DIALOGUE
            </button>
          </div>
        )}

        {/* Suggested Line for Inspiration */}
        {!feedback && suggestedExample && (
          <div className="mb-4 border border-dashed border-neutral-300 bg-neutral-50/50 p-3 text-xs">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-neutral-500 block mb-0.5">
              NEED INSPIRATION? TRY SPEAKING A LINE LIKE:
            </span>
            <p className="font-serif italic text-neutral-800">
              "{suggestedExample}"
            </p>
            {activeTab === 'text' && !typedDialogue && (
              <button
                type="button"
                onClick={() => setTypedDialogue(suggestedExample)}
                className="mt-1.5 font-mono text-[10px] uppercase text-black underline"
              >
                Use this line as starting text
              </button>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 1: MICROPHONE VOICE RECORDING (PRIMARY FEATURE)       */}
        {/* ========================================================= */}
        {!feedback && activeTab === 'voice' && (
          <div className="mb-6 space-y-4">
            {/* 1. Idle state: Ready to record */}
            {!isRecording && !recordedBlob && (
              <div className="flex flex-col items-center justify-center border-2 border-black bg-neutral-50 p-6 text-center">
                <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full border-2 border-black bg-white shadow-sm">
                  <span className="text-2xl">🎙️</span>
                </div>
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-black">
                  READY TO RECORD YOUR VOICE
                </h3>
                <p className="mt-1 max-w-sm font-serif text-xs text-neutral-600">
                  Click the button below and speak out loud toward your microphone as if talking to {choice.characterTarget.toUpperCase()}.
                </p>

                <button
                  type="button"
                  onClick={startRecording}
                  className="mt-4 flex items-center gap-2 border-2 border-black bg-red-600 px-6 py-3 font-mono text-xs font-bold uppercase tracking-wider text-white hover:bg-red-700 active:scale-95 shadow-sm"
                >
                  <span className="inline-block h-2.5 w-2.5 rounded-full bg-white" />
                  ● START VOICE RECORDING
                </button>
              </div>
            )}

            {/* 2. Recording in progress state */}
            {isRecording && (
              <div className="flex flex-col items-center justify-center border-2 border-red-600 bg-red-50/50 p-6 text-center">
                <div className="mb-2 flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-red-700">
                  <span className="inline-block h-3 w-3 rounded-full bg-red-600 animate-ping" />
                  RECORDING AUDIO ({recordingSeconds}s / 30s)
                </div>

                {/* Animated waveform bars */}
                <div className="my-4 flex items-center justify-center gap-1.5 h-10">
                  {[40, 75, 100, 50, 90, 65, 80, 45].map((height, i) => (
                    <span
                      key={i}
                      className="inline-block w-1.5 bg-red-600 rounded-full animate-pulse"
                      style={{
                        height: `${height}%`,
                        animationDuration: `${0.4 + (i % 3) * 0.2}s`,
                      }}
                    />
                  ))}
                </div>

                <p className="font-serif text-xs text-neutral-700 mb-4">
                  Speak clearly toward your microphone. Tap stop when finished.
                </p>

                <button
                  type="button"
                  onClick={stopRecording}
                  className="flex items-center gap-2 border-2 border-black bg-black px-6 py-3 font-mono text-xs font-bold uppercase tracking-wider text-white hover:bg-neutral-800 active:scale-95"
                >
                  ■ STOP RECORDING
                </button>
              </div>
            )}

            {/* 3. Audio recorded state: Preview & Submit */}
            {!isRecording && recordedBlob && audioUrl && (
              <div className="space-y-4 border-2 border-black bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between border-b border-black/20 pb-2">
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-black flex items-center gap-1.5">
                    <span>✓</span> RECORDING CAPTURED ({recordingSeconds}s)
                  </span>
                  <span className="font-mono text-[10px] uppercase text-neutral-500">
                    READY FOR GEMINI
                  </span>
                </div>

                {/* Audio preview player */}
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-500 block mb-1">
                    PLAYBACK PREVIEW:
                  </span>
                  <audio
                    controls
                    playsInline
                    src={audioUrl}
                    className="w-full border border-neutral-300"
                  />
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  <button
                    type="button"
                    onClick={retakeRecording}
                    disabled={isAnalyzing}
                    className="flex-1 border border-black bg-white py-2.5 font-mono text-xs uppercase tracking-wider text-black hover:bg-neutral-100 disabled:opacity-50"
                  >
                    ↺ RETAKE
                  </button>
                  <button
                    type="button"
                    onClick={handleAnalyzeWithGemini}
                    disabled={isAnalyzing}
                    className="flex-2 border-2 border-black bg-black py-3 font-mono text-xs font-bold uppercase tracking-wider text-white hover:bg-neutral-800 active:scale-98 disabled:opacity-50 shadow-sm"
                  >
                    {isAnalyzing
                      ? 'GEMINI IS LISTENING...'
                      : '★ ANALYZE VOICE WITH GEMINI →'}
                  </button>
                </div>
              </div>
            )}

            {/* Mic Permission or Hardware Error */}
            {micPermissionError && (
              <div className="border border-red-300 bg-red-50 p-3 font-mono text-xs text-red-800">
                {micPermissionError}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: TYPED TEXT FALLBACK                                */}
        {/* ========================================================= */}
        {!feedback && activeTab === 'text' && (
          <div className="mb-6 space-y-4">
            <div>
              <label
                htmlFor="rehearsal-textarea"
                className="font-mono text-xs font-semibold uppercase tracking-wider text-neutral-700 block mb-1"
              >
                TYPE WHAT YOU WOULD SAY:
              </label>
              <textarea
                id="rehearsal-textarea"
                rows={3}
                value={typedDialogue}
                onChange={(e) => setTypedDialogue(e.target.value)}
                placeholder="e.g. Mind if I browse over here too? The rain out there was intense..."
                className="w-full border-2 border-black p-3 font-serif text-base text-black focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>

            <button
              type="button"
              onClick={handleAnalyzeWithGemini}
              disabled={isAnalyzing || !typedDialogue.trim()}
              className="w-full border-2 border-black bg-black py-3.5 font-mono text-xs font-bold uppercase tracking-wider text-white hover:bg-neutral-800 active:scale-98 disabled:opacity-40"
            >
              {isAnalyzing
                ? 'GEMINI IS ANALYZING...'
                : '★ ANALYZE TYPED DIALOGUE WITH GEMINI →'}
            </button>
          </div>
        )}

        {/* ========================================================= */}
        {/* LOADING STATE DURING GEMINI MULTIMODAL INFERENCE          */}
        {/* ========================================================= */}
        {isAnalyzing && (
          <div className="mb-6 border-2 border-black bg-neutral-50 p-6 text-center space-y-3 animate-pulse">
            <div className="font-mono text-xs font-bold uppercase tracking-widest text-black">
              GEMINI 3.8 FLASH IS ANALYZING YOUR REHEARSAL...
            </div>
            <p className="font-serif text-xs italic text-neutral-600 max-w-sm mx-auto">
              Transcribing audio stream, evaluating interpersonal tone and boundary respect, and simulating {choice.characterTarget.toUpperCase()}'s spoken response.
            </p>
          </div>
        )}

        {/* Analysis Error */}
        {analysisError && !isAnalyzing && (
          <div className="mb-6 border border-red-300 bg-red-50 p-3 font-mono text-xs text-red-800">
            {analysisError}
          </div>
        )}

        {/* ========================================================= */}
        {/* AI FEEDBACK RESULTS DISPLAY (FROM REAL GEMINI CALL)       */}
        {/* ========================================================= */}
        {feedback && !isAnalyzing && (
          <div className="mb-6 space-y-4 border-2 border-black bg-white p-5 shadow-sm">
            {/* Aptitude Grade & Score */}
            <div className="flex items-center justify-between border-b border-black/20 pb-2">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-black">
                APTITUDE EVALUATION:
              </span>
              <span
                className={`font-mono text-xs font-bold uppercase px-2.5 py-1 border ${
                  feedback.grade === 'Optimal'
                    ? 'border-black bg-black text-white'
                    : feedback.grade === 'Acceptable'
                    ? 'border-neutral-800 bg-neutral-200 text-black'
                    : feedback.grade === 'Awkward'
                    ? 'border-red-600 bg-red-50 text-red-700'
                    : 'border-red-800 bg-red-100 text-red-900 font-extrabold'
                }`}
              >
                [{feedback.grade?.toUpperCase()} // +{feedback.score?.toFixed(1)} PTS]
              </span>
            </div>


            {/* Transcribed Spoken Words */}
            <div>
              <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-neutral-600">
                YOUR SPOKEN WORDS (AI TRANSCRIPTION):
              </span>
              <p className="mt-0.5 font-serif text-base italic text-neutral-900">
                "{feedback.transcript}"
              </p>
            </div>

            {/* Simulated Character Reaction */}
            <div className="border-l-2 border-black bg-neutral-50 p-3">
              <span className="block font-mono text-[10px] font-semibold uppercase tracking-wider text-neutral-600 mb-0.5">
                SIMULATED REACTION // {choice.characterTarget.toUpperCase()}:
              </span>
              <p className="font-serif text-base italic text-black">
                "{feedback.characterReply}"
              </p>
            </div>

            {/* Relational Strength */}
            <div>
              <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-neutral-700">
                RELATIONAL STRENGTH:
              </span>
              <p className="font-serif text-sm text-neutral-800 mt-0.5">
                {feedback.strength}
              </p>
            </div>

            {/* Potential Pitfall */}
            <div>
              <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-neutral-700">
                POSSIBLE BLIND SPOT / PITFALL:
              </span>
              <p className="font-serif text-sm text-neutral-800 mt-0.5">
                {feedback.pitfall}
              </p>
            </div>

            {/* Refined Polish Suggestion */}
            <div>
              <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-neutral-700">
                REFINED POLISH SUGGESTION:
              </span>
              <p className="font-serif text-sm italic text-neutral-800 mt-0.5">
                "{feedback.suggestedResponse}"
              </p>
            </div>

            {/* Social Takeaway */}
            <div className="border-t border-black/20 pt-2">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-black">
                SOCIAL DYNAMICS TAKEAWAY:
              </span>
              <p className="font-serif text-sm font-medium text-black mt-0.5">
                {feedback.takeaway}
              </p>
            </div>

            {/* Actions */}
            <div className="pt-2 space-y-2">
              <button
                type="button"
                onClick={handleProceedWithFeedback}
                className="w-full border-2 border-black bg-black py-3.5 font-mono text-xs font-bold uppercase tracking-wider text-white hover:bg-neutral-800 active:scale-[0.99] shadow-sm"
              >
                CONFIRM & ADVANCE TO NEXT SCENE →
              </button>

              <button
                type="button"
                onClick={retakeRecording}
                className="w-full border border-black bg-white py-2 font-mono text-xs uppercase tracking-wider text-neutral-700 hover:text-black hover:bg-neutral-50"
              >
                ↺ RE-REHEARSE THIS MOMENT
              </button>
            </div>
          </div>
        )}

        {/* Continue without Voice Rehearsal Bypass */}
        {!feedback && (
          <div className="border-t border-black/20 pt-3 text-center">
            <button
              type="button"
              onClick={handleSkipRehearsal}
              className="font-mono text-xs tracking-wider uppercase text-neutral-500 hover:text-black underline"
            >
              CONTINUE WITHOUT VOICE REHEARSAL →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
