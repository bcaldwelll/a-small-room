/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Ending, EndingId, RehearsalRecord, AiReport } from '../types/story';
import { ENDINGS } from '../data/storyGraph';

interface EndingViewProps {
  ending: Ending;
  history: RehearsalRecord[];
  unlockedEndings: EndingId[];
  onRestart: () => void;
}

// Calculate the dynamic social aptitude score out of 10 based on actual player choices
function getDynamicAptitude(history: RehearsalRecord[]): {
  scoreText: string;
  certificateTitle: string;
  rating: string;
  summary: string;
} {
  // Sum the scores from the 4 scenario responses (strict scoring: max 10.0)
  const rawScore = history.reduce((sum, h) => sum + (h.score ?? 1.0), 0);
  const scoreNum = Math.min(10.0, Math.max(0.0, Number(rawScore.toFixed(1))));
  const scoreText = `${scoreNum.toFixed(1)} / 10`;

  if (scoreNum >= 9.5) {
    return {
      scoreText,
      certificateTitle: '"I Have Social Intelligence!"',
      rating: 'Masterful Situational Attunement (Top Tier)',
      summary:
        'Exceptional score: You navigated complex social friction by offering spacious presence, validating boundaries, and honoring human dignity without pressure on every single scenario.',
    };
  } else if (scoreNum >= 7.5) {
    return {
      scoreText,
      certificateTitle: '"I Have Social Intelligence!"',
      rating: 'High Situational Competence',
      summary:
        'Strong score: You read the room accurately and fostered connection, with only minor reliance on safe small talk or cautious hedging.',
    };
  } else if (scoreNum >= 5.0) {
    return {
      scoreText,
      certificateTitle: '"Moderate Social Aptitude"',
      rating: 'Developing Situational Awareness',
      summary:
        'Average score: You maintained basic social courtesy, but occasionally offered unsolicited advice or missed subtle cues of social overstimulation.',
    };
  } else {
    return {
      scoreText,
      certificateTitle: '"Social Aptitude in Need of Practice"',
      rating: 'Needs Interpersonal Attunement',
      summary:
        'Challenging score: Several tone-deaf remarks, forced extroversion, or self-centered comments created noticeable tension in the room. Replay to practice reading boundaries.',
    };
  }
}

