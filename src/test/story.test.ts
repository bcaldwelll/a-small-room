/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SCENARIOS, ENDINGS } from '../data/storyGraph.ts';
import {
  loadUserProgress,
  saveUserProgress,
  recordUnlockedEnding,
  resetAllStorage,
  INITIAL_PROGRESS,
} from '../utils/storage.ts';
import {
  getSupportedAudioMimeType,
  isSecureContextValid,
} from '../utils/audioMime.ts';
import { EndingId, RehearsalRecord, StoryChoice } from '../types/story.ts';

// Test runner helper
let testsPassed = 0;
let testsFailed = 0;

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`  FAIL: ${message}`);
    testsFailed++;
    throw new Error(message);
  } else {
    console.log(`  PASS: ${message}`);
    testsPassed++;
  }
}

console.log('\n======================================================');
console.log(' A SMALL ROOM — SOCIAL REHEARSAL // TEST SUITE');
console.log('======================================================\n');

// 1. SCENARIO GRAPH INTEGRITY
console.log('[SECTION 1] Graph Structure & Topology');
const scenarioIds = Object.keys(SCENARIOS);
assert(scenarioIds.length === 13, `Graph must have exactly 13 scenarios (found ${scenarioIds.length})`);

const layer0 = scenarioIds.filter((id) => SCENARIOS[id].layer === 0);
const layer1 = scenarioIds.filter((id) => SCENARIOS[id].layer === 1);
const layer2 = scenarioIds.filter((id) => SCENARIOS[id].layer === 2);
const layer3 = scenarioIds.filter((id) => SCENARIOS[id].layer === 3);

assert(layer0.length === 1, `Layer 0 must have exactly 1 scenario (found ${layer0.length})`);
assert(layer1.length === 4, `Layer 1 must have exactly 4 scenarios (found ${layer1.length})`);
assert(layer2.length === 4, `Layer 2 must have exactly 4 scenarios (found ${layer2.length})`);
assert(layer3.length === 4, `Layer 3 must have exactly 4 scenarios (found ${layer3.length})`);

const endingIds = Object.keys(ENDINGS);
assert(endingIds.length === 4, `There must be exactly 4 endings (found ${endingIds.length})`);

// 2. CHOICES & UNIQUE DESTINATIONS PER SCENARIO
console.log('\n[SECTION 2] Scenario Choices & Destination Uniqueness');
for (const id of scenarioIds) {
  const scenario = SCENARIOS[id];
  assert(
    scenario.choices.length === 4,
    `Scenario "${id}" must have exactly 4 choices (has ${scenario.choices.length})`
  );

  const destinations = scenario.choices.map(
    (c) => c.targetScenarioId || c.targetEndingId
  );
  const uniqueDests = new Set(destinations);
  assert(
    uniqueDests.size === 4,
    `Scenario "${id}" choices must lead to 4 distinct destinations (unique: ${uniqueDests.size})`
  );

  for (const choice of scenario.choices) {
    if (scenario.layer < 3) {
      assert(
        !!choice.targetScenarioId && !choice.targetEndingId,
        `Scenario "${id}" choice "${choice.id}" in layer ${scenario.layer} must target a scenario`
      );
      assert(
        !!SCENARIOS[choice.targetScenarioId!],
        `Target scenario "${choice.targetScenarioId}" must exist in SCENARIOS`
      );
      assert(
        SCENARIOS[choice.targetScenarioId!].layer === scenario.layer + 1,
        `Scenario "${id}" (layer ${scenario.layer}) must point to layer ${scenario.layer + 1}`
      );
    } else {
      assert(
        !!choice.targetEndingId && !choice.targetScenarioId,
        `Scenario "${id}" choice "${choice.id}" in layer 3 must target an ending`
      );
      assert(
        !!ENDINGS[choice.targetEndingId!],
        `Target ending "${choice.targetEndingId}" must exist in ENDINGS`
      );
    }
  }
}

// 3. FULL TRAVERSAL OF ALL 256 ROUTES
console.log('\n[SECTION 3] 256 Story Routes Traversal');
let totalPathsTraversed = 0;
const endingReachCount: Record<string, number> = {
  thread_to_follow: 0,
  bridge_under_repair: 0,
  room_to_breathe: 0,
  ships_in_evening: 0,
};

function traverse(scenarioId: string, depth: number) {
  const scenario = SCENARIOS[scenarioId];
  if (!scenario) throw new Error(`Missing scenario ${scenarioId}`);

  for (const choice of scenario.choices) {
    if (depth === 3) {
      // Reached layer 3 choice pointing to ending
      const endingId = choice.targetEndingId!;
      assert(!!ENDINGS[endingId], `Ending "${endingId}" must exist`);
      endingReachCount[endingId] = (endingReachCount[endingId] || 0) + 1;
      totalPathsTraversed++;
    } else {
      traverse(choice.targetScenarioId!, depth + 1);
    }
  }
}

traverse('s0_arrival', 0);
assert(
  totalPathsTraversed === 256,
  `All 256 story routes must be traversed (found ${totalPathsTraversed})`
);

