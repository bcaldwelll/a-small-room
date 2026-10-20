/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type CharacterId = 'maya' | 'sam' | 'jules' | 'room';

export type EndingId =
  | 'thread_to_follow'
  | 'bridge_under_repair'
  | 'room_to_breathe'
  | 'ships_in_evening';

export interface StoryChoice {
  id: string;
  label: string;
  intention: string;
  characterTarget: CharacterId;
  targetScenarioId?: string; // If in layers 0-2
  targetEndingId?: EndingId; // If in layer 3
}

export interface Scenario {
  id: string;
  layer: number; // 0, 1, 2, 3
  title: string;
  location: string;
  narrative: string;
  activeCharacters: CharacterId[];
  choices: [StoryChoice, StoryChoice, StoryChoice, StoryChoice]; // Exactly 4 choices
}

export interface Ending {
  id: EndingId;
  title: string;
  subtitle: string;
  epitaph: string;
  narrative: string;
  reflectionPrompt: string;
}

export interface DialogueReaction {
  characterReply: string;
  strength: string;
  pitfall: string;
  suggestedResponse: string;
  takeaway: string;
  score: number; // e.g. 2.5, 1.8, 1.0, 0.4
  grade: 'Optimal' | 'Acceptable' | 'Awkward' | 'Blunder';
}

export interface DialogueOption {
  id: string;
  text: string;
  tone: string;
  nuance: string;
  reaction?: DialogueReaction;
}

export interface RehearsalFeedback {
  transcript: string;
  expressionNotes?: string;
  characterReply: string;
  strength: string;
  pitfall: string;
  suggestedResponse: string;
  takeaway: string;
  score?: number;
  grade?: 'Optimal' | 'Acceptable' | 'Awkward' | 'Blunder';
  isSilenceOrUnintelligible?: boolean;
  unintelligibleReason?: string;
  mode: 'multiple_choice' | 'audio' | 'camera' | 'typed';
}

export interface RehearsalRecord {
  scenarioId: string;
  choiceId: string;
  choiceLabel: string;
  intention: string;
  characterTarget: CharacterId;
  selectedDialogue?: string;
  score?: number;
  grade?: string;
  reaction?: string;
  takeaway?: string;
  feedback?: RehearsalFeedback;
  skipped: boolean;
  timestamp: number;
}

export interface PlaythroughState {
  currentScenarioId: string;
  currentEndingId?: EndingId;
  history: RehearsalRecord[];
  isComplete: boolean;
  startedAt: number;
}

export interface UserProgress {
  unlockedEndings: EndingId[];
  completedCount: number;
  lastActiveState?: PlaythroughState;
}

export interface AiReport {
  theme: string;
  bullets: string[];
}

export interface RehearseApiRequest {
  audio?: {
    mimeType: string;
    data: string; // Base64
  };
  image?: {
    mimeType: string;
    data: string; // Base64
  };
  text?: string;
  sceneContext: {
    sceneId: string;
    sceneTitle: string;
    characterTarget: CharacterId;
    chosenAction: string;
    intention: string;
    previousExchange?: {
      character: string;
      reply: string;
      takeaway: string;
    };
  };
}
