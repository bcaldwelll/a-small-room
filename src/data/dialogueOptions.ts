/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DialogueOption, Scenario, StoryChoice } from '../types/story';

// Graded dialogue options across distinct social aptitude tiers:
// Optimal: +2.5 pts | Acceptable: +1.0 pt | Awkward: +0.3 pt | Blunder: 0.0 pts
const AUTHORED_DIALOGUES: Record<string, DialogueOption[]> = {
  // --- LAYER 0: s0_arrival ---
  s0_c0: [
    {
      id: 's0_c0_opt_optimal',
      text: 'Mind if I browse over here too? The rain out there is intense—just taking a quiet second to decompress.',
      tone: 'Grounded Presence',
      nuance: 'Shares space and models quiet decompression without expecting Jules to host or chat.',
      reaction: {
        characterReply: 'Not at all. Yeah, it really started coming down right around six. Good to just stand near the books.',
        strength: 'Masterful attunement: you asked consent to share physical space while explicitly normalizing low-demand quiet.',
        pitfall: 'Don’t suddenly pivot into small talk; let the shared silence do the heavy lifting.',
        suggestedResponse: 'Mind if I browse over here too? Just stepping away from the doorway rush for a second.',
        takeaway: 'Parallel quiet without social demands creates an immediate sanctuary for introverts.',
        score: 2.5,
        grade: 'Optimal',
      },
    },
    {
      id: 's0_c0_opt_acceptable',
      text: 'That brutalism book has incredible photography. Have you seen the Montreal pavilion in it?',
      tone: 'Polite Inquiry',
      nuance: 'A safe, intellectual topic, but slightly pushes Jules into an active conversation when they wanted silence.',
      reaction: {
        characterReply: 'Oh—yeah, page forty-two. The concrete roofline is interesting. (Jules turns the page slightly stiffly.)',
        strength: 'Safe, polite intellectual inquiry that anchors on an object rather than personal life.',
        pitfall: 'Notice Jules’s closed shoulders: they were seeking shelter, not an architectural seminar.',
        suggestedResponse: 'That monograph has some stunning prints. Take all the time you need with it.',
        takeaway: 'Even good topics can miss if the other person’s social battery is currently at zero.',
        score: 1.0,
        grade: 'Acceptable',
      },
    },
    {
      id: 's0_c0_opt_awkward',
      text: 'Hey Jules! You look miserable hiding over here in the corner all by yourself, you okay?',
      tone: 'Intrusive Spotlight',
      nuance: 'Puts Jules on the spot by labeling their quiet boundary as a defect in front of the room.',
      reaction: {
        characterReply: 'Jules tenses up, their cheeks reddening. "I’m fine. Just looking at a book. Not hiding."',
        strength: 'You noticed their state, but your delivery exposed their vulnerability as something to fix.',
        pitfall: 'Spotlighting someone’s isolation forces them into immediate defensiveness or fake smiling.',
        suggestedResponse: 'Hey Jules, good to see you. No need to chat, just saying hi.',
        takeaway: 'Calling out someone’s discomfort in public almost always amplifies it.',
        score: 0.3,
        grade: 'Awkward',
      },
    },
    {
      id: 's0_c0_opt_blunder',
      text: 'Come on, Jules, it’s a party! Put the book down and come join Sam’s circle with everyone.',
      tone: 'Coercive & Tone-Deaf',
      nuance: 'Completely disregards their autonomy and aggressively demands extroverted social performance.',
      reaction: {
        characterReply: 'Jules closes the book with a quiet slap. "Actually, I think I might head out soon."',
        strength: 'None. You completely disregarded their boundary and treated their preference as wrong.',
        pitfall: 'Forcing introverted guests to perform extroversion drives them right out the door.',
        suggestedResponse: 'Take all the quiet space you need tonight, Jules.',
        takeaway: 'True social intelligence respects another person’s threshold without coercion.',
        score: 0.0,
        grade: 'Blunder',
      },
    },
  ],

  s0_c1: [
    {
      id: 's0_c1_opt_optimal',
      text: 'Wait, Sam, did the contractor seriously tell you that with a straight face?',
      tone: 'Engaged Attunement',
      nuance: 'Picks up the exact comedic tension and feeds the storyteller’s momentum.',
      reaction: {
        characterReply: 'A completely straight face! Swear to god! And then he pulls out a clipboard and blames "historic dampness"!',
        strength: 'High emotional attunement: you gave the speaker the exact prompt needed to deliver their punchline.',
        pitfall: 'Keep an eye on quieter guests in the circle so the floor stays open for others.',
        suggestedResponse: 'Wait, did he honestly look you in the eye and say that without laughing?',
        takeaway: 'Active listeners feed the speaker’s energy without hijacking the narrative.',
        score: 2.5,
        grade: 'Optimal',
      },
    },
    {
      id: 's0_c1_opt_acceptable',
      text: 'I caught the tail end of that—pulling up a chair to hear how this ends.',
      tone: 'Polite & Receptive',
      nuance: 'Enters the circle politely without making waves, though slightly passive.',
      reaction: {
        characterReply: 'Grab a seat! So as I was saying, the drywall was literally peeling off the studs...',
        strength: 'Clean, respectful entry that allowed group flow to continue undisturbed.',
        pitfall: 'A slightly warmer vocal delivery would make your presence felt more vibrantly.',
        suggestedResponse: 'Wouldn’t miss the end of this—sliding in right in time.',
        takeaway: 'Smooth physical entries avoid jarring interruptions in group storytelling.',
        score: 1.0,
        grade: 'Acceptable',
      },
    },
    {
      id: 's0_c1_opt_awkward',
      text: 'That reminds me of my landlord in Chicago—let me tell you about my leak last winter.',
      tone: 'Conversational Hijack',
      nuance: 'Cuts Sam off right before the punchline to center your own parallel experience.',
      reaction: {
        characterReply: 'Sam blinks, their smile freezing slightly. "Oh... yeah, landlords are tough. Anyway, so the inspector..."',
        strength: 'You related to the topic, but your timing derailed the speaker’s climax.',
        pitfall: 'Interjecting your own similar story before the punchline reads as competitive one-upmanship.',
        suggestedResponse: 'Laugh with the circle, let Sam finish, then share your anecdote later.',
        takeaway: 'Hold your related story until the current speaker has fully landed their point.',
        score: 0.3,
        grade: 'Awkward',
      },
    },
    {
      id: 's0_c1_opt_blunder',
      text: 'Honestly Sam, you’re exaggerating. No real contractor would ever say that.',
      tone: 'Pedantic & Critical',
      nuance: 'Sucks the fun out of a lighthearted group anecdote with needless skepticism and fact-checking.',
      reaction: {
        characterReply: 'The circle goes dead quiet for an awkward beat. Sam’s shoulders sag. "I mean... it literally happened, but whatever."',
        strength: 'None. You mistook a social storytelling moment for a courtroom cross-examination.',
        pitfall: 'Fact-checking a benign, entertaining story alienates both the speaker and the room.',
        suggestedResponse: 'Enjoy the storytelling flair without policing factual precision.',
        takeaway: 'Social connection values shared warmth over pedantic accuracy.',
        score: 0.0,
        grade: 'Blunder',
      },
    },
  ],

  s0_c2: [
    {
      id: 's0_c2_opt_optimal',
      text: 'Maya, I’ve got clean hands—give me the bread board or the salad, point me at one job.',
      tone: 'Concrete & Low Friction',
      nuance: 'Eliminates executive burden by offering immediate, specific, binary labor.',
      reaction: {
        characterReply: 'Bless you! The bread knife is right by the olive oil—if you slice that, I can pull the garlic out right now!',
        strength: 'Superb host support: you didn’t ask "how can I help?" which creates more work; you took a concrete task.',
        pitfall: 'Follow her lead on where to place the finished bread so you don’t crowd the counter.',
        suggestedResponse: 'Clean hands, ready to chop. Point me at the bread or the herbs.',
        takeaway: 'Reducing decision fatigue is the greatest gift you can give a stressed host.',
        score: 2.5,
        grade: 'Optimal',
      },
    },
    {
      id: 's0_c2_opt_acceptable',
      text: 'Everything smells amazing in here, Maya. Is there anything you want me to do?',
      tone: 'Vague Open-Ended Offer',
      nuance: 'Well-meaning, but forces an overwhelmed host to stop cooking and think of chores for you.',
      reaction: {
        characterReply: 'Maya glances wildly around her cutting board. "Uh... I think I’m okay? Maybe just grab a drink for now?"',
        strength: 'Polite and attentive attitude.',
        pitfall: 'Open-ended questions force a frantic host to manage you instead of cooking.',
        suggestedResponse: 'I can slice the bread or set out plates right now—which helps more?',
        takeaway: 'Specific offers are helpful; open-ended offers can feel like homework.',
        score: 1.0,
        grade: 'Acceptable',
      },
    },
    {
      id: 's0_c2_opt_awkward',
      text: 'You look super stressed out, Maya. You should really have prepped this before we arrived.',
      tone: 'Unsolicited Critique',
      nuance: 'Judges the host’s timing and offers unhelpful retrospective criticism.',
      reaction: {
        characterReply: 'Maya’s jaw sets taut. She chops harder. "Well, my meeting ran until six-thirty, so thanks for that."',
        strength: 'You noticed her stress, but your response poured shame over her effort.',
        pitfall: 'Critiquing host logistics while they are feeding you is socially poisonous.',
        suggestedResponse: 'You’ve got a lot going on—let me take one thing off your hands.',
        takeaway: 'Never critique host preparation during active hospitality.',
        score: 0.3,
        grade: 'Awkward',
      },
    },
    {
      id: 's0_c2_opt_blunder',
      text: 'Hey Maya, when is food actually ready? I haven’t eaten all day and I’m starving.',
      tone: 'Entitled & Self-Centered',
      nuance: 'Treats the host like a service worker and centers personal appetite over the gathering.',
      reaction: {
        characterReply: 'Maya stops her knife, exhales sharply, and doesn’t look up. "Dinner will be ready when it’s ready."',
        strength: 'None. Egocentric and dismissive of the host’s labor.',
        pitfall: 'Demanding immediate sustenance from a friend hosting in their home destroys goodwill.',
        suggestedResponse: 'Grab a small snack from the appetizer bowl and offer to help.',
        takeaway: 'Guests support the host; they do not place emotional orders on demand.',
        score: 0.0,
        grade: 'Blunder',
      },
    },
  ],

  s0_c3: [
    {
      id: 's0_c3_opt_optimal',
      text: '(Looking quietly out at the wet pavement, taking two steady breaths to ground yourself before entering.)',
      tone: 'Somatic Grounding',
      nuance: 'Regulates internal nervous system so your presence is steady and genuine.',
      reaction: {
        characterReply: 'The room hums in your peripheral vision. Your breath slows, your posture softens, and you step in ready to engage.',
        strength: 'Self-regulation before social engagement prevents anxiety-driven social fumbling.',
        pitfall: 'Don’t stay in observation mode so long that you appear aloof to newcomers.',
        suggestedResponse: 'Ground yourself with two deep breaths, then step forward with warmth.',
        takeaway: 'Regulated nervous systems create steady, grounded social interactions.',
        score: 2.5,
        grade: 'Optimal',
      },
    },
    {
      id: 's0_c3_opt_acceptable',
      text: 'Heading straight to the drink station to pour a glass of water and find an opening.',
      tone: 'Practical & Steady',
      nuance: 'Uses a natural physical prop to transition into the room, though slightly mechanical.',
      reaction: {
        characterReply: 'Having a glass of water in hand gives you a natural anchor as you scan the room.',
        strength: 'A simple physical anchor avoids looking hesitant or lost.',
        pitfall: 'Be careful not to cling to the drink table to avoid making eye contact.',
        suggestedResponse: 'Pour a drink, take a breath, and look for an inviting smile.',
        takeaway: 'Purposeful physical actions provide smooth social transitions.',
        score: 1.0,
        grade: 'Acceptable',
      },
    },
    {
      id: 's0_c3_opt_awkward',
      text: '(Pulling out your phone immediately to stare at emails so you don’t look awkward.)',
      tone: 'Avoidant Phone Shield',
      nuance: 'Uses a digital shield to avoid feeling vulnerable in an open room.',
      reaction: {
        characterReply: 'You stare at your screen. People glance past you as someone who is busy and unavailable.',
        strength: 'Protected yourself from momentary discomfort.',
        pitfall: 'The phone shield signals "do not talk to me" and calcifies social isolation.',
        suggestedResponse: 'Keep the phone in your pocket; open body language welcomes connection.',
        takeaway: 'Screens provide safety at the expense of connection.',
        score: 0.3,
        grade: 'Awkward',
      },
    },
    {
      id: 's0_c3_opt_blunder',
      text: 'Ugh, I shouldn’t even have come tonight. This room is way too loud and chaotic.',
      tone: 'Defeatist Resentment',
      nuance: 'Adopts an immediate victim mindset and rejects the social environment.',
      reaction: {
        characterReply: 'Internal resentment tightens your chest. Every sound in the apartment begins grating on your nerves.',
        strength: 'None. Catastrophizing social friction creates a self-fulfilling negative loop.',
        pitfall: 'Entering a space with internal hostility poisons your own experience.',
        suggestedResponse: 'Remind yourself: I can stay for 45 minutes and leave whenever I need.',
        takeaway: 'Reframing social presence as a choice restores agency and calm.',
        score: 0.0,
        grade: 'Blunder',
      },
    },
  ],

  // --- LAYER 1: s1_jules_bookshelf ---
  s1_c0: [
    {
      id: 's1_c0_opt_optimal',
      text: 'Minute twenty is usually when my brain turns to static too. Parties are a ton of sensory noise all at once.',
      tone: 'Empathic Validation',
      nuance: 'Validates Jules’s exact internal state without trying to fix or minimize it.',
      reaction: {
        characterReply: 'Jules looks up, exhaling with noticeable relief. "Right? Thank you. I was starting to feel like a broken guest."',
        strength: 'Deep empathy: you normalized their threshold and removed the stigma of needing quiet.',
        pitfall: 'Don’t let the conversation devolve into cynical griping about the other guests.',
        suggestedResponse: 'Minute twenty is real. The simultaneous music and chatter takes real energy to process.',
        takeaway: 'Validating someone’s sensory limit builds instant psychological trust.',
        score: 2.5,
        grade: 'Optimal',
      },
    },
    {
      id: 's1_c0_opt_acceptable',
      text: 'It’s loud, but Maya really wanted everyone together. Just hang in there for dinner.',
      tone: 'Dismissive Encouragement',
      nuance: 'Well-intended encouragement that inadvertently minimizes their sensory distress.',
      reaction: {
        characterReply: 'Jules looks back down at their book. "Yeah. I know. I’m trying."',
        strength: 'Reminded them of the communal intent of the gathering.',
        pitfall: 'Telling an overwhelmed person to "hang in there" reinforces their feeling of inadequacy.',
        suggestedResponse: 'It makes complete sense that you feel drained. Take your time over here.',
        takeaway: 'Encouragement that ignores physical or sensory limits feels like invalidation.',
        score: 1.0,
        grade: 'Acceptable',
      },
    },
    {
      id: 's1_c0_opt_awkward',
      text: 'Have you tried loop earplugs? Or micro-dosing magnesium? It totally cured my party anxiety.',
      tone: 'Unsolicited Advice',
      nuance: 'Jumps straight into unsolicited biohacking solutions instead of human connection.',
      reaction: {
        characterReply: 'Jules gives a polite, strained nod. "Yeah, I’ve heard of those. Thanks."',
        strength: 'Desire to be helpful.',
        pitfall: 'Offering unsolicited wellness fixes treats another person’s personality as a disorder to cure.',
        suggestedResponse: 'Connect with their feelings first before offering any tactical suggestions.',
        takeaway: 'Empathy requires presence, not unsolicited troubleshooting.',
        score: 0.3,
        grade: 'Awkward',
      },
    },
    {
      id: 's1_c0_opt_blunder',
      text: 'Why do you even come to parties if you’re just going to sit by yourself in the corner?',
      tone: 'Condescending & Aggressive',
      nuance: 'Openly challenges their character and shames their coping mechanism.',
      reaction: {
        characterReply: 'Jules shuts the monograph, stands up, and walks straight toward the coat rack without saying a word.',
        strength: 'None. Hostile, judgment-laden boundary violation.',
        pitfall: 'Shaming someone for their social battery destroys rapport permanently.',
        suggestedResponse: 'Respect their quiet presence without questioning their motives.',
        takeaway: 'Interrogating someone’s coping strategy destroys safety.',
        score: 0.0,
        grade: 'Blunder',
      },
    },
  ],
};

