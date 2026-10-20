/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Ending, EndingId, Scenario } from '../types/story';

export const SCENARIOS: Record<string, Scenario> = {
  // LAYER 0 (1 Scenario)
  s0_arrival: {
    id: 's0_arrival',
    layer: 0,
    title: 'The Hallway Threshold',
    location: "Maya's Third-Floor Apartment",
    narrative:
      "Rain beads on the glass in the vestibule below. Up here, Maya's front door stands an inch ajar, letting out warmth, roasted garlic, and the uneven cadence of three people finding their footing.\n\nIn the living room, Sam is gesturing with an empty cider glass, deep into an animated story. Jules sits near the low bookshelf, shoulders drawn in, leafing slowly through an architectural monograph. In the kitchen island across from them, Maya chops herbs with quick, taut strokes, glancing at the stove clock.\n\nYou kick off your wet boots by the rack. The air smells of cedar and butter.",
    activeCharacters: ['maya', 'sam', 'jules', 'room'],
    choices: [
      {
        id: 's0_c0',
        label: 'Approach Jules by the bookshelf with low-key presence',
        intention: 'Offer quiet companionship without demanding immediate socialization or mingling.',
        characterTarget: 'jules',
        targetScenarioId: 's1_jules_bookshelf',
      },
      {
        id: 's0_c1',
        label: "Slide into the circle around Sam's story",
        intention: 'Join the animated group energy and give Sam attentive listening.',
        characterTarget: 'sam',
        targetScenarioId: 's2_sam_story',
      },
      {
        id: 's0_c2',
        label: 'Step into the kitchen and offer Maya an extra pair of hands',
        intention: 'Offer practical support to the host while assessing what she actually needs.',
        characterTarget: 'maya',
        targetScenarioId: 's3_maya_kitchen',
      },
      {
        id: 's0_c3',
        label: 'Take a quiet pause near the window to get your bearings',
        intention: 'Regulate your own nervous system and observe the room before stepping into conversation.',
        characterTarget: 'room',
        targetScenarioId: 's4_quiet_pause',
      },
    ],
  },

  // LAYER 1 (4 Scenarios)
  s1_jules_bookshelf: {
    id: 's1_jules_bookshelf',
    layer: 1,
    title: 'The Bookshelf Corner',
    location: 'Beside the Japanese Maple by the Shelf',
    narrative:
      'The floorboard creaks softly under your sock. Jules looks up, their thumb caught between pages forty and forty-one of a brutalist photography book. For a second, a flash of defensiveness crosses their brow, as if bracing for someone telling them to "come out of their shell."\n\nAcross the room, Sam laughs loudly. Jules lowers their voice. "I promised Maya I\'d come, but honestly, by minute twenty in a room this loud, my brain turns into static." They pause, watching your face to see if you will judge them or try to fix it.',
    activeCharacters: ['jules'],
    choices: [
      {
        id: 's1_c0',
        label: 'Validate the sensory overload without offering fixes',
        intention: 'Normalize Jules’s response and hold space without unsolicited advice.',
        characterTarget: 'jules',
        targetScenarioId: 's5_conversation_crossroads',
      },
      {
        id: 's1_c1',
        label: 'Ask an open question about the book they are holding',
        intention: 'Provide an external, low-pressure anchor for dialogue without personal interrogation.',
        characterTarget: 'jules',
        targetScenarioId: 's6_sam_dilemma',
      },
      {
        id: 's1_c2',
        label: 'Encourage Jules to come join Sam to break the ice',
        intention: 'Nudge Jules into the lively center of the room with well-meaning cheer.',
        characterTarget: 'jules',
        targetScenarioId: 's7_kitchen_tension',
      },
      {
        id: 's1_c3',
        label: 'Share that you also need a minute to acclimate to gatherings',
        intention: 'Level the social field by revealing your own vulnerability and pace.',
        characterTarget: 'jules',
        targetScenarioId: 's8_quiet_balcony',
      },
    ],
  },

  s2_sam_story: {
    id: 's2_sam_story',
    layer: 1,
    title: "The Mid-Tale Lull",
    location: 'Around the Low Coffee Table',
    narrative:
      'Sam is midway through an account of an absurd design sprint interview: "...and then the interviewer asks me to pitch an umbrella to someone living in the Mojave. With a straight face!"\n\nSam pauses for dramatic effect. Underneath the witty bravado, you notice Sam\'s gaze dart between you and Maya, looking for reassurance that the tale isn\'t falling flat. Sam takes a sip of seltzer, waiting for someone to pick up the ball.',
    activeCharacters: ['sam'],
    choices: [
      {
        id: 's2_c0',
        label: 'Ask an insightful question that lets Sam expand on the punchline',
        intention: 'Demonstrate active listening and feed energy back to the speaker without usurping the spotlight.',
        characterTarget: 'sam',
        targetScenarioId: 's5_conversation_crossroads',
      },
      {
        id: 's2_c1',
        label: 'Gently loop Jules into the moment with a playful prompt',
        intention: 'Expand the conversation circle without putting Jules uncomfortably on the spot.',
        characterTarget: 'sam',
        targetScenarioId: 's6_sam_dilemma',
      },
      {
        id: 's2_c2',
        label: 'Jump in immediately with your own even more outrageous interview story',
        intention: 'Match their energy, though risking conversational hijacking and one-upmanship.',
        characterTarget: 'sam',
        targetScenarioId: 's7_kitchen_tension',
      },
      {
        id: 's2_c3',
        label: 'Acknowledge how draining performative interview culture actually is',
        intention: 'Deepen the conversation beneath the comedic surface into genuine human experience.',
        characterTarget: 'sam',
        targetScenarioId: 's8_quiet_balcony',
      },
    ],
  },

  s3_maya_kitchen: {
    id: 's3_maya_kitchen',
    layer: 1,
    title: 'The Countertop Rush',
    location: 'Kitchen Island',
    narrative:
      'Maya is surrounded by ramekins, toasted pine nuts, and a steaming pot of shallot reduction. She glances up, brush in hand. "You made it! Don\'t worry about helping—honestly, everything is under control. Well, except the salad dressing separated, the focaccia is five minutes behind, and I forgot to chill the white wine."\n\nHer smile is bright but taut around the edges. She is carrying the classic host burden: wanting everyone to feel cared for while quietly drowning in prep timing.',
    activeCharacters: ['maya'],
    choices: [
      {
        id: 's3_c0',
        label: 'Make a single, concrete offer: pull the bread and set the timer',
        intention: 'Provide specific, low-friction help so Maya does not have to spend energy delegating.',
        characterTarget: 'maya',
        targetScenarioId: 's5_conversation_crossroads',
      },
      {
        id: 's3_c1',
        label: 'Ask Maya directly whether help or having the kitchen to herself feels better',
        intention: 'Respect host autonomy and check whether presence feels like support or crowding.',
        characterTarget: 'maya',
        targetScenarioId: 's6_sam_dilemma',
      },
      {
        id: 's3_c2',
        label: 'Insist that Maya sit down immediately and let you take over everything',
        intention: 'Overrule her stated boundaries in an aggressive rescue impulse.',
        characterTarget: 'maya',
        targetScenarioId: 's7_kitchen_tension',
      },
      {
        id: 's3_c3',
        label: 'Pour Maya a cold glass of water, place it nearby, and step back',
        intention: 'Offer quiet physical care without crowding her work space.',
        characterTarget: 'maya',
        targetScenarioId: 's8_quiet_balcony',
      },
    ],
  },

  s4_quiet_pause: {
    id: 's4_quiet_pause',
    layer: 1,
    title: 'The Window sill',
    location: 'West-Facing Bay Window',
    narrative:
      'The glass feels cold against your forearm. Out in the courtyard below, streetlamps reflect in expanding puddles. The apartment behind you settles into an ambient rhythm: the rhythmic clink of Maya\'s knife, Sam\'s animated cadences, Jules turning a glossy page.\n\nYou take three slow, steady breaths. Your shoulders drop. Maya looks over from the island, catching your eye across the open room with a curious, friendly tilt of her head, as if checking if you feel welcomed.',
    activeCharacters: ['maya', 'room'],
    choices: [
      {
        id: 's4_c0',
        label: 'Send Maya a warm, grounded nod that signals you are content and settling in',
        intention: 'Communicate ease non-verbally so the host does not feel anxious about your quietness.',
        characterTarget: 'maya',
        targetScenarioId: 's5_conversation_crossroads',
      },
      {
        id: 's4_c1',
        label: 'Walk over to the kitchen island now that your feet are planted',
        intention: 'Transition from grounding into intentional, centered participation.',
        characterTarget: 'maya',
        targetScenarioId: 's6_sam_dilemma',
      },
      {
        id: 's4_c2',
        label: 'Approach Jules, carrying your quiet calm with you',
        intention: 'Initiate a low-intensity connection from a place of grounded stillness.',
        characterTarget: 'jules',
        targetScenarioId: 's7_kitchen_tension',
      },
      {
        id: 's4_c3',
        label: 'Give yourself permission to stay by the window another full minute',
        intention: 'Honor your own internal pacing without rushing to perform sociability.',
        characterTarget: 'room',
        targetScenarioId: 's8_quiet_balcony',
      },
    ],
  },

  // LAYER 2 (4 Scenarios)
  s5_conversation_crossroads: {
    id: 's5_conversation_crossroads',
    layer: 2,
    title: 'The Conspiratorial Whisper',
    location: 'Near the Credenza',
    narrative:
      'Sam pours two glasses of spiced apple cider and slides one your way. Maya has stepped into the pantry to locate a serving platter. Jules is still seated nearby.\n\nSam leans in slightly, dropping their voice into that unmistakable conspiratorial frequency. "Hey... did Maya tell you anything about her partner? I heard through David that they had a massive blowup on Tuesday, but she hasn\'t mentioned a peep tonight."\n\nJules glances sideways from the couch, clearly uncomfortable with the sudden shift into private speculation.',
    activeCharacters: ['sam', 'jules', 'maya'],
    choices: [
      {
        id: 's5_c0',
        label: "Gently set a boundary: 'If Maya wants to share, I'd rather hear it from her.'",
        intention: 'Protect absent host privacy with calm conviction and zero sanctimony.',
        characterTarget: 'sam',
        targetScenarioId: 's9_repair_moment',
      },
      {
        id: 's5_c1',
        label: "Pivot the subject smoothly to Maya's wonderful food and the dinner menu",
        intention: 'Defuse gossip without directly shaming Sam.',
        characterTarget: 'sam',
        targetScenarioId: 's10_honest_exchange',
      },
      {
        id: 's5_c2',
        label: 'Lean in and ask Sam what David actually said',
        intention: 'Indulge in casual speculation at the host’s expense.',
        characterTarget: 'sam',
        targetScenarioId: 's11_awkward_silence',
      },
      {
        id: 's5_c3',
        label: 'Turn to Jules and invite them into an unrelated conversation about art',
        intention: 'Provide an exit ramp for both Jules and yourself away from the gossip.',
        characterTarget: 'jules',
        targetScenarioId: 's12_gentle_departure',
      },
    ],
  },

  s6_sam_dilemma: {
    id: 's6_sam_dilemma',
    layer: 2,
    title: 'Vulnerability Under the Surface',
    location: 'Around the Low Coffee Table',
    narrative:
      'The chatter dips. Sam sets down their glass with a dull clink and rubs their neck. The showmanship seems to suddenly slip off like an oversized jacket.\n\n"Sorry if I was taking up all the air in the room earlier," Sam says quietly, looking at the rug. "I get nervous in small groups and my brain decides the best defense is turning into a cabaret act."\n\nJules looks up, visibly surprised by Sam\'s candid confession. Maya pauses with a wooden spoon in hand, waiting to see how the room responds to Sam’s raw honesty.',
    activeCharacters: ['sam', 'jules'],
    choices: [
      {
        id: 's6_c0',
        label: "Reassure Sam: 'Your energy was fun, but it's equally great having you quiet.'",
        intention: 'Affirm both their humor and their right to rest without performative pressure.',
        characterTarget: 'sam',
        targetScenarioId: 's9_repair_moment',
      },
      {
        id: 's6_c1',
        label: 'Ask Sam what usually helps them feel grounded when social anxiety hits',
        intention: 'Explore their experience with gentle curiosity, inviting Jules to share too.',
        characterTarget: 'sam',
        targetScenarioId: 's10_honest_exchange',
      },
      {
        id: 's6_c2',
        label: "Brush it off quickly: 'Come on, you're always the life of the party, stop stressing!'",
        intention: 'Minimize their vulnerability with well-intentioned toxic positivity.',
        characterTarget: 'sam',
        targetScenarioId: 's11_awkward_silence',
      },
      {
        id: 's6_c3',
        label: 'Admit that you also struggle with knowing how much space to occupy in groups',
        intention: 'Create reciprocity and normalize the universal dilemma of social volume.',
        characterTarget: 'sam',
        targetScenarioId: 's12_gentle_departure',
      },
    ],
  },

  s7_kitchen_tension: {
    id: 's7_kitchen_tension',
    layer: 2,
    title: 'The Clatter at the Stove',
    location: 'The Galley Kitchen',
    narrative:
      'A heavy metal ladle slips from Maya\'s fingers, striking the tiled floor with an ear-splitting clang. Olive oil splatters across the lower cabinet.\n\nJules winces and instinctively pulls back into the corner. Sam laughs nervously. Maya freezes, staring down at the oily puddle, her jaw clamped tight. "I\'m fine," Maya says, her voice trembling slightly. "I just... I spent all day wanting tonight to be easy, and I\'m making a mess of everything."\n\nThe room holds its breath. A single misstep could either escalate shame or create safety.',
    activeCharacters: ['maya', 'jules'],
    choices: [
      {
        id: 's7_c0',
        label: "Warmly normalize the accident: 'Nobody came here for perfection, Maya. We came to see you.'",
        intention: 'Dissolve performance anxiety and center connection over culinary perfection.',
        characterTarget: 'maya',
        targetScenarioId: 's9_repair_moment',
      },
      {
        id: 's7_c1',
        label: 'Quietly grab a clean dish towel and help wipe the floor without fuss',
        intention: 'Take practical action without demanding Maya verbally coordinate the cleanup.',
        characterTarget: 'maya',
        targetScenarioId: 's10_honest_exchange',
      },
      {
        id: 's7_c2',
        label: "Make a light-hearted joke about culinary drama to break the ice",
        intention: 'Attempt humor to defuse tension, risking that Maya feels laughed at.',
        characterTarget: 'maya',
        targetScenarioId: 's11_awkward_silence',
      },
      {
        id: 's7_c3',
        label: "Suggest everyone take a five-minute reset while the sauce settles",
        intention: 'Lower the sensory temperature of the room so Maya can regain composure.',
        characterTarget: 'maya',
        targetScenarioId: 's12_gentle_departure',
      },
    ],
  },

  s8_quiet_balcony: {
    id: 's8_quiet_balcony',
    layer: 2,
    title: 'The Balcony Draft',
    location: 'French Doors to the Small Terrace',
    narrative:
      'The French doors are cracked three inches, letting in a river of clean, brisk autumn air. Jules is standing by the threshold, eyes closed, savoring the cool breeze. The room behind is warm and yellow-lit.\n\nSam walks over carrying a plate of roasted almonds. "Hey, what are you two doing in exile?" Sam asks with a grin. "Are we boring you inside?"\n\nJules stiffens slightly, unsure how to defend their need for fresh air without seeming aloof.',
    activeCharacters: ['sam', 'jules'],
    choices: [
      {
        id: 's8_c0',
        label: "Smile warmly: 'Not boring at all. Just enjoying the cold air for three minutes—join us?'",
        intention: 'State a clear boundary with hospitality, reframing quiet as an invitation.',
        characterTarget: 'sam',
        targetScenarioId: 's9_repair_moment',
      },
      {
        id: 's8_c1',
        label: 'Deflect Sam’s teasing with humor while standing shoulder-to-shoulder with Jules',
        intention: 'Protect Jules’s breathing room without alienating Sam.',
        characterTarget: 'sam',
        targetScenarioId: 's10_honest_exchange',
      },
      {
        id: 's8_c2',
        label: 'Apologize and immediately walk back inside to appease Sam',
        intention: 'Abandon your own need for balance to avoid perceived conflict.',
        characterTarget: 'sam',
        targetScenarioId: 's11_awkward_silence',
      },
      {
        id: 's8_c3',
        label: "Gently explain that a quick breath of fresh air helps you return more present",
        intention: 'Articulate the purpose of brief solitude without defensiveness.',
        characterTarget: 'sam',
        targetScenarioId: 's12_gentle_departure',
      },
    ],
  },

  // LAYER 3 (4 Scenarios)
  s9_repair_moment: {
    id: 's9_repair_moment',
    layer: 3,
    title: 'The Bread on the Board',
    location: 'Around the Low Table',
    narrative:
      'The focaccia rests on a wooden cutting board in the center of the table, dimpled with rosemary and flaky salt. Maya has untied her apron and folded it over the chair.\n\nThe initial awkwardness has melted into a quiet, honest camaraderie. Jules is sharing a story about a printmaker in Portland; Sam is listening with chin rested on palm, asking questions rather than performing. Maya leans back against the sofa cushions, eyes relaxed.\n\nAs the night nears its culmination, Maya looks around the circle. "It\'s rare for four people with such different speeds to find a groove like this," she murmurs.',
    activeCharacters: ['maya', 'sam', 'jules'],
    choices: [
      {
        id: 's9_c0',
        label: 'Voice genuine appreciation for how each person adapted their pace tonight',
        intention: 'Celebrate the mutual curiosity that allowed deep, lasting rapport to form.',
        characterTarget: 'maya',
        targetEndingId: 'thread_to_follow',
      },
      {
        id: 's9_c1',
        label: 'Acknowledge the moments of friction and how addressing them built real trust',
        intention: 'Highlight the beauty of repair over artificial perfection.',
        characterTarget: 'sam',
        targetEndingId: 'bridge_under_repair',
      },
      {
        id: 's9_c2',
        label: 'Notice how comfortable the silences have become between stories',
        intention: 'Affirm that peace and personal space are legitimate forms of fellowship.',
        characterTarget: 'jules',
        targetEndingId: 'room_to_breathe',
      },
      {
        id: 's9_c3',
        label: 'Express quiet gratitude for the simple warmth of sharing an evening',
        intention: 'Accept the evening as a pleasant, fleeting passage without over-promising the future.',
        characterTarget: 'room',
        targetEndingId: 'ships_in_evening',
      },
    ],
  },

  s10_honest_exchange: {
    id: 's10_honest_exchange',
    layer: 3,
    title: 'Tea and Honest Hours',
    location: 'Kitchen Peninsula',
    narrative:
      'The kettle whistles on the stove. Maya pours peppermint tea into mismatched ceramic mugs. Sam has kicked off shoes and sits cross-legged on the floor, while Jules cradles a steaming mug with both hands.\n\n"You know," Jules says, looking at the tea leaves swirling in the pot, "I usually regret saying yes to gatherings the moment I walk through the door. But tonight didn\'t feel like an audition."\n\nSam smiles softly. "Yeah. It was nice not having to carry the show." Maya passes you a mug, waiting to hear your perspective on the evening.',
    activeCharacters: ['jules', 'sam', 'maya'],
    choices: [
      {
        id: 's10_c0',
        label: 'Propose exchanging contact details to continue the conversation another time',
        intention: 'Follow through on authentic sparks with a clear, zero-pressure invitation.',
        characterTarget: 'jules',
        targetEndingId: 'thread_to_follow',
      },
      {
        id: 's10_c1',
        label: 'Thank Maya and Sam for being willing to hear each other through the bumpy starts',
        intention: 'Cement the sense that emotional repair was the evening’s quiet achievement.',
        characterTarget: 'maya',
        targetEndingId: 'bridge_under_repair',
      },
      {
        id: 's10_c2',
        label: 'Honor the fact that everyone honored each other’s social batteries',
        intention: 'Acknowledge how spaciousness allowed everyone to show up as themselves.',
        characterTarget: 'sam',
        targetEndingId: 'room_to_breathe',
      },
      {
        id: 's10_c3',
        label: 'Sip the tea quietly, letting the moment stand complete on its own merits',
        intention: 'Let the shared evening be enough without wrapping it in excessive declarations.',
        characterTarget: 'room',
        targetEndingId: 'ships_in_evening',
      },
    ],
  },

  s11_awkward_silence: {
    id: 's11_awkward_silence',
    layer: 3,
    title: 'The Lingering Chill',
    location: 'Living Room Hearth',
    narrative:
      'The radiator gives a periodic metallic clank. The tension from earlier hasn\'t exploded, but it has left a delicate frost across the room. Sam is checking messages on their phone. Jules has returned to the bookshelf, flipping pages with distant caution. Maya is wiping down clean counters a second time.\n\nIt isn\'t a disaster, but the room feels heavy with unspoken things—unaddressed assumptions, awkward jokes that landed sideways, boundaries that felt brittle.\n\nMaya clears her throat, looking toward the hallway. "Well, I suppose it\'s getting late for a weeknight..."',
    activeCharacters: ['maya', 'sam', 'jules'],
    choices: [
      {
        id: 's11_c0',
        label: 'Step forward with an authentic observation that cuts through the polite chill',
        intention: 'Take a brave, gentle interpersonal risk to spark real connection before leaving.',
        characterTarget: 'maya',
        targetEndingId: 'thread_to_follow',
      },
      {
        id: 's11_c1',
        label: 'Name the awkwardness with self-effacing warmth: apologize for your own missteps',
        intention: 'Initiate repair and dismantle defensiveness by modeling accountability.',
        characterTarget: 'sam',
        targetEndingId: 'bridge_under_repair',
      },
      {
        id: 's11_c2',
        label: 'Give everyone grace: thank Maya and quietly prepare to leave without drama',
        intention: 'Respect the limit of tonight’s capacity and offer dignity through calm departure.',
        characterTarget: 'room',
        targetEndingId: 'room_to_breathe',
      },
      {
        id: 's11_c3',
        label: 'Put on your coat politely, recognizing that some gatherings just miss the mark',
        intention: 'Accept that not every social encounter aligns, without viewing it as personal failure.',
        characterTarget: 'room',
        targetEndingId: 'ships_in_evening',
      },
    ],
  },

  s12_gentle_departure: {
    id: 's12_gentle_departure',
    layer: 3,
    title: 'Coats in the Hallway',
    location: 'The Front Door',
    narrative:
      'The hall light casts long shadows along the wooden floorboards. The sounds of rain have tapered into an occasional drip from the eaves. Maya holds the door half-open, holding a stack of small takeout containers of focaccia.\n\nSam is pulling on a damp trench coat, zipping it up with a practical nod. Jules is tying their scarf, shoulders visibly looser than when they first arrived.\n\nEveryone stands in that threshold space where an evening either solidifies or dissolves into memory.',
    activeCharacters: ['maya', 'sam', 'jules'],
    choices: [
      {
        id: 's12_c0',
        label: "Make a specific plan with Jules and Maya to visit that exhibition next month",
        intention: 'Transform mutual curiosity into an authentic, concrete follow-up.',
        characterTarget: 'jules',
        targetEndingId: 'thread_to_follow',
      },
      {
        id: 's12_c1',
        label: 'Give Sam a genuine handshake and Maya a warm embrace that seals the evening’s repair',
        intention: 'Confirm through gesture and word that the bumps along the way left no rancor.',
        characterTarget: 'sam',
        targetEndingId: 'bridge_under_repair',
      },
      {
        id: 's12_c2',
        label: 'Thank Maya for a gathering that allowed people to just exist at their own pace',
        intention: 'Validate that a gentle, boundary-respecting gathering was deeply nourishing.',
        characterTarget: 'maya',
        targetEndingId: 'room_to_breathe',
      },
      {
        id: 's12_c3',
        label: 'Step out into the cool night air with a polite goodnight, savoring the solitude ahead',
        intention: 'Honor the quiet beauty of passing through each other’s orbits with kindness.',
        characterTarget: 'room',
        targetEndingId: 'ships_in_evening',
      },
    ],
  },
};

