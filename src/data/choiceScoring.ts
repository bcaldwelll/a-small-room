/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ChoiceEvaluation {
  score: number; // Optimal: 2.5, Acceptable: 1.2, Awkward: 0.4, Blunder: 0.0
  grade: 'Optimal' | 'Acceptable' | 'Awkward' | 'Blunder';
  reaction: string;
  strength: string;
  pitfall: string;
  takeaway: string;
}

// Scored outcomes for the 4 multiple choice options in each scenario
export const SCENARIO_CHOICE_EVALUATIONS: Record<string, ChoiceEvaluation> = {
  // --- LAYER 0: s0_arrival ---
  // Option 1: Approach Jules by the bookshelf with low-key presence
  s0_c0: {
    score: 2.5,
    grade: 'Optimal',
    reaction: 'Jules looks up from the monograph, shoulders noticeably easing. They offer a quiet nod and nudge the stack of prints toward you.',
    strength: 'Masterful attunement: you prioritized quiet companionship over performative social chatter.',
    pitfall: 'Avoid rushing to fill the silence; let shared quiet establish safety first.',
    takeaway: 'Parallel low-demand presence builds trust faster than forced small talk.',
  },
  // Option 2: Slide into the circle around Sam's story
  s0_c1: {
    score: 1.5,
    grade: 'Acceptable',
    reaction: 'Sam beams and gestures toward an empty chair, enthusiastically expanding on the contractor story as you sit down.',
    strength: 'Good communal energy: you supported the room’s extroverted momentum smoothly.',
    pitfall: 'Notice who in the circle is being talked over; group momentum can easily crowd out quieter guests.',
    takeaway: 'Joining animated groups is welcoming, provided you remain attentive to group balance.',
  },
  // Option 3: Step into the kitchen and offer Maya an extra pair of hands
  s0_c2: {
    score: 1.2,
    grade: 'Acceptable',
    reaction: 'Maya glances up with a stressed smile. "Thanks! If you could slice the baguette by the olive oil, that would save my life."',
    strength: 'Practical host generosity that reduced kitchen workload.',
    pitfall: 'Make sure not to crowd her physical workspace or force her to manage you.',
    takeaway: 'Concrete offers of assistance ease host anxiety, provided you follow their kitchen lead.',
  },
  // Option 4: Take a quiet pause near the window to get your bearings
  s0_c3: {
    score: 0.8,
    grade: 'Awkward',
    reaction: 'You stand by the window looking at the rain. Several guests glance past you, unsure if you are waiting for someone or feeling isolated.',
    strength: 'Self-regulation before entering a crowded room.',
    pitfall: 'Lingering on the perimeter too long can read as aloof detachment or awkward hesitation.',
    takeaway: 'Take a breath to ground yourself, but transition into the room before isolation hardens.',
  },

  // --- LAYER 1: s1_jules_bookshelf ---
  // s1_c0: Validate the sensory overload without offering fixes
  s1_c0: {
    score: 2.5,
    grade: 'Optimal',
    reaction: 'Jules exhales visibly. "Honestly, thank you. I was feeling like a broken guest. It means a lot to not have someone try to fix it."',
    strength: 'Deep empathy: you held space for their internal threshold without pathologizing it.',
    pitfall: 'Don’t let validation turn into cynical griping about the other guests.',
    takeaway: 'Validating another person’s sensory limit builds instant psychological safety.',
  },
  // s1_c1: Ask an open question about the book they are holding
  s1_c1: {
    score: 1.5,
    grade: 'Acceptable',
    reaction: 'Jules points out a brutalist courtyard photo on page forty. The conversation is polite, though slightly intellectualized.',
    strength: 'Safe external anchor: focused on a shared object rather than personal discomfort.',
    pitfall: 'Intellectual banter can sometimes keep the interaction at arm’s length.',
    takeaway: 'Shared objects provide low-friction entry points when emotional energy is low.',
  },
  // s1_c2: Suggest stepping onto the fire escape for fresh air
  s1_c2: {
    score: 1.0,
    grade: 'Acceptable',
    reaction: 'Jules hesitates. "The rain is pretty heavy out there... maybe in a little bit." They turn back to the shelf.',
    strength: 'Generous intent to offer an escape hatch from the noise.',
    pitfall: 'Suggesting a physical relocation can feel like managing their behavior.',
    takeaway: 'Offer options gently without imposing a rescue plan.',
  },
  // s1_c3: Excuse yourself quickly to let them read in peace
  s1_c3: {
    score: 0.4,
    grade: 'Awkward',
    reaction: 'Jules blinks as you turn away. An awkward silence settles between the bookshelves, leaving an abrupt conversational void.',
    strength: 'Attempt to respect their solitude.',
    pitfall: 'Fleeing the conversation abruptly can feel like subtle rejection or disapproval.',
    takeaway: 'Gentle boundaries require warm transitions rather than hasty departures.',
  },

  // --- LAYER 1: s2_sam_story ---
  s2_c0: {
    score: 2.5,
    grade: 'Optimal',
    reaction: 'Sam lights up, laughing warmly, and dives straight into the absurdity of the inspector’s clipboard.',
    strength: 'Attuned active listening: fed the storyteller’s comedic momentum without stealing focus.',
    pitfall: 'Be attentive to whether other listeners also get opportunities to react.',
    takeaway: 'Encouraging the speaker’s core theme builds communal warmth and cohesion.',
  },
  s2_c1: {
    score: 1.2,
    grade: 'Acceptable',
    reaction: 'Sam nods along, but the energy in the circle dips slightly as the topic becomes a broader discussion.',
    strength: 'Inclusive instinct to expand the group discussion.',
    pitfall: 'Diluting a lively story mid-flow can deflate the room’s spontaneous laughter.',
    takeaway: 'Let a great story land before steering the group toward broad roundtable topics.',
  },
  s2_c2: {
    score: 0.4,
    grade: 'Awkward',
    reaction: 'Sam’s smile freezes momentarily as you jump in with your own apartment anecdote before they finished their punchline.',
    strength: 'Desire to relate through shared experience.',
    pitfall: 'Interjecting with a competing anecdote before the speaker finishes reads as one-upmanship.',
    takeaway: 'Hold your related story until the current speaker has fully concluded theirs.',
  },
  s2_c3: {
    score: 0.0,
    grade: 'Blunder',
    reaction: 'The circle goes dead quiet. Sam frowns. "I mean... it literally happened, but okay." An awkward tension hangs in the air.',
    strength: 'None. Skeptical contradiction destroyed the lighthearted moment.',
    pitfall: 'Fact-checking an entertaining social anecdote alienates both speaker and room.',
    takeaway: 'Social connection prioritizes shared camaraderie over pedantic fact-checking.',
  },

  // --- LAYER 1: s3_maya_kitchen ---
  s3_c0: {
    score: 2.5,
    grade: 'Optimal',
    reaction: 'Maya breathes an audible sigh of relief. "You are an angel. Slice the bread and I can pull the roasting pan right now!"',
    strength: 'Reduced decision fatigue by taking on concrete, binary prep work.',
    pitfall: 'Keep your presence compact so you don’t crowd her cooking lane.',
    takeaway: 'Specific offers of physical assistance relieve host overwhelm far more than vague questions.',
  },
  s3_c1: {
    score: 1.2,
    grade: 'Acceptable',
    reaction: 'Maya glances around frantically. "Uh... I think I’m good? Just grab a cider for now!"',
    strength: 'Kind, well-meaning gesture.',
    pitfall: 'Asking "what can I do?" forces an overwhelmed host to pause and delegate.',
    takeaway: 'When a host is swamped, suggest a specific task rather than asking open questions.',
  },
  s3_c2: {
    score: 0.4,
    grade: 'Awkward',
    reaction: 'Maya’s jaw tightens. "Yeah, my meeting ran late today, so I’m doing what I can." The kitchen air grows tense.',
    strength: 'Observed her stress level.',
    pitfall: 'Commenting on a host’s frantic pacing inadvertently sounds like a critique.',
    takeaway: 'Never critique host logistics while they are working to feed you.',
  },
  s3_c3: {
    score: 0.0,
    grade: 'Blunder',
    reaction: 'Maya drops her knife with a sharp clatter. "Dinner will be ready when it’s ready, okay?" She turns her back to the counter.',
    strength: 'None. Demanding personal timing from an overwhelmed host.',
    pitfall: 'Treating a friend hosting a gathering like a restaurant service worker destroys rapport.',
    takeaway: 'Guests support the host; they do not place demands on host capacity.',
  },

  // --- LAYER 1: s4_quiet_pause ---
  s4_c0: {
    score: 2.5,
    grade: 'Optimal',
    reaction: 'You ground yourself with deep breathing. Your posture relaxes, your mind clears, and you step into the room centered.',
    strength: 'Somatic self-regulation: entered the social space from a place of calm presence.',
    pitfall: 'Don’t linger indefinitely in observation mode.',
    takeaway: 'A grounded nervous system is the foundation of genuine social attunement.',
  },
  s4_c1: {
    score: 1.5,
    grade: 'Acceptable',
    reaction: 'You pour a glass of water from the credenza, using the physical action to transition smoothly toward the kitchen.',
    strength: 'Practical social transition that felt natural and unhurried.',
    pitfall: 'Be careful not to use refreshment tables as permanent social shields.',
    takeaway: 'Simple physical actions provide smooth transitions into social circles.',
  },
  s4_c2: {
    score: 0.8,
    grade: 'Awkward',
    reaction: 'You pull out your phone and pretend to read messages. People walk past without speaking, assuming you are busy.',
    strength: 'Momentary self-protection.',
    pitfall: 'The phone shield signals unapproachability and deepens isolation.',
    takeaway: 'Digital distraction protects you from temporary awkwardness at the cost of connection.',
  },
  s4_c3: {
    score: 0.0,
    grade: 'Blunder',
    reaction: 'Internal resentment builds. You feel irritated by the laughter and noise, wishing you hadn’t come.',
    strength: 'None. Resentful withdrawal poisons your own experience.',
    pitfall: 'Adopting a victim mindset in social settings becomes a self-fulfilling negative loop.',
    takeaway: 'Reframing presence as a voluntary choice restores agency and calm.',
  },
};