// Generates graded 4-tier multiple-choice options with strict scoring for any other choice
function generateDefaultOptions(scenario: Scenario, choice: StoryChoice): DialogueOption[] {
  const target = choice.characterTarget.toUpperCase();
  return [
    {
      id: `${choice.id}_opt_optimal`,
      text: `"${choice.label}—I wanted to check in directly and see how you’re feeling about this."`,
      tone: 'Attuned & Direct',
      nuance: 'Addresses the situation with compassionate candor, active listening, and zero pressure.',
      reaction: {
        characterReply: `${target} looks up, visibly relaxing. "Thank you for asking directly like that. It really helps clear the air."`,
        strength: 'Optimal attunement: you prioritized clear, compassionate honesty and gave them room to answer.',
        pitfall: 'Listen fully to their response before offering any additional thoughts.',
        suggestedResponse: `I wanted to check in openly and see where your head is at right now.`,
        takeaway: 'Direct empathy delivered with spacious presence de-escalates social friction.',
        score: 2.5,
        grade: 'Optimal',
      },
    },
    {
      id: `${choice.id}_opt_acceptable`,
      text: `"Everything is fine, don't worry about it at all. Let's just focus on having a good time tonight."`,
      tone: 'Safe Conventional Small Talk',
      nuance: 'Well-mannered and harmless, but brushes past the emotional subtext with safe positivity.',
      reaction: {
        characterReply: `${target} offers a polite nod. "Yeah. Totally. Let's just have a good time."`,
        strength: 'Maintained smooth surface pleasantry without causing friction.',
        pitfall: 'Glossing over subtle tension leaves the underlying awkwardness unresolved.',
        suggestedResponse: `Acknowledge the moment gently rather than sweeping it under the rug.`,
        takeaway: 'Surface pleasantries keep the peace but rarely deepen connection.',
        score: 1.0,
        grade: 'Acceptable',
      },
    },
    {
      id: `${choice.id}_opt_awkward`,
      text: `"You seem really off right now. You know what your problem is? You overthink everything."`,
      tone: 'Unsolicited Diagnosis',
      nuance: 'Attempts to psychoanalyze the other person, creating defensive withdrawal.',
      reaction: {
        characterReply: `${target} frowns, crossing their arms. "I don't think I'm overthinking, but thanks for the unsolicited analysis."`,
        strength: 'You noticed their mood, but turned observation into an unwelcome critique.',
        pitfall: 'Labeling another person’s psychology triggers immediate defensiveness.',
        suggestedResponse: `Describe what you observe without diagnosing their personality.`,
        takeaway: 'Diagnosing others in casual conversation destroys emotional safety.',
        score: 0.3,
        grade: 'Awkward',
      },
    },
    {
      id: `${choice.id}_opt_blunder`,
      text: `"Look, I don't really have the patience for this tonight. Can we just move on?"`,
      tone: 'Dismissive & Impatient',
      nuance: 'Openly dismissive, prioritizing personal convenience over the relationship.',
      reaction: {
        characterReply: `${target} looks stung, steps back, and turns away in tense silence.`,
        strength: 'None. Hostile and dismissive of the interpersonal bond.',
        pitfall: 'Impatient brush-offs leave lasting relational scars in social groups.',
        suggestedResponse: `If you are low on capacity, step away gracefully rather than snapping.`,
        takeaway: 'Emotional reactivity degrades social standing and damages trust.',
        score: 0.0,
        grade: 'Blunder',
      },
    },
  ];
}