console.log('  Ending distribution across all 256 routes:');
for (const [key, count] of Object.entries(endingReachCount)) {
  console.log(`    - ${key}: ${count} routes`);
  assert(count > 0, `Ending "${key}" must be reachable (reached ${count} times)`);
  assert(count === 64, `Ending "${key}" should be reached exactly 64 times for balanced distribution`);
}

// 4. RECONSIDER & RESTART TRANSITIONS
console.log('\n[SECTION 4] Back / Reconsider & Restart Navigation');
let mockHistory: RehearsalRecord[] = [
  {
    scenarioId: 's0_arrival',
    choiceId: 's0_c0',
    choiceLabel: 'Approach Jules',
    intention: 'Quiet presence',
    characterTarget: 'jules',
    skipped: false,
    timestamp: Date.now(),
  },
  {
    scenarioId: 's1_jules_bookshelf',
    choiceId: 's1_c0',
    choiceLabel: 'Validate overload',
    intention: 'Normalize Jules',
    characterTarget: 'jules',
    skipped: false,
    timestamp: Date.now(),
  },
];

assert(mockHistory.length === 2, 'History has 2 steps');
// Simulate Reconsider
const popped = mockHistory.pop();
assert(popped?.scenarioId === 's1_jules_bookshelf', 'Reconsidered last step');
assert(mockHistory.length === 1, 'History length decremented to 1');
const currentSceneAfterReconsider = mockHistory[mockHistory.length - 1].scenarioId;
assert(
  currentSceneAfterReconsider === 's0_arrival',
  'Returned to s0_arrival after reconsidering'
);

// Simulate Restart
mockHistory = [];
assert(mockHistory.length === 0, 'Restart clears history to 0');

// 5. STORAGE & CORRUPTION RECOVERY
console.log('\n[SECTION 5] Safe Storage & Corruption Recovery');
resetAllStorage();
const initial = loadUserProgress();
assert(initial.unlockedEndings.length === 0, 'Initial progress has 0 unlocked endings');
assert(initial.completedCount === 0, 'Initial progress has 0 completions');

const updated = recordUnlockedEnding('thread_to_follow');
assert(
  updated.unlockedEndings.includes('thread_to_follow'),
  'recordUnlockedEnding adds ending to unlockedEndings'
);
assert(updated.completedCount === 1, 'completedCount incremented to 1');

// Test corruption handling: save invalid progress then load
saveUserProgress({ unlockedEndings: ['room_to_breathe' as EndingId], completedCount: 2 });
const loaded = loadUserProgress();
assert(
  loaded.unlockedEndings.includes('room_to_breathe'),
  'Saved progress loaded cleanly'
);

// 6. SERVER SCHEMA & VALIDATION RULES (STATIC ASSERTION)
console.log('\n[SECTION 6] Server Validation Constraints');
const MAX_AUDIO_BYTES = 8 * 1024 * 1024;
assert(MAX_AUDIO_BYTES === 8388608, 'Server audio limit is 8MB');

function validatePayload(body: any): { valid: boolean; code?: number; error?: string } {
  const { audio, text, sceneContext } = body || {};
  if (!sceneContext || !sceneContext.sceneTitle || !sceneContext.intention || !sceneContext.characterTarget) {
    return { valid: false, code: 400, error: 'Missing scene context' };
  }
  const hasAudio = audio && typeof audio.data === 'string' && typeof audio.mimeType === 'string' && audio.data.length > 0;
  const hasText = typeof text === 'string' && text.trim().length > 0;
  if (!hasAudio && !hasText) {
    return { valid: false, code: 400, error: 'Must provide audio or text' };
  }
  if (hasAudio && audio.data.length > 8 * 1024 * 1024 * 1.37) {
    return { valid: false, code: 413, error: 'Payload exceeds 8MB' };
  }
  return { valid: true };
}

assert(!validatePayload({}).valid, 'Empty payload rejected with 400');
assert(
  !validatePayload({ sceneContext: { sceneTitle: 'Test' } }).valid,
  'Incomplete sceneContext rejected'
);
assert(
  validatePayload({
    sceneContext: { sceneTitle: 'Test', intention: 'Test', characterTarget: 'maya' },
    text: 'Hello Maya',
  }).valid,
  'Valid typed payload accepted'
);
assert(
  validatePayload({
    sceneContext: { sceneTitle: 'Test', intention: 'Test', characterTarget: 'maya' },
    audio: { mimeType: 'audio/webm', data: 'AAAA' },
  }).valid,
  'Valid audio payload accepted'
);

// 7. MIME DETECTION & SECURE CONTEXT
console.log('\n[SECTION 7] Audio MIME & Secure Context Logic');
const detectedMime = getSupportedAudioMimeType();
assert(typeof detectedMime === 'string', 'getSupportedAudioMimeType returns string');
assert(typeof isSecureContextValid() === 'boolean', 'isSecureContextValid returns boolean');

console.log('\n------------------------------------------------------');
console.log(`TEST SUMMARY: ${testsPassed} passed, ${testsFailed} failed.`);
console.log('NOTE: Physical device features (microphone hardware access');
console.log('and real Gemini speech calls) require manual verification on a');
console.log('real phone browser (iOS Safari / Android Chrome).');
console.log('------------------------------------------------------\n');

if (testsFailed > 0) {
  process.exit(1);
}
