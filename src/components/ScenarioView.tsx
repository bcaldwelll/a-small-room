/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Scenario, StoryChoice, RehearsalRecord } from '../types/story';
import { getChoiceEvaluation, ChoiceEvaluation } from '../data/choiceScoring';

interface ScenarioViewProps {
  scenario: Scenario;
  previousRecord?: RehearsalRecord;
  canReconsider: boolean;
  onConfirmChoice: (choice: StoryChoice, evaluation: ChoiceEvaluation) => void;
  onReconsider: () => void;
}

export const ScenarioView: React.FC<ScenarioViewProps> = ({
  scenario,
  previousRecord,
  canReconsider,
  onConfirmChoice,
  onReconsider,
}) => {
  // Currently selected multiple choice option (null initially until clicked)
  const [selectedChoiceState, setSelectedChoiceState] = useState<{
    choice: StoryChoice;
    index: number;
    evaluation: ChoiceEvaluation;
  } | null>(null);

  // Reset selection whenever scenario changes
  useEffect(() => {
    setSelectedChoiceState(null);
  }, [scenario.id]);

  const handleOptionClick = (choice: StoryChoice, index: number) => {
    const evaluation = getChoiceEvaluation(choice.id, index);
    setSelectedChoiceState({ choice, index, evaluation });
  };

  return (
    <main className="w-full max-w-2xl px-4 py-8 sm:px-6">
      {/* Location & Scene Marker */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-black/20 pb-2">
        <span className="font-mono text-xs uppercase tracking-widest text-neutral-500">
          LOCATION // {scenario.location}
        </span>
        <span className="font-mono text-xs uppercase tracking-widest text-neutral-500">
          SCENE {scenario.layer + 1} OF 4
        </span>
      </div>

      {/* Previous Decision Continuity Bridge */}
      {previousRecord && (
        <section
          aria-label="Previous decision outcome"
          className="mb-6 border-l-2 border-black bg-neutral-50 p-4"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="font-mono text-[11px] uppercase tracking-wider text-neutral-600">
              PREVIOUS DECISION // {previousRecord.characterTarget.toUpperCase()}
            </span>
            {previousRecord.grade && (
              <span className="font-mono text-[10px] font-bold uppercase px-1.5 py-0.5 border border-black bg-white">
                {previousRecord.grade} (+{previousRecord.score?.toFixed(1)} PTS)
              </span>
            )}
          </div>
          <div className="font-serif text-sm font-semibold text-black mb-1">
            {previousRecord.choiceLabel}
          </div>
          {previousRecord.reaction && (
            <p className="font-serif italic text-neutral-800 text-sm">
              "{previousRecord.reaction}"
            </p>
          )}
          {previousRecord.takeaway && (
            <div className="mt-2 font-mono text-[11px] text-neutral-700">
              <span className="font-semibold uppercase tracking-wider">TAKEAWAY: </span>
              {previousRecord.takeaway}
            </div>
          )}
        </section>
      )}

      {/* Scene Title */}
      <h1 className="mb-6 font-serif text-3xl font-normal tracking-tight text-black sm:text-4xl">
        {scenario.title}
      </h1>

      {/* Narrative Text */}
      <div className="mb-8 space-y-4">
        {scenario.narrative.split('\n\n').map((paragraph, index) => (
          <p
            key={index}
            className="font-serif text-lg leading-relaxed text-neutral-900 sm:text-xl"
          >
            {paragraph}
          </p>
        ))}
      </div>

      {/* The 4 Multiple Choice Options */}
      <section aria-label="Story Choices" className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-mono text-xs font-semibold tracking-widest uppercase text-black">
            WHAT DO YOU CHOOSE TO DO?
          </h2>
          <span className="font-mono text-[11px] text-neutral-500">
            {selectedChoiceState ? '1 SELECTED' : 'SELECT AN OPTION'}
          </span>
        </div>

        <div className="space-y-3">
          {scenario.choices.map((choice, index) => {
            const isSelected = selectedChoiceState?.choice.id === choice.id;
            return (
              <button
                key={choice.id}
                type="button"
                onClick={() => handleOptionClick(choice, index)}
                className={`group block w-full border p-4 text-left transition-colors cursor-pointer ${
                  isSelected
                    ? 'border-2 border-black bg-neutral-100 shadow-sm ring-1 ring-black'
                    : 'border-neutral-300 bg-white hover:border-black hover:bg-neutral-50'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="font-mono text-xs font-semibold uppercase tracking-wider text-neutral-600">
                    OPTION {index + 1}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-500">
                      TARGET: {choice.characterTarget.toUpperCase()}
                    </span>
                    {isSelected && (
                      <span className="font-mono text-[10px] font-bold uppercase text-white bg-black px-1.5 py-0.5">
                        SELECTED ✓
                      </span>
                    )}
                  </div>
                </div>
                <div className="mt-1 font-serif text-base font-medium text-black sm:text-lg">
                  {choice.label}
                </div>
                <div className="mt-1 font-mono text-xs text-neutral-600">
                  <span className="opacity-75">Intention:</span> {choice.intention}
                </div>
              </button>
            );
          })}
        </div>

        {/* Immediate In-Place Outcome & Reaction Card */}
        {selectedChoiceState && (
          <div className="mt-6 border-2 border-black bg-white p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-black/20 pb-2">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-black">
                OUTCOME & SOCIAL REACTION:
              </span>
              <span
                className={`font-mono text-xs font-bold uppercase px-2.5 py-1 border ${
                  selectedChoiceState.evaluation.grade === 'Optimal'
                    ? 'border-black bg-black text-white'
                    : selectedChoiceState.evaluation.grade === 'Acceptable'
                    ? 'border-neutral-800 bg-neutral-200 text-black'
                    : selectedChoiceState.evaluation.grade === 'Awkward'
                    ? 'border-red-600 bg-red-50 text-red-700'
                    : 'border-red-800 bg-red-100 text-red-900'
                }`}
              >
                [{selectedChoiceState.evaluation.grade.toUpperCase()} // +{selectedChoiceState.evaluation.score.toFixed(1)} PTS]
              </span>
            </div>

            {/* Reaction Quote */}
            <div className="border-l-2 border-black bg-neutral-50 p-3">
              <span className="block font-mono text-[10px] font-semibold uppercase tracking-wider text-neutral-600 mb-1">
                REACTION // {selectedChoiceState.choice.characterTarget.toUpperCase()}:
              </span>
              <p className="font-serif text-base italic text-black">
                "{selectedChoiceState.evaluation.reaction}"
              </p>
            </div>

            {/* Relational Dynamics Takeaway */}
            <div>
              <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-black">
                SOCIAL DYNAMICS TAKEAWAY:
              </span>
              <p className="font-serif text-sm text-neutral-800 mt-0.5 leading-relaxed">
                {selectedChoiceState.evaluation.takeaway}
              </p>
            </div>

            {/* Confirm & Advance Button */}
            <button
              type="button"
              onClick={() =>
                onConfirmChoice(
                  selectedChoiceState.choice,
                  selectedChoiceState.evaluation
                )
              }
              className="w-full border-2 border-black bg-black py-3.5 font-mono text-xs font-semibold uppercase tracking-wider text-white hover:bg-neutral-800 active:scale-[0.99] mt-2 shadow-sm"
            >
              {selectedChoiceState.choice.targetEndingId
                ? 'CONFIRM & VIEW FINAL RESOLUTION & CERTIFICATE →'
                : 'CONFIRM & CONTINUE TO NEXT SCENE →'}
            </button>
          </div>
        )}
      </section>

      {/* Reconsider previous choice */}
      {canReconsider && (
        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={onReconsider}
            className="inline-block border-b border-black pb-0.5 font-mono text-xs uppercase tracking-widest text-black hover:opacity-60"
          >
            ← RECONSIDER PREVIOUS DECISION
          </button>
        </div>
      )}
    </main>
  );
};