export const EndingView: React.FC<EndingViewProps> = ({
  ending,
  history,
  unlockedEndings,
  onRestart,
}) => {
  const [copied, setCopied] = useState(false);
  const [certificatePhoto, setCertificatePhoto] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Gemini AI Report state
  const [aiReport, setAiReport] = useState<AiReport | null>(null);
  const [isLoadingReport, setIsLoadingReport] = useState(true);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);
  const fileUploadInputRef = useRef<HTMLInputElement | null>(null);

  // Dynamic score out of 10 based on actual player choices
  const aptitude = getDynamicAptitude(history);

  // Fetch AI Report from Gemini endpoint upon reaching ending
  useEffect(() => {
    let isMounted = true;

    const fetchAiReport = async () => {
      try {
        setIsLoadingReport(true);
        const res = await fetch('/api/end-game-report', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ending, history }),
        });

        if (!res.ok) {
          throw new Error(`Report API returned status ${res.status}`);
        }

        const data = await res.json();
        if (isMounted && data.report) {
          setAiReport(data.report);
        }
      } catch (err: any) {
        console.warn('[EndingView] AI Report fetch error, using client fallback:', err);
        if (isMounted) {
          setAiReport({
            theme: aptitude.summary,
            bullets: [
              'Attunement: Demonstrated distinct presence across your four scenario decisions.',
              'Room Dynamics: Navigated interpersonal tensions and boundaries with intentionality.',
              'Core Principle: True social intelligence centers on creating psychological safety for everyone present.',
            ],
          });
        }
      } finally {
        if (isMounted) {
          setIsLoadingReport(false);
        }
      }
    };

    fetchAiReport();

    return () => {
      isMounted = false;
    };
  }, [ending, history, aptitude.summary]);

  // Stop camera tracks cleanly
  const stopCamera = useCallback(() => {
    if (cameraStreamRef.current) {
      cameraStreamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch (e) {
          console.warn('[Camera] Failed to stop track:', e);
        }
      });
      cameraStreamRef.current = null;
    }
    setIsCameraActive(false);
  }, []);

  // Cleanup on unmount or pagehide
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  // When camera turns active, bind stream to video element
  useEffect(() => {
    if (isCameraActive && videoRef.current && cameraStreamRef.current) {
      videoRef.current.srcObject = cameraStreamRef.current;
      videoRef.current.play().catch((err) => {
        console.warn('[Camera] video play error:', err);
      });
    }
  }, [isCameraActive]);

  // Directly open MacBook / device camera
  const startCamera = async () => {
    setCameraError(null);
    stopCamera();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
        audio: false,
      });

      cameraStreamRef.current = stream;
      setIsCameraActive(true);
    } catch (err: any) {
      console.error('[Camera] getUserMedia error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError(
          'Camera access was blocked by your browser. Please click the camera/lock icon in your browser URL bar to allow camera access.'
        );
      } else {
        setCameraError(
          `Unable to access camera (${err.message || 'device unavailable'}). You can also upload a photo below.`
        );
      }
    }
  };

  // Snap photo from the camera feed
  const snapPicture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setCertificatePhoto(dataUrl);
    }

    stopCamera();
  };

  // Fallback: handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCameraError(null);

    const reader = new FileReader();
    reader.onload = () => {
      setCertificatePhoto(reader.result as string);
      stopCamera();
    };
    reader.readAsDataURL(file);
  };

  const copySummary = () => {
    const summaryLines = [
      `A SMALL ROOM — SOCIAL REHEARSAL`,
      `RESOLUTION: ${ending.title} ("${ending.subtitle}")`,
      `"${ending.epitaph}"`,
      ``,
      `CERTIFICATE ATTESTATION:`,
      `${aptitude.certificateTitle}`,
      `Social Aptitude Score: ${aptitude.scoreText} (${aptitude.rating})`,
      `${aptitude.summary}`,
      `Date: ${new Date().toLocaleDateString()}`,
    ];

    if (aiReport) {
      summaryLines.push(
        ``,
        `AI SOCIAL INTELLIGENCE REPORT (GEMINI):`,
        `Overall Theme: "${aiReport.theme}"`,
        ...aiReport.bullets.map((b, i) => `  ${i + 1}. ${b}`)
      );
    }

    summaryLines.push(
      ``,
      `REFLECTION:`,
      ending.reflectionPrompt
    );

    navigator.clipboard.writeText(summaryLines.join('\n')).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const allEndingKeys: EndingId[] = [
    'thread_to_follow',
    'bridge_under_repair',
    'room_to_breathe',
    'ships_in_evening',
  ];

  const currentDateString = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <main className="w-full max-w-2xl px-4 py-8 sm:px-6">
      {/* Hidden canvas for taking snapshot & file upload input */}
      <canvas ref={canvasRef} className="hidden" />
      <input
        type="file"
        accept="image/*"
        ref={fileUploadInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Resolution Header */}
      <div className="mb-4 border-b border-black/20 pb-2">
        <span className="font-mono text-xs uppercase tracking-widest text-neutral-500">
          RESOLUTION // 4 OF 4 DECISIONS REACHED
        </span>
      </div>

      <h1 className="mb-2 font-serif text-3xl font-normal tracking-tight text-black sm:text-4xl">
        {ending.title}
      </h1>
      <p className="mb-4 font-mono text-xs uppercase tracking-wider text-neutral-600">
        {ending.subtitle}
      </p>

      {/* Epitaph */}
      <blockquote className="mb-8 border-l-2 border-black bg-neutral-50 p-4 font-serif text-base italic text-neutral-800 sm:text-lg">
        "{ending.epitaph}"
      </blockquote>

      {/* Authored Narrative Overview */}
      <div className="mb-10 space-y-4">
        {ending.narrative.split('\n\n').map((paragraph, index) => (
          <p
            key={index}
            className="font-serif text-lg leading-relaxed text-neutral-900 sm:text-xl"
          >
            {paragraph}
          </p>
        ))}
      </div>

      {/* ============================================================== */}
      {/* SOCIAL INTELLIGENCE CERTIFICATE WITH CAMERA & SCORE OUT OF 10 */}
      {/* ============================================================== */}
      <section
        id="certificate"
        aria-label="Certificate of Social Intelligence"
        className="mb-10 border-4 border-black bg-white p-6 sm:p-8 text-center relative shadow-sm"
      >
        <div className="border border-black p-6 sm:p-8">
          <div className="mb-2 font-mono text-[11px] uppercase tracking-widest text-neutral-500">
            OFFICIAL ATTESTATION // GATHERING COMPLETION
          </div>

          {/* Certificate Main Title */}
          <h2 className="mb-2 font-serif text-3xl sm:text-4xl font-bold tracking-tight text-black">
            {aptitude.certificateTitle}
          </h2>

          <p className="mx-auto max-w-md font-serif text-sm text-neutral-700 mb-6">
            Conferred upon navigating four interpersonal scenarios at Maya's gathering across nuanced choices, boundaries, and active listening.
          </p>

          {/* DYNAMIC SOCIAL APTITUDE SCORE DISPLAY (OUT OF 10) */}
          <div className="mx-auto mb-6 max-w-md border-2 border-black bg-neutral-50 p-4 text-center">
            <div className="font-mono text-[11px] font-semibold uppercase tracking-wider text-neutral-600">
              SOCIAL APTITUDE IN THIS SITUATION:
            </div>
            <div className="mt-1 font-mono text-3xl sm:text-4xl font-bold tracking-tight text-black">
              {aptitude.scoreText}
            </div>
            <div className="mt-1 font-mono text-xs font-semibold uppercase tracking-wider text-neutral-800">
              [{aptitude.rating}]
            </div>
            <p className="mt-2 font-serif text-xs leading-relaxed text-neutral-700">
              {aptitude.summary}
            </p>
          </div>

          {/* CERTIFICATE PHOTO / CAMERA FRAME */}
          <div className="mx-auto mb-6 flex flex-col items-center">
            {/* 1. Camera is actively streaming from MacBook / device */}
            {isCameraActive && (
              <div className="space-y-3">
                <div className="relative overflow-hidden border-2 border-black bg-black">
                  <video
                    ref={videoRef}
                    playsInline
                    autoPlay
                    muted
                    className="h-56 w-56 sm:h-64 sm:w-64 object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-red-600 px-2 py-0.5 font-mono text-[10px] uppercase font-bold text-white tracking-wider flex items-center gap-1.5">
                    <span className="inline-block h-2 w-2 rounded-full bg-white animate-pulse" />
                    LIVE CAMERA
                  </div>
                </div>

                <div className="flex justify-center gap-2">
                  <button
                    type="button"
                    onClick={snapPicture}
                    className="border-2 border-black bg-black px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-white hover:bg-neutral-800 active:scale-95"
                  >
                    ● SNAP PICTURE
                  </button>
                  <button
                    type="button"
                    onClick={stopCamera}
                    className="border border-black bg-white px-3 py-2.5 font-mono text-xs uppercase tracking-wider text-black hover:bg-neutral-100"
                  >
                    CANCEL
                  </button>
                </div>
              </div>
            )}

            {/* 2. Photo has been snapped and entered into certificate */}
            {!isCameraActive && certificatePhoto && (
              <div className="space-y-3">
                <div className="border-2 border-black p-2 bg-neutral-50 inline-block">
                  <img
                    src={certificatePhoto}
                    alt="Verified Certificate Portrait"
                    className="h-48 w-48 sm:h-56 sm:w-56 object-cover border border-black grayscale"
                  />
                  <span className="mt-1.5 block font-mono text-[10px] uppercase tracking-wider text-neutral-600">
                    VERIFIED GRADUATE PHOTO
                  </span>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={startCamera}
                    className="border-2 border-black bg-black px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wider text-white hover:bg-neutral-800"
                  >
                    ↺ RETAKE PICTURE
                  </button>
                </div>
              </div>
            )}

            {/* 3. Initial state: Camera not opened yet */}
            {!isCameraActive && !certificatePhoto && (
              <div className="space-y-3">
                <div className="flex h-48 w-48 sm:h-56 sm:w-56 flex-col items-center justify-center border-2 border-dashed border-black bg-neutral-50 p-4">
                  <span className="text-3xl mb-1">📷</span>
                  <span className="font-mono text-xs font-semibold uppercase tracking-wider text-black text-center">
                    CERTIFICATE PHOTO
                  </span>
                  <span className="font-serif text-[11px] text-neutral-500 text-center mt-1">
                    Snap a picture with your MacBook camera to place your photo on the certificate.
                  </span>
                </div>

                <button
                  type="button"
                  onClick={startCamera}
                  className="border-2 border-black bg-black px-5 py-3 font-mono text-xs font-semibold uppercase tracking-wider text-white hover:bg-neutral-800 active:scale-95 shadow-sm"
                >
                  📷 TAKE PICTURE WITH CAMERA
                </button>
              </div>
            )}

            {/* Camera Error Message if permissions blocked */}
            {cameraError && (
              <div className="mt-3 max-w-sm border border-red-300 bg-red-50 p-3 font-mono text-xs text-red-800">
                {cameraError}
              </div>
            )}

            {/* Subtle File Upload Fallback */}
            {!isCameraActive && (
              <button
                type="button"
                onClick={() => fileUploadInputRef.current?.click()}
                className="mt-2 font-mono text-[11px] uppercase tracking-wider text-neutral-500 hover:text-black underline"
              >
                (or upload a photo file)
              </button>
            )}
          </div>

          {/* Certificate Metadata & Witness Signatures */}
          <div className="mt-6 border-t border-black/30 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-neutral-600">
            <div className="text-left">
              <div>
                RESOLUTION: <span className="text-black font-semibold uppercase">{ending.title}</span>
              </div>
              <div>DATE: {currentDateString}</div>
            </div>
            <div className="text-center sm:text-right border-t sm:border-t-0 sm:border-l border-black/20 pt-2 sm:pt-0 sm:pl-4">
              <div className="font-serif italic text-black text-sm">Maya, Sam & Jules</div>
              <div className="text-[10px] uppercase tracking-widest text-neutral-500">
                WITNESSED AT MAYA'S GATHERING
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* GEMINI AI INTERPERSONAL REPORT (3 BULLETS + OVERALL THEME)     */}
      {/* ============================================================== */}
      <section
        id="ai-report"
        aria-label="Gemini AI Social Intelligence Report"
        className="mb-10 border-2 border-black bg-white p-6 sm:p-7 shadow-sm"
      >
        <div className="flex items-center justify-between border-b border-black/20 pb-2 mb-4">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-black flex items-center gap-2">
            <span className="inline-block h-2 w-2 bg-black" />
            AI SOCIAL INTELLIGENCE REPORT
          </span>
          <span className="font-mono text-[10px] uppercase font-semibold tracking-wider text-neutral-600">
            GEMINI 3.8 FLASH
          </span>
        </div>

        {isLoadingReport && (
          <div className="py-6 text-center space-y-2">
            <div className="font-mono text-xs uppercase tracking-wider text-neutral-800 animate-pulse">
              ANALYZING RESPONSES WITH GEMINI...
            </div>
            <p className="font-serif text-xs italic text-neutral-500">
              Evaluating your relational postures, phrasing nuances, and conversational strengths.
            </p>
          </div>
        )}

        {!isLoadingReport && aiReport && (
          <div className="space-y-5">
            {/* Overall Theme */}
            <div>
              <div className="font-mono text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                OVERALL THEME:
              </div>
              <blockquote className="mt-1.5 border-l-2 border-black pl-3 font-serif text-lg font-medium italic text-black sm:text-xl leading-snug">
                "{aiReport.theme}"
              </blockquote>
            </div>

            {/* Exactly 3 Bullets */}
            <div>
              <div className="font-mono text-[11px] font-semibold uppercase tracking-wider text-neutral-500 mb-2">
                KEY INTERPERSONAL OBSERVATIONS:
              </div>
              <ul className="space-y-3">
                {aiReport.bullets.map((bullet, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="font-mono text-xs font-bold text-black mt-0.5">•</span>
                    <p className="font-serif text-base text-neutral-800 leading-relaxed">
                      {bullet}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </section>

      {/* Authored Reflection */}
      <section aria-label="Reflection" className="mb-10 border border-black p-5">
        <h2 className="mb-2 font-mono text-xs font-semibold uppercase tracking-widest text-black">
          INTERPERSONAL REFLECTION
        </h2>
        <p className="font-serif text-base leading-relaxed text-neutral-800">
          {ending.reflectionPrompt}
        </p>
      </section>

      {/* Ending Collection Gallery */}
      <section aria-label="Ending Collection" className="mb-10 border border-black p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-mono text-xs font-semibold uppercase tracking-widest text-black">
            ENDING COLLECTION
          </h2>
          <span className="font-mono text-xs text-neutral-600">
            {unlockedEndings.length} OF {allEndingKeys.length} DISCOVERED
          </span>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {allEndingKeys.map((key) => {
            const isUnlocked = unlockedEndings.includes(key);
            const item = ENDINGS[key];
            return (
              <div
                key={key}
                className={`border p-3 transition-colors ${
                  isUnlocked
                    ? 'border-black bg-white'
                    : 'border-neutral-300 bg-neutral-50 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-500">
                    {isUnlocked ? '[DISCOVERED]' : '[UNDISCOVERED]'}
                  </span>
                  {key === ending.id && (
                    <span className="font-mono text-[10px] uppercase font-bold text-black">
                      CURRENT
                    </span>
                  )}
                </div>
                <div className="mt-1 font-serif text-base font-medium text-black">
                  {item.title}
                </div>
                <div className="font-mono text-[11px] text-neutral-600">
                  {item.subtitle}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Actions */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={copySummary}
          className="w-full border border-black bg-white py-3 font-mono text-xs font-semibold uppercase tracking-wider text-black hover:bg-neutral-100 active:scale-[0.99]"
        >
          {copied
            ? '✓ COPIED CERTIFICATE & REPORT TO CLIPBOARD'
            : 'COPY CERTIFICATE & REPORT'}
        </button>

        <button
          type="button"
          onClick={onRestart}
          className="w-full border-2 border-black bg-black py-3.5 font-mono text-xs font-semibold uppercase tracking-wider text-white hover:bg-neutral-800 active:scale-[0.99]"
        >
          BEGIN ANOTHER REHEARSAL →
        </button>
      </div>
    </main>
  );
};
