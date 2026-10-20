/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  EndingId,
  PlaythroughState,
  RehearsalRecord,
  StoryChoice,
  UserProgress,
} from './types/story';
import { SCENARIOS, ENDINGS } from './data/storyGraph';
import { ChoiceEvaluation } from './data/choiceScoring';
import {
  loadUserProgress,
  saveUserProgress,
  recordUnlockedEnding,
  clearPlaythroughProgress,
} from './utils/storage';
import { Header } from './components/Header';
import { ScenarioView } from './components/ScenarioView';
import { EndingView } from './components/EndingView';
import { EndingsModal } from './components/EndingsModal';
import { ConfirmModal } from './components/ConfirmModal';

export default function App() {
  const [progress, setProgress] = useState<UserProgress>(() => loadUserProgress());

  // Current playthrough states
  const [currentScenarioId, setCurrentScenarioId] = useState<string>('s0_arrival');
  const [currentEndingId, setCurrentEndingId] = useState<EndingId | null>(null);
  const [history, setHistory] = useState<RehearsalRecord[]>([]);

  // Modal / UI states
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [showRestartConfirm, setShowRestartConfirm] = useState(false);

  // Resume last active session if available
  useEffect(() => {
    const loaded = loadUserProgress();
    setProgress(loaded);

    if (loaded.lastActiveState && !loaded.lastActiveState.isComplete) {
      if (loaded.lastActiveState.currentEndingId) {
        setCurrentEndingId(loaded.lastActiveState.currentEndingId);
      } else if (SCENARIOS[loaded.lastActiveState.currentScenarioId]) {
        setCurrentScenarioId(loaded.lastActiveState.currentScenarioId);
      }
      setHistory(loaded.lastActiveState.history || []);
    }
  }, []);

  // Sync state to safe storage
  const persistState = (
    scenarioId: string,
    records: RehearsalRecord[],
    endingId?: EndingId | null
  ) => {
    const isComplete = !!endingId;
    const playthrough: PlaythroughState = {
      currentScenarioId: scenarioId,
      currentEndingId: endingId || undefined,
      history: records,
      isComplete,
      startedAt: Date.now(),
    };

    const updated: UserProgress = {
      ...progress,
      lastActiveState: playthrough,
    };
    setProgress(updated);
    saveUserProgress(updated);
  };

  // Directly handle confirming one of the 4 multiple-choice options in the situation
  const handleConfirmChoice = (choice: StoryChoice, evaluation: ChoiceEvaluation) => {
    const record: RehearsalRecord = {
      scenarioId: currentScenarioId,
      choiceId: choice.id,
      choiceLabel: choice.label,
      intention: choice.intention,
      characterTarget: choice.characterTarget,
      score: evaluation.score,
      grade: evaluation.grade,
      reaction: evaluation.reaction,
      takeaway: evaluation.takeaway,
      skipped: false,
      timestamp: Date.now(),
    };

    const newHistory = [...history, record];
    setHistory(newHistory);

    if (choice.targetEndingId) {
      // Reached an ending
      const endingId = choice.targetEndingId;
      setCurrentEndingId(endingId);
      const updatedProgress = recordUnlockedEnding(endingId);
      setProgress(updatedProgress);
      persistState(currentScenarioId, newHistory, endingId);
    } else if (choice.targetScenarioId) {
      // Advance to next scenario
      const nextId = choice.targetScenarioId;
      setCurrentScenarioId(nextId);
      persistState(nextId, newHistory, null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Step back / reconsider previous decision
  const handleReconsider = () => {
    if (history.length === 0) return;
    const newHistory = [...history];
    const lastRecord = newHistory.pop();
    if (!lastRecord) return;

    setHistory(newHistory);
    setCurrentScenarioId(lastRecord.scenarioId);
    setCurrentEndingId(null);
    persistState(lastRecord.scenarioId, newHistory, null);
  };

  // Restart playthrough
  const handleRestartClick = () => {
    if (history.length > 0 && !currentEndingId) {
      setShowRestartConfirm(true);
    } else {
      executeRestart();
    }
  };

  const executeRestart = () => {
    setCurrentScenarioId('s0_arrival');
    setCurrentEndingId(null);
    setHistory([]);
    setShowRestartConfirm(false);
    clearPlaythroughProgress();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentScenario = SCENARIOS[currentScenarioId] || SCENARIOS.s0_arrival;
  const currentEnding = currentEndingId ? ENDINGS[currentEndingId] : null;
  const previousRecord = history.length > 0 ? history[history.length - 1] : undefined;

  const currentLayer = currentEnding ? 4 : currentScenario.layer;

  return (
    <div className="flex min-h-screen flex-col bg-white text-black antialiased selection:bg-black selection:text-white">
      {/* Universal Minimalist Header */}
      <Header
        currentLayer={currentLayer}
        unlockedCount={progress.unlockedEndings.length}
        totalEndings={4}
        onOpenNotes={() => setShowNotesModal(true)}
        onRestart={handleRestartClick}
      />

      {/* Main View Area */}
      <div className="flex flex-1 justify-center">
        {currentEnding ? (
          <EndingView
            ending={currentEnding}
            history={history}
            unlockedEndings={progress.unlockedEndings}
            onRestart={executeRestart}
          />
        ) : (
          <ScenarioView
            scenario={currentScenario}
            previousRecord={previousRecord}
            canReconsider={history.length > 0}
            onConfirmChoice={handleConfirmChoice}
            onReconsider={handleReconsider}
          />
        )}
      </div>

      {/* Footer Info */}
      <footer className="border-t border-black/10 py-6 text-center font-mono text-[11px] text-neutral-400">
        A SMALL ROOM — SOCIAL REHEARSAL &copy; 2026 // BUILT FOR AI CLASS SUBMISSION
      </footer>

      {/* Notes & Ending Collection Modal */}
      {showNotesModal && (
        <EndingsModal
          unlockedEndings={progress.unlockedEndings}
          onClose={() => setShowNotesModal(false)}
        />
      )}

      {/* Restart Confirmation Modal */}
      {showRestartConfirm && (
        <ConfirmModal
          title="RESTART PLAYTHROUGH"
          message="Are you sure you want to restart from the beginning? Your current scene progress will be reset. (Discovered endings remain saved)."
          confirmLabel="START OVER"
          onConfirm={executeRestart}
          onCancel={() => setShowRestartConfirm(false)}
        />
      )}
    </div>
  );
}