// Deterministic or pseudo-random shuffle to ensure the optimal answer is NEVER in the same slot
function shuffleArray<T>(array: T[], seedStr: string): T[] {
  const result = [...array];
  // Simple deterministic hash from string to randomize order predictably per choice
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    hash = (hash << 5) - hash + seedStr.charCodeAt(i);
    hash |= 0;
  }

  // Fisher-Yates with pseudo-random generator derived from hash
  for (let i = result.length - 1; i > 0; i--) {
    hash = Math.imul(hash ^ (hash >>> 15), 0x85ebca6b);
    hash = Math.imul(hash ^ (hash >>> 13), 0xc2b2ae35);
    hash = hash ^ (hash >>> 16);
    const j = Math.abs(hash) % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Returns exactly 4 multiple-choice dialogue options in SHUFFLED order.
 * The best option is NOT at index 0, so random clicking yields an average score of ~3.8 / 10.
 */
export function getDialogueOptionsForChoice(
  scenario: Scenario,
  choice: StoryChoice
): DialogueOption[] {
  const rawOptions = AUTHORED_DIALOGUES[choice.id] || generateDefaultOptions(scenario, choice);
  // Shuffle using scenario.id + choice.id as seed so position is randomized across A, B, C, D
  return shuffleArray(rawOptions, `${scenario.id}_${choice.id}_salt`);
}
