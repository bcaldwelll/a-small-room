/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { EndingId, PlaythroughState, UserProgress } from '../types/story';

const PROGRESS_KEY = 'a_small_room_progress_v1';
const NOTES_KEY = 'a_small_room_notes_v1';

// In-memory fallback in case localStorage is blocked, corrupted, or disabled
let memoryStorage: Record<string, string> = {};

function safeGetItem(key: string): string | null {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(key);
    }
  } catch (err) {
    console.warn('[Storage] localStorage getItem failed, using memory storage:', err);
  }
  return memoryStorage[key] ?? null;
}

function safeSetItem(key: string, value: string): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, value);
      return;
    }
  } catch (err) {
    console.warn('[Storage] localStorage setItem failed, using memory storage:', err);
  }
  memoryStorage[key] = value;
}

function safeRemoveItem(key: string): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(key);
    }
  } catch (err) {
    console.warn('[Storage] localStorage removeItem failed:', err);
  }
  delete memoryStorage[key];
}

export const INITIAL_PROGRESS: UserProgress = {
  unlockedEndings: [],
  completedCount: 0,
};

export function loadUserProgress(): UserProgress {
  const raw = safeGetItem(PROGRESS_KEY);
  if (!raw) return { ...INITIAL_PROGRESS };
  try {
    const parsed = JSON.parse(raw);
    return {
      unlockedEndings: Array.isArray(parsed.unlockedEndings) ? parsed.unlockedEndings : [],
      completedCount: typeof parsed.completedCount === 'number' ? parsed.completedCount : 0,
      lastActiveState: parsed.lastActiveState || undefined,
    };
  } catch (err) {
    console.warn('[Storage] Failed to parse stored progress, returning default:', err);
    return { ...INITIAL_PROGRESS };
  }
}

export function saveUserProgress(progress: UserProgress): void {
  try {
    // Sanitize state: ensure no audio data or giant blobs are stored
    const sanitized: UserProgress = {
      unlockedEndings: progress.unlockedEndings,
      completedCount: progress.completedCount,
      lastActiveState: progress.lastActiveState
        ? {
            currentScenarioId: progress.lastActiveState.currentScenarioId,
            currentEndingId: progress.lastActiveState.currentEndingId,
            isComplete: progress.lastActiveState.isComplete,
            startedAt: progress.lastActiveState.startedAt,
            history: progress.lastActiveState.history.map((h) => ({
              scenarioId: h.scenarioId,
              choiceId: h.choiceId,
              choiceLabel: h.choiceLabel,
              intention: h.intention,
              characterTarget: h.characterTarget,
              skipped: h.skipped,
              timestamp: h.timestamp,
              feedback: h.feedback
                ? {
                    transcript: h.feedback.transcript,
                    characterReply: h.feedback.characterReply,
                    strength: h.feedback.strength,
                    pitfall: h.feedback.pitfall,
                    suggestedResponse: h.feedback.suggestedResponse,
                    takeaway: h.feedback.takeaway,
                    mode: h.feedback.mode,
                  }
                : undefined,
            })),
          }
        : undefined,
    };
    safeSetItem(PROGRESS_KEY, JSON.stringify(sanitized));
  } catch (err) {
    console.warn('[Storage] Failed to save progress:', err);
  }
}

export function recordUnlockedEnding(endingId: EndingId): UserProgress {
  const current = loadUserProgress();
  const unlocked = new Set<EndingId>(current.unlockedEndings);
  unlocked.add(endingId);
  const updated: UserProgress = {
    ...current,
    unlockedEndings: Array.from(unlocked),
    completedCount: current.completedCount + 1,
  };
  saveUserProgress(updated);
  return updated;
}

export function clearPlaythroughProgress(): void {
  const current = loadUserProgress();
  const updated: UserProgress = {
    ...current,
    lastActiveState: undefined,
  };
  saveUserProgress(updated);
}

export function loadConversationNotes(): string {
  return safeGetItem(NOTES_KEY) || '';
}

export function saveConversationNotes(notes: string): void {
  safeSetItem(NOTES_KEY, notes.slice(0, 5000)); // Cap notes size
}

export function resetAllStorage(): void {
  safeRemoveItem(PROGRESS_KEY);
  safeRemoveItem(NOTES_KEY);
  memoryStorage = {};
}
