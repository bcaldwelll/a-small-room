/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  DialogueOption,
  Scenario,
  StoryChoice,
  RehearsalFeedback,
  RehearsalRecord,
} from '../types/story';
import { getDialogueOptionsForChoice } from '../data/dialogueOptions';

interface RehearsalModalProps {
  scenario: Scenario;
  choice: StoryChoice;
  previousRecord?: RehearsalRecord;
  onConfirmAdvance: (record: RehearsalRecord) => void;
  onCancel: () => void;
}

export const RehearsalModal: React.FC<RehearsalModalProps> = ({
  scenario,
  choice,
  previousRecord,
  onConfirmAdvance,
  onCancel,
}) => {
  // Available multiple-choice dialogue options in shuffled order
  const [dialogueOptions] = useState<DialogueOption[]>(() =>
    getDialogueOptionsForChoice(scenario, choice)
  );

  // Require player to explicitly make a choice (no pre-selected default!)
  const [selectedOption, setSelectedOption] = useState<DialogueOption | null>(null);

  // Automated immediate reaction feedback
  const [feedback, setFeedback] = useState<RehearsalFeedback | null>(null);

  // Instantly apply automated reaction with scored impact
  const handleConfirmDialogue = () => {
    if (!selectedOption) return;

    const reaction = selectedOption.reaction || {
      characterReply: `${choice.characterTarget.toUpperCase()} listens attentively and nods, acknowledging your words.`,
      strength: 'Clear and grounded interpersonal communication.',
      pitfall: 'Watch for subtle shifts in the room’s energy as conversation moves forward.',
      suggestedResponse: selectedOption.text,
      takeaway: 'Intentional phrasing creates psychological safety for everyone in the room.',
      score: 1.0,
      grade: 'Acceptable',
    };

    setFeedback({
      transcript: selectedOption.text,
      characterReply: reaction.characterReply,
      strength: reaction.strength,
      pitfall: reaction.pitfall,
      suggestedResponse: reaction.suggestedResponse,
      takeaway: reaction.takeaway,
      score: reaction.score,
      grade: reaction.grade,
      mode: 'multiple_choice',
    });
  };

  // Skip rehearsal (defaults to Awkward +0.3 score penalty for skipping)
  const handleSkipRehearsal = () => {
    onConfirmAdvance({
      scenarioId: scenario.id,
      choiceId: choice.id,
      choiceLabel: choice.label,
      intention: choice.intention,
      characterTarget: choice.characterTarget,
      selectedDialogue: selectedOption ? selectedOption.text : '[Skipped Response]',
      score: selectedOption ? (selectedOption.reaction?.score ?? 0.3) : 0.3,
      grade: selectedOption ? (selectedOption.reaction?.grade ?? 'Awkward') : 'Awkward',
      skipped: true,
      timestamp: Date.now(),
    });
  };

  // Advance to next scene with the chosen response and score
  const handleProceedWithFeedback = () => {
    if (!feedback || !selectedOption) return;
    onConfirmAdvance({
      scenarioId: scenario.id,
      choiceId: choice.id,
      choiceLabel: choice.label,
      intention: choice.intention,
      characterTarget: choice.characterTarget,
      selectedDialogue: selectedOption.text,
      score: feedback.score ?? 1.0,
      grade: feedback.grade ?? 'Acceptable',
      feedback,
      skipped: false,
      timestamp: Date.now(),
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="response-title"
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 sm:p-6"
    >
      <div className="relative my-auto w-full max-w-xl border-2 border-black bg-white p-6 shadow-2xl sm:p-8">
        {/* Header */}
        <div className="mb-4 border-b border-black/20 pb-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-widest text-neutral-500">
              SOCIAL DECISION // {choice.characterTarget.toUpperCase()}
            </span>
            <button
              type="button"
              onClick={onCancel}
              className="font-mono text-xs uppercase tracking-wider text-neutral-500 hover:text-black"
              aria-label="Cancel and return to choices"
            >
              [CANCEL]
            </button>
          </div>
          <h2
            id="response-title"
            className="mt-1 font-serif text-2xl font-normal text-black sm:text-3xl"
          >
            What do you say?
          </h2>
          <p className="mt-1 font-serif text-xs text-neutral-600">
            Read carefully. Only one response demonstrates true social attunement; the others carry significant score penalties.
          </p>
        </div>

        {/* Selected Intention Card */}
        <section
          aria-label="Chosen Action"
          className="mb-6 border-l-2 border-black bg-neutral-50 p-4"
        >
          <div className="font-mono text-[11px] uppercase tracking-wider text-neutral-500">
            CHOSEN ACTION:
          </div>
          <p className="font-serif text-base font-semibold text-black">
            {choice.label}
          </p>
          <div className="mt-2 font-mono text-xs text-neutral-700">
            <span className="font-semibold uppercase tracking-wider">
              INTENTION:
            </span>{' '}
            {choice.intention}
          </div>
        </section>

        {/* ==================== MULTIPLE CHOICE OPTIONS LIST ==================== */}
        {!feedback && (
          <div className="mb-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-neutral-700">
                SELECT YOUR SPOKEN LINE:
              </span>
              <span className="font-mono text-[11px] text-neutral-500">
                {selectedOption ? '1 SELECTED' : 'NONE SELECTED'}
              </span>
            </div>

            {dialogueOptions.map((opt, idx) => {
              const isSelected = selectedOption?.id === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSelectedOption(opt)}
                  className={`w-full text-left p-4 border transition-colors cursor-pointer ${
                    isSelected
                      ? 'border-2 border-black bg-neutral-100 shadow-sm ring-1 ring-black'
                      : 'border-neutral-300 bg-white hover:border-black hover:bg-neutral-50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-neutral-600">
                      RESPONSE {String.fromCharCode(65 + idx)}
                    </span>
                    {isSelected && (
                      <span className="font-mono text-[10px] uppercase font-bold text-white bg-black px-2 py-0.5">
                        SELECTED ✓
                      </span>
                    )}
                  </div>
                  <p className="font-serif text-base font-medium text-black sm:text-lg">
                    "{opt.text}"
                  </p>
                  <p className="mt-1 font-serif text-xs italic text-neutral-600">
                    {opt.nuance}
                  </p>
                </button>
              );
            })}

            {/* Confirm Button - Disabled until user actively selects an option */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleConfirmDialogue}
                disabled={!selectedOption}
                className="w-full border-2 border-black bg-black py-3.5 font-mono text-sm font-semibold tracking-wider uppercase text-white hover:bg-neutral-800 active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {selectedOption
                  ? 'CONFIRM RESPONSE & SEE REACTION →'
                  : 'SELECT A RESPONSE ABOVE TO CONTINUE'}
              </button>
            </div>
          </div>
        )}

        {/* ==================== AUTOMATED IMMEDIATE REACTION DISPLAY ==================== */}
        {feedback && (
          <div className="mb-6 space-y-4 border border-black p-4">
            <div className="space-y-4">
              {/* Response Evaluation Banner */}
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

              {/* Selected Words */}
              <div>
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-black">
                  YOUR SPOKEN WORDS:
                </span>
                <p className="mt-1 font-serif text-base italic text-neutral-900">
                  "{feedback.transcript}"
                </p>
              </div>

              {/* Immediate Character Reaction */}
              <div className="border-l-2 border-black bg-neutral-50 p-3">
                <span className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-neutral-600">
                  REACTION // {choice.characterTarget.toUpperCase()}:
                </span>
                <p className="mt-1 font-serif text-base italic text-black">
                  "{feedback.characterReply}"
                </p>
              </div>

              {/* Relational Strength */}
              <div>
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-neutral-800">
                  RELATIONAL STRENGTH:
                </span>
                <p className="font-serif text-sm text-neutral-800">
                  {feedback.strength}
                </p>
              </div>

              {/* Potential Pitfall */}
              <div>
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-neutral-800">
                  POSSIBLE PITFALL TO WATCH:
                </span>
                <p className="font-serif text-sm text-neutral-800">
                  {feedback.pitfall}
                </p>
              </div>

              {/* Suggested Polish */}
              <div>
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-neutral-800">
                  REVISED POLISH:
                </span>
                <p className="font-serif text-sm italic text-neutral-800">
                  "{feedback.suggestedResponse}"
                </p>
              </div>

              {/* Social Takeaway */}
              <div className="border-t border-black/20 pt-2">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-black">
                  SOCIAL TAKEAWAY:
                </span>
                <p className="font-serif text-sm font-medium text-black">
                  {feedback.takeaway}
                </p>
              </div>

              {/* Proceed to Next Scene */}
              <button
                type="button"
                onClick={handleProceedWithFeedback}
                className="w-full border-2 border-black bg-black py-3.5 font-mono text-sm font-semibold tracking-wider uppercase text-white hover:bg-neutral-800 active:scale-[0.99]"
              >
                PROCEED TO NEXT SCENE →
              </button>
            </div>
          </div>
        )}

        {/* Continue without review */}
        <div className="border-t border-black/20 pt-4 text-center">
          <button
            type="button"
            onClick={handleSkipRehearsal}
            className="font-mono text-xs tracking-wider uppercase text-neutral-600 hover:text-black underline"
          >
            CONTINUE WITHOUT REVIEW (0.3 PTS) →
          </button>
        </div>
      </div>
    </div>
  );
};