// Fallback scoring generator for Layer 2 & Layer 3 choices based on choice index
export function getChoiceEvaluation(choiceId: string, choiceIndex: number): ChoiceEvaluation {
  if (SCENARIO_CHOICE_EVALUATIONS[choiceId]) {
    return SCENARIO_CHOICE_EVALUATIONS[choiceId];
  }

  // Balanced gradient across the 4 options:
  // Index 0: Optimal (+2.5)
  // Index 1: Acceptable (+1.2)
  // Index 2: Awkward (+0.4)
  // Index 3: Blunder (0.0)
  if (choiceIndex === 0) {
    return {
      score: 2.5,
      grade: 'Optimal',
      reaction: 'The room shifts warmly. Your approach was grounded, compassionate, and attentive to subtle emotional cues.',
      strength: 'High situational attunement: prioritized mutual dignity and spacious presence.',
      pitfall: 'Continue to listen closely as the conversation develops.',
      takeaway: 'Intentional, empathetic choices cultivate safety and deep trust.',
    };
  } else if (choiceIndex === 1) {
    return {
      score: 1.2,
      grade: 'Acceptable',
      reaction: 'The conversation moves along smoothly. Your response was polite and pleasant, though kept to safe surface ground.',
      strength: 'Maintained social harmony without creating friction.',
      pitfall: 'Leaning solely on safe clichés can miss deeper emotional subtext.',
      takeaway: 'Conventional courtesy keeps the peace, but vulnerable attunement deepens rapport.',
    };
  } else if (choiceIndex === 2) {
    return {
      score: 0.4,
      grade: 'Awkward',
      reaction: 'A slight hesitation ripples through the exchange. Your choice felt slightly forced or intrusive.',
      strength: 'Desire to participate.',
      pitfall: 'Pushing an agenda or spotlighting discomfort creates defensive walls.',
      takeaway: 'Respecting boundaries requires patience rather than eager problem-solving.',
    };
  } else {
    return {
      score: 0.0,
      grade: 'Blunder',
      reaction: 'An uncomfortable silence descends. The other person looks taken aback by your blunt or dismissive stance.',
      strength: 'None. Lacked situational awareness.',
      pitfall: 'Impatient or self-centered reactions cause lasting social friction.',
      takeaway: 'Emotional reactivity degrades social standing and damages interpersonal trust.',
    };
  }
}