export const ENDINGS: Record<EndingId, Ending> = {
  thread_to_follow: {
    id: 'thread_to_follow',
    title: 'A Thread to Follow',
    subtitle: 'Connection through genuine curiosity',
    epitaph: 'Not every conversation needs to be loud to leave a mark.',
    narrative:
      'You step out of the apartment building onto the glistening sidewalk. The city air is cool and smells of wet stone and fallen leaves.\n\nInside your coat pocket, your phone vibrates with a new message in the three-person group thread: Jules shared a link to the printmaker\'s studio, and Sam replied with an excited exclamation point. Maya added a photo of the cleared table with the caption: "Thank you all for being so present tonight."\n\nYou did not enter the room seeking to impress or dominate. By asking honest questions, resisting easy gossip, and listening to what lay underneath the words, you helped create a space where people felt seen. A real, durable thread has begun to weave between four distinct lives.',
    reflectionPrompt:
      'When you spoke tonight, you leaned toward active inquiry rather than performance. Notice how giving others room to be curious about you—and being curious about them—builds lasting bridges with minimal friction.',
  },

  bridge_under_repair: {
    id: 'bridge_under_repair',
    title: 'A Bridge Under Repair',
    subtitle: 'Trust built through honest acknowledgment and repair',
    epitaph: 'The strongest friendships are not those without friction, but those with repair.',
    narrative:
      'The stairwell door clicks shut behind you. You descend the three flights of stairs with the steady calm of someone who did not run away from a difficult moment.\n\nTonight had its awkward edges: a boundary pushed too far, an accidental clatter, an uncomfortable silence. But instead of covering it in forced laughter or retreating into resentment, you helped name the tension with care. You showed that when things wobble between people, it is possible to pause, adjust, and mend the fabric.\n\nMaya\'s parting hug at the door was not perfunctory—it was the embrace of someone who felt safe in your company because she knows you will deal with reality rather than pretend everything is fine.',
    reflectionPrompt:
      'Interpersonal grace is not the absence of mistakes; it is the courage to repair them without defensiveness. Your words tonight modeled accountability and made space for others to exhale.',
  },

  room_to_breathe: {
    id: 'room_to_breathe',
    title: 'Room to Breathe',
    subtitle: 'The dignity of boundaries and comfortable quiet',
    epitaph: 'Solitude and sociability are not enemies; they are the in-breath and the out-breath.',
    narrative:
      'You reach the street corner and pause under the amber streetlight. The city hums in the distance, but inside you, everything is still and spacious.\n\nTonight was an exercise in healthy pacing. You did not force yourself to laugh when you were tired; you did not drag Jules into spotlight they did not want; you gave Maya space when the kitchen was crowded and did not treat silence as an emergency to be solved with chatter.\n\nIntroversion and healthy boundaries were not an apology tonight. They were a gift of hospitality. Because you did not demand that anyone perform, everyone left the gathering with their dignity and energy intact.',
    reflectionPrompt:
      'Holding your own ground with warmth gives permission for others to do the same. Quiet presence is not social absence—it is often the anchor that prevents a room from drifting.',
  },

  ships_in_evening: {
    id: 'ships_in_evening',
    title: 'Ships in the Evening',
    subtitle: 'Gentle coexistence without forced intimacy',
    epitaph: 'We crossed paths under a warm roof; we go our separate ways into the rain.',
    narrative:
      'The rain has stopped, leaving a quiet mirror on the dark street. You pull your collar against the damp breeze and walk toward the train station.\n\nNot every gathering is destined to become a profound turning point or a lifelong alliance. Tonight was pleasant, occasionally clumsy, and fundamentally transient. You shared warm bread, exchanged stories, respected boundaries, and allowed people to remain who they were without trying to reshape them.\n\nThere is no shame in leaving a social encounter with polite distance intact. You showed up, acted with decency and kindness, and now return to your own life unburdened. Two ships spoke signals across the evening water, and both continue their voyage safely.',
    reflectionPrompt:
      'Accepting the natural limits of an evening is a quiet form of emotional maturity. You do not need every encounter to be deep to treat it with respect and leave it in peace.',
  },
};
