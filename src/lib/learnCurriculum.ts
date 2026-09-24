import type { DetailedLesson, SubLesson } from '../types';

export const DETAILED_LESSONS: DetailedLesson[] = [
  // =========================================================================
  // LESSON 1: Home Row Fundamentals
  // =========================================================================
  {
    id: 'lesson-1',
    order: 1,
    tier: 'beginner',
    title: 'Home Row Fundamentals',
    shortTitle: 'Home Row Base',
    description: 'Master the core anchor keys and home row positions where your fingers rest naturally.',
    objectives: [
      'Locate tactile nubs on F and J index anchor keys',
      'Anchor 8 fingers across ASDF and JKL;',
      'Establish consistent home row return muscle memory',
      'Type home row combinations without looking at keys'
    ],
    keysIntroduced: ['f', 'j', 'd', 'k', 's', 'l', 'a', ';'],
    fingersUsed: [
      { finger: 'Left Pinky', hand: 'left', keys: ['a'] },
      { finger: 'Left Ring', hand: 'left', keys: ['s'] },
      { finger: 'Left Middle', hand: 'left', keys: ['d'] },
      { finger: 'Left Index', hand: 'left', keys: ['f'] },
      { finger: 'Right Index', hand: 'right', keys: ['j'] },
      { finger: 'Right Middle', hand: 'right', keys: ['k'] },
      { finger: 'Right Ring', hand: 'right', keys: ['l'] },
      { finger: 'Right Pinky', hand: 'right', keys: [';'] },
      { finger: 'Thumbs', hand: 'left', keys: ['space'] }
    ],
    estimatedMinutes: 18,
    subLessons: [
      {
        id: 'l1-s1',
        lessonId: 'lesson-1',
        order: 1,
        title: 'F and J: Index Finger Anchors',
        type: 'key_intro',
        description: 'Feel the raised bumps on the F and J keys. These tactile anchors keep you aligned without looking down.',
        targetKeys: ['f', 'j'],
        learnedKeys: ['f', 'j', ' '],
        targetFinger: 'Left Index (F) & Right Index (J)',
        targetFingerCode: 'li',
        exerciseText: 'f f f f j j j j f j f j j f j f ff jj ff jj fff jjj fjf jfj f j f j ff jj fj jf',
        durationSeconds: 90,
        minAccuracy: 90,
        minWpm: 12,
        tips: ['Keep palms slightly elevated off the desk', 'Press smoothly with relaxed curved fingers']
      },
      {
        id: 'l1-s2',
        lessonId: 'lesson-1',
        order: 2,
        title: 'D and K: Middle Finger Alignment',
        type: 'key_intro',
        description: 'Place your left middle finger on D and your right middle finger on K alongside the anchor keys.',
        targetKeys: ['d', 'k'],
        learnedKeys: ['f', 'j', 'd', 'k', ' '],
        targetFinger: 'Left Middle (D) & Right Middle (K)',
        targetFingerCode: 'lm',
        exerciseText: 'd d d d k k k k d k d k k d k d dd kk dd kk ddd kkk dkd kdk d k d k dd kk dk kd',
        durationSeconds: 90,
        minAccuracy: 90,
        minWpm: 14,
        tips: ['Do not let your index fingers wander off F and J', 'Keep a steady cadence']
      },
      {
        id: 'l1-s3',
        lessonId: 'lesson-1',
        order: 3,
        title: 'F, J, D, K: Quad-Key Synthesis',
        type: 'basic_drill',
        description: 'Practice alternating smoothly between your index and middle fingers on both hands.',
        targetKeys: ['f', 'j', 'd', 'k'],
        learnedKeys: ['f', 'j', 'd', 'k', ' '],
        targetFinger: 'Left & Right Index and Middle',
        targetFingerCode: 'ri',
        exerciseText: 'f d j k k j d f f j d k d f k j fdk jkd kdf jfk djk fkd jfd kfd df jk kd fj fjk djk',
        durationSeconds: 100,
        minAccuracy: 92,
        minWpm: 15,
        tips: ['Focus on clean individual taps without dragging keys', 'Maintain rhythmic breath']
      },
      {
        id: 'l1-s4',
        lessonId: 'lesson-1',
        order: 4,
        title: 'S and L: Ring Finger Independence',
        type: 'key_intro',
        description: 'Rest your left ring finger on S and your right ring finger on L. Build independent finger action.',
        targetKeys: ['s', 'l'],
        learnedKeys: ['f', 'j', 'd', 'k', 's', 'l', ' '],
        targetFinger: 'Left Ring (S) & Right Ring (L)',
        targetFingerCode: 'lr',
        exerciseText: 's s s s l l l l s l s l ss ll ss ll sss lll sls lsl s l s l ss ll sl ls sld kls slk dls',
        durationSeconds: 90,
        minAccuracy: 90,
        minWpm: 14,
        tips: ['Ring fingers often feel weaker initially; isolate them gently without tense wrists']
      },
      {
        id: 'l1-s5',
        lessonId: 'lesson-1',
        order: 5,
        title: 'A and ;: Pinky Precision',
        type: 'key_intro',
        description: 'Position your pinkies on A (left) and semicolon ; (right) to complete the 8-finger home row.',
        targetKeys: ['a', ';'],
        learnedKeys: ['f', 'j', 'd', 'k', 's', 'l', 'a', ';', ' '],
        targetFinger: 'Left Pinky (A) & Right Pinky (;)',
        targetFingerCode: 'lp',
        exerciseText: 'a a a a ; ; ; ; a ; a ; aa ;; aa ;; aaa ;;; a;a ;a; a ; a ; aa ;; a; ;a asd jkl asdf jkl;',
        durationSeconds: 100,
        minAccuracy: 90,
        minWpm: 14,
        tips: ['Keep your wrists neutral and strike the keys with fingertip pads']
      },
      {
        id: 'l1-s6',
        lessonId: 'lesson-1',
        order: 6,
        title: 'Full Home Row Spacing Drill',
        type: 'spacing_drill',
        description: 'Seamlessly combine all eight fingers with the thumb spacebar.',
        targetKeys: ['a', 's', 'd', 'f', 'j', 'k', 'l', ';'],
        learnedKeys: ['a', 's', 'd', 'f', 'j', 'k', 'l', ';', ' '],
        targetFinger: 'All 8 Home Row Fingers + Thumbs',
        targetFingerCode: 'th',
        exerciseText: 'asdf jkl; asdf jkl; a s d f j k l ; ff jj kk dd ss aa ll ;; a;sldkfj fkdls;a a s d f j k l ;',
        durationSeconds: 120,
        minAccuracy: 92,
        minWpm: 16,
        tips: ['Use whichever thumb feels most natural for space, typically the dominant hand thumb']
      },
      {
        id: 'l1-s7',
        lessonId: 'lesson-1',
        order: 7,
        title: 'Home Row English Words',
        type: 'words',
        description: 'Type real English words constructed exclusively from your learned home row letters.',
        targetKeys: ['a', 's', 'd', 'f', 'j', 'k', 'l'],
        learnedKeys: ['a', 's', 'd', 'f', 'j', 'k', 'l', ';', ' '],
        targetFinger: 'All Home Row Fingers',
        targetFingerCode: 'li',
        exerciseText: 'fad lad ask dad flask salads fall all fall asks dads lads flask salads fad lad flask salads alas fall',
        durationSeconds: 120,
        minAccuracy: 93,
        minWpm: 18,
        tips: ['Notice how syllables bounce smoothly across both hands']
      },
      {
        id: 'l1-s8',
        lessonId: 'lesson-1',
        order: 8,
        title: 'Home Row Accuracy Lock',
        type: 'accuracy_challenge',
        description: 'Focus entirely on precision. Achieve at least 95% accuracy to pass this milestone.',
        targetKeys: ['a', 's', 'd', 'f', 'j', 'k', 'l', ';'],
        learnedKeys: ['a', 's', 'd', 'f', 'j', 'k', 'l', ';', ' '],
        targetFinger: 'Full Home Row',
        targetFingerCode: 'th',
        exerciseText: 'ask a lad; dad has a salad; all dads ask lads; a flask falls; salads fall; ask all lads; dad asks a lad;',
        durationSeconds: 120,
        minAccuracy: 95,
        minWpm: 16,
        tips: ['Slow down deliberately on transitions between ring and pinky fingers']
      },
      {
        id: 'l1-s9',
        lessonId: 'lesson-1',
        order: 9,
        title: 'Home Row Final Assessment',
        type: 'review',
        description: 'Demonstrate complete home row mastery across varied combinations and vocabulary.',
        targetKeys: ['a', 's', 'd', 'f', 'j', 'k', 'l', ';'],
        learnedKeys: ['a', 's', 'd', 'f', 'j', 'k', 'l', ';', ' '],
        targetFinger: 'Full Home Row',
        targetFingerCode: 'ri',
        exerciseText: 'asdf jkl; dad asked a lad for a flask; all salads fall; a sad lad asks dad; flasks fall as lads ask; fall all;',
        durationSeconds: 150,
        minAccuracy: 93,
        minWpm: 20,
        tips: ['Keep your eyes glued to the screen text rather than your hands']
      }
    ]
  },

  // =========================================================================
  // LESSON 2: Home Row Extensions (G and H)
  // =========================================================================
  {
    id: 'lesson-2',
    order: 2,
    tier: 'beginner',
    title: 'Home Row Extensions: G and H',
    shortTitle: 'G & H Center Reach',
    description: 'Reach inward horizontally with your index fingers to strike G and H, snapping back immediately to F and J.',
    objectives: [
      'Reach left index finger rightward from F to G',
      'Reach right index finger leftward from J to H',
      'Maintain resting positions for all other six fingers',
      'Integrate G and H into fluid home row vocabulary'
    ],
    keysIntroduced: ['g', 'h'],
    fingersUsed: [
      { finger: 'Left Index', hand: 'left', keys: ['f', 'g'] },
      { finger: 'Right Index', hand: 'right', keys: ['j', 'h'] }
    ],
    estimatedMinutes: 16,
    subLessons: [
      {
        id: 'l2-s1',
        lessonId: 'lesson-2',
        order: 1,
        title: 'Reaching Inward: F to G',
        type: 'key_intro',
        description: 'Slide your left index finger rightward to tap G, then return immediately to anchor F.',
        targetKeys: ['g', 'f'],
        learnedKeys: ['a', 's', 'd', 'f', 'j', 'k', 'l', ';', 'g', ' '],
        targetFinger: 'Left Index (G)',
        targetFingerCode: 'li',
        exerciseText: 'f g f g fg gf fgg gff fgf gfg f g f g flag glad gag gaf gas sag flag glad gag gas fag sag flag',
        durationSeconds: 90,
        minAccuracy: 90,
        minWpm: 15,
        tips: ['Do not shift your left hand wrist; only extend the index finger horizontally']
      },
      {
        id: 'l2-s2',
        lessonId: 'lesson-2',
        order: 2,
        title: 'Reaching Inward: J to H',
        type: 'key_intro',
        description: 'Slide your right index finger leftward to tap H, then return immediately to anchor J.',
        targetKeys: ['h', 'j'],
        learnedKeys: ['a', 's', 'd', 'f', 'j', 'k', 'l', ';', 'g', 'h', ' '],
        targetFinger: 'Right Index (H)',
        targetFingerCode: 'ri',
        exerciseText: 'j h j h jh hj jhh hjj jhj hjh j h j h half hash hall had has shag dash half hash hall had has',
        durationSeconds: 90,
        minAccuracy: 90,
        minWpm: 15,
        tips: ['Feel the bump on J as your reference anchor when returning from H']
      },
      {
        id: 'l2-s3',
        lessonId: 'lesson-2',
        order: 3,
        title: 'G and H Center Alternation Drill',
        type: 'basic_drill',
        description: 'Practice alternating between both center reaching keys across hands.',
        targetKeys: ['g', 'h'],
        learnedKeys: ['a', 's', 'd', 'f', 'j', 'k', 'l', ';', 'g', 'h', ' '],
        targetFinger: 'Left Index (G) & Right Index (H)',
        targetFingerCode: 'li',
        exerciseText: 'fg jh gh hg fgh jhg ghh hgg flag dash half glad hash flag half dash glad hall flash shag gash',
        durationSeconds: 100,
        minAccuracy: 92,
        minWpm: 16,
        tips: ['Snap back to F and J as soon as the key registers']
      },
      {
        id: 'l2-s4',
        lessonId: 'lesson-2',
        order: 4,
        title: 'Expanded Home Row Words',
        type: 'words',
        description: 'Combine all 10 home row letters into diverse English words.',
        targetKeys: ['g', 'h', 'a', 's', 'd', 'f', 'j', 'k', 'l'],
        learnedKeys: ['a', 's', 'd', 'f', 'j', 'k', 'l', ';', 'g', 'h', ' '],
        targetFinger: 'All Home Row Fingers',
        targetFingerCode: 'ri',
        exerciseText: 'glad half dash flash hall glad half flag glass shall dash hash hall flag half glad hall flash shall',
        durationSeconds: 110,
        minAccuracy: 93,
        minWpm: 18,
        tips: ['Group repeated letters like "ll" and "ss" into single coordinated bursts']
      },
      {
        id: 'l2-s5',
        lessonId: 'lesson-2',
        order: 5,
        title: 'Home Row Sentence Flow',
        type: 'sentences',
        description: 'Type full sentences using the complete home row keyboard range.',
        targetKeys: ['g', 'h', 'a', 's', 'd', 'f', 'j', 'k', 'l', ';'],
        learnedKeys: ['a', 's', 'd', 'f', 'j', 'k', 'l', ';', 'g', 'h', ' '],
        targetFinger: 'All Home Row Fingers',
        targetFingerCode: 'th',
        exerciseText: 'all dads had glass flasks; a glad lad shall dash; dad had a flash; half a glass shall fall; glad dads ask;',
        durationSeconds: 120,
        minAccuracy: 94,
        minWpm: 18,
        tips: ['Read one word ahead of your typing fingers']
      },
      {
        id: 'l2-s6',
        lessonId: 'lesson-2',
        order: 6,
        title: 'Home Row Speed & Precision Sprint',
        type: 'speed_challenge',
        description: 'Hit at least 22 WPM while maintaining steady 92%+ accuracy across home row sentences.',
        targetKeys: ['g', 'h', 'a', 's', 'd', 'f', 'j', 'k', 'l', ';'],
        learnedKeys: ['a', 's', 'd', 'f', 'j', 'k', 'l', ';', 'g', 'h', ' '],
        targetFinger: 'All Home Row Fingers',
        targetFingerCode: 'li',
        exerciseText: 'flag glad half dash hash flash hall fall shag jag sash gash glad half dash glass flasks shall fall;',
        durationSeconds: 120,
        minAccuracy: 92,
        minWpm: 22,
        tips: ['Relax your shoulders to maintain high speed without tension']
      },
      {
        id: 'l2-s7',
        lessonId: 'lesson-2',
        order: 7,
        title: 'Complete Home Row Comprehensive Review',
        type: 'review',
        description: 'Review and verify full proficiency across all ten home row letters.',
        targetKeys: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';'],
        learnedKeys: ['a', 's', 'd', 'f', 'j', 'k', 'l', ';', 'g', 'h', ' '],
        targetFinger: 'All Home Row Fingers',
        targetFingerCode: 'ri',
        exerciseText: 'asdfg hjkl; a glad lad had a glass flask; all half glass flasks shall fall; dad asked a glad lad for half;',
        durationSeconds: 140,
        minAccuracy: 94,
        minWpm: 20,
        tips: ['Congratulations on mastering the home row resting foundation!']
      }
    ]
  },

  // =========================================================================
  // LESSON 3: Top Row Keys Part 1 (E, R, U, I)
  // =========================================================================
  {
    id: 'lesson-3',
    order: 3,
    tier: 'beginner',
    title: 'Top Row Fundamentals: E, R, U, I',
    shortTitle: 'E, R, U, I Reaches',
    description: 'Learn upward reaches for the most frequent English vowels and consonants: E, R, U, and I.',
    objectives: [
      'Reach left middle finger up from D to E',
      'Reach left index finger up from F to R',
      'Reach right index finger up from J to U',
      'Reach right middle finger up from K to I',
      'Always return fingers back to resting home row anchors'
    ],
    keysIntroduced: ['e', 'r', 'u', 'i'],
    fingersUsed: [
      { finger: 'Left Middle', hand: 'left', keys: ['d', 'e'] },
      { finger: 'Left Index', hand: 'left', keys: ['f', 'r'] },
      { finger: 'Right Index', hand: 'right', keys: ['j', 'u'] },
      { finger: 'Right Middle', hand: 'right', keys: ['k', 'i'] }
    ],
    estimatedMinutes: 18,
    subLessons: [
      {
        id: 'l3-s1',
        lessonId: 'lesson-3',
        order: 1,
        title: 'Reaching Up: D to E and F to R',
        type: 'key_intro',
        description: 'Reach up with your left middle finger to E and your left index finger to R.',
        targetKeys: ['e', 'r'],
        learnedKeys: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', 'e', 'r', ' '],
        targetFinger: 'Left Middle (E) & Left Index (R)',
        targetFingerCode: 'lm',
        exerciseText: 'd e d e f r f r de ed fr rf deer free red fed read rare feed feel real dear ear far red free deer',
        durationSeconds: 90,
        minAccuracy: 90,
        minWpm: 16,
        tips: ['Only lift the active finger while keeping your other left hand fingers resting gently on ASD']
      },
      {
        id: 'l3-s2',
        lessonId: 'lesson-3',
        order: 2,
        title: 'Reaching Up: J to U and K to I',
        type: 'key_intro',
        description: 'Reach up with your right index finger to U and your right middle finger to I.',
        targetKeys: ['u', 'i'],
        learnedKeys: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', 'e', 'r', 'u', 'i', ' '],
        targetFinger: 'Right Index (U) & Right Middle (I)',
        targetFingerCode: 'ri',
        exerciseText: 'j u j u k i k i ju uj ki ik us if kid ill silk kill fill full dull fur rug mud jug kid ill silk fill',
        durationSeconds: 90,
        minAccuracy: 90,
        minWpm: 16,
        tips: ['Notice how U and I mirror R and E on the opposite hand']
      },
      {
        id: 'l3-s3',
        lessonId: 'lesson-3',
        order: 3,
        title: 'High-Frequency Bigrams: er, re, in, ui',
        type: 'basic_drill',
        description: 'Practice the most common vowel-consonant transitions in the English language.',
        targetKeys: ['e', 'r', 'u', 'i'],
        learnedKeys: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', 'e', 'r', 'u', 'i', ' '],
        targetFinger: 'Left & Right Upper Reaches',
        targetFingerCode: 'rm',
        exerciseText: 'er re in ni ui iu fire rider rule user guide figure fluid ruin true fruit heir hire sure fire rider',
        durationSeconds: 100,
        minAccuracy: 92,
        minWpm: 18,
        tips: ['Focus on smooth transitions between the top row and home row']
      },
      {
        id: 'l3-s4',
        lessonId: 'lesson-3',
        order: 4,
        title: 'Vocabulary with E, R, U, I',
        type: 'words',
        description: 'Type rich English vocabulary composed of home row and newly learned top row letters.',
        targetKeys: ['e', 'r', 'u', 'i', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
        learnedKeys: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', 'e', 'r', 'u', 'i', ' '],
        targetFinger: 'Mixed Home and Top Row',
        targetFingerCode: 'li',
        exerciseText: 'fire free rule user life skill risk sure real dark leaf deal fill hide gear rail hail rush sail',
        durationSeconds: 110,
        minAccuracy: 93,
        minWpm: 20,
        tips: ['Keep your wrists calm; do not bounce your forearms up and down']
      },
      {
        id: 'l3-s5',
        lessonId: 'lesson-3',
        order: 5,
        title: 'Fluid Sentences with E, R, U, I',
        type: 'sentences',
        description: 'Combine letters into natural flowing expressions.',
        targetKeys: ['e', 'r', 'u', 'i', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';'],
        learnedKeys: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', 'e', 'r', 'u', 'i', ' '],
        targetFinger: 'All Learned Keys',
        targetFingerCode: 'th',
        exerciseText: 'she fills a red jar; her skill is real; dark skies hide a red fire; real leaders guide us well;',
        durationSeconds: 120,
        minAccuracy: 94,
        minWpm: 20,
        tips: ['Type words as single continuous motions rather than isolated letters']
      },
      {
        id: 'l3-s6',
        lessonId: 'lesson-3',
        order: 6,
        title: 'Top Row Accuracy Challenge',
        type: 'accuracy_challenge',
        description: 'Lock in at least 95% accuracy while managing the vertical reach from home row.',
        targetKeys: ['e', 'r', 'u', 'i'],
        learnedKeys: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', 'e', 'r', 'u', 'i', ' '],
        targetFinger: 'Upper Reach Precision',
        targetFingerCode: 'lm',
        exerciseText: 'a user guides a rule; her fire is real; dark figures fill the hall; she feels her skills rise;',
        durationSeconds: 120,
        minAccuracy: 95,
        minWpm: 18,
        tips: ['Do not rush; accurate muscle memory naturally produces speed']
      },
      {
        id: 'l3-s7',
        lessonId: 'lesson-3',
        order: 7,
        title: 'Top Row Speed Sprint',
        type: 'speed_challenge',
        description: 'Maintain swift pacing at or above 25 WPM with high accuracy.',
        targetKeys: ['e', 'r', 'u', 'i', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
        learnedKeys: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', 'e', 'r', 'u', 'i', ' '],
        targetFinger: 'Full Current Keyboard',
        targetFingerCode: 'ri',
        exerciseText: 'fire free rule user life skill risk sure real dark leaf deal hide gear rail hail rush sail rule life',
        durationSeconds: 120,
        minAccuracy: 93,
        minWpm: 25,
        tips: ['Breathe evenly and let your fingers glide across the keys']
      }
    ]
  },

  // =========================================================================
  // LESSON 4: Top Row Completion (Q, W, T, Y, O, P)
  // =========================================================================
  {
    id: 'lesson-4',
    order: 4,
    tier: 'beginner',
    title: 'Top Row Completion: Q, W, T, Y, O, P',
    shortTitle: 'Top Row Complete',
    description: 'Complete all 10 keys of the top row: Q, W, T on the left hand, and Y, O, P on the right hand.',
    objectives: [
      'Reach left pinky up to Q, left ring to W, left index to T',
      'Reach right index to Y, right ring to O, right pinky to P',
      'Coordinate full top-row alternating movements',
      'Expand vocabulary to hundreds of standard words'
    ],
    keysIntroduced: ['q', 'w', 't', 'y', 'o', 'p'],
    fingersUsed: [
      { finger: 'Left Pinky', hand: 'left', keys: ['q'] },
      { finger: 'Left Ring', hand: 'left', keys: ['w'] },
      { finger: 'Left Index', hand: 'left', keys: ['t'] },
      { finger: 'Right Index', hand: 'right', keys: ['y'] },
      { finger: 'Right Ring', hand: 'right', keys: ['o'] },
      { finger: 'Right Pinky', hand: 'right', keys: ['p'] }
    ],
    estimatedMinutes: 20,
    subLessons: [
      {
        id: 'l4-s1',
        lessonId: 'lesson-4',
        order: 1,
        title: 'Left Reaches: Q, W, T',
        type: 'key_intro',
        description: 'Reach up from home row: Pinky to Q, Ring to W, and Index to T.',
        targetKeys: ['q', 'w', 't'],
        learnedKeys: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', 'e', 'r', 'u', 'i', 'q', 'w', 't', ' '],
        targetFinger: 'Left Hand Upper Tier',
        targetFingerCode: 'lr',
        exerciseText: 'q w t w t q quit wait walk water true trip west write quiet quest tower quote twig quit wait',
        durationSeconds: 100,
        minAccuracy: 90,
        minWpm: 16,
        tips: ['Q is reached by reaching up and slightly left with your left pinky']
      },
      {
        id: 'l4-s2',
        lessonId: 'lesson-4',
        order: 2,
        title: 'Right Reaches: Y, O, P',
        type: 'key_intro',
        description: 'Reach up from home row: Index to Y, Ring to O, and Pinky to P.',
        targetKeys: ['y', 'o', 'p'],
        learnedKeys: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', 'e', 'r', 'u', 'i', 'q', 'w', 't', 'y', 'o', 'p', ' '],
        targetFinger: 'Right Hand Upper Tier',
        targetFingerCode: 'rp',
        exerciseText: 'y o p o p y you open play year peer poet port prayer hope rope power copy you open play year',
        durationSeconds: 100,
        minAccuracy: 90,
        minWpm: 16,
        tips: ['P is directly above semicolon; gently lift your right pinky to tap it']
      },
      {
        id: 'l4-s3',
        lessonId: 'lesson-4',
        order: 3,
        title: 'Full Top Row Flow & Alternation',
        type: 'basic_drill',
        description: 'Type exercises spanning the complete top row: QWERTY UIOP.',
        targetKeys: ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
        learnedKeys: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', ' '],
        targetFinger: 'All 8 Upper Row Fingers',
        targetFingerCode: 'li',
        exerciseText: 'qwerty uiop type wire rope tree quiet power write order trip poet route equip quote port',
        durationSeconds: 110,
        minAccuracy: 92,
        minWpm: 18,
        tips: ['Notice how alternating between hands gives your fingers time to reposition']
      },
      {
        id: 'l4-s4',
        lessonId: 'lesson-4',
        order: 4,
        title: 'Top & Home Row English Words',
        type: 'words',
        description: 'Type common English words utilizing the full upper and home rows.',
        targetKeys: ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
        learnedKeys: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', ' '],
        targetFinger: 'Full Upper and Home Rows',
        targetFingerCode: 'th',
        exerciseText: 'people would water write party quiet order great report today white world trade spirit light house',
        durationSeconds: 120,
        minAccuracy: 93,
        minWpm: 22,
        tips: ['Eliminate pauses between words by preparing the next finger in advance']
      },
      {
        id: 'l4-s5',
        lessonId: 'lesson-4',
        order: 5,
        title: 'Connected Sentence Practice',
        type: 'sentences',
        description: 'Practice multi-word sentences combining the top two rows of your keyboard.',
        targetKeys: ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';'],
        learnedKeys: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', ' '],
        targetFinger: 'All Upper & Home Fingers',
        targetFingerCode: 'li',
        exerciseText: 'people write reports with great power; we work hard to keep our world quiet and peaceful today;',
        durationSeconds: 130,
        minAccuracy: 94,
        minWpm: 22,
        tips: ['Maintain a relaxed cadence, treating the keyboard like a musical instrument']
      },
      {
        id: 'l4-s6',
        lessonId: 'lesson-4',
        order: 6,
        title: 'Top Row Mastery Challenge',
        type: 'accuracy_challenge',
        description: 'Verify 95%+ precision across top row transitions without error buildup.',
        targetKeys: ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
        learnedKeys: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', ' '],
        targetFinger: 'Upper Row Isolation',
        targetFingerCode: 'rm',
        exerciseText: 'their words would inspire our people to write with hope and power throughout the whole year;',
        durationSeconds: 130,
        minAccuracy: 95,
        minWpm: 20,
        tips: ['Do not rush the pinky keys P and Q']
      },
      {
        id: 'l4-s7',
        lessonId: 'lesson-4',
        order: 7,
        title: 'Top Row Benchmark Assessment',
        type: 'review',
        description: 'A comprehensive benchmark proving full fluency across top and home rows.',
        targetKeys: ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';'],
        learnedKeys: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', ' '],
        targetFinger: 'Both Upper and Home Rows',
        targetFingerCode: 'ri',
        exerciseText: 'write a quiet report with great care; people who practice every day will see their speed and power grow;',
        durationSeconds: 150,
        minAccuracy: 94,
        minWpm: 25,
        tips: ['You now command 18 keys of the primary alphabet!']
      }
    ]
  },

  // =========================================================================
  // LESSON 5: Bottom Row Fundamentals (C, V, N, M)
  // =========================================================================
  {
    id: 'lesson-5',
    order: 5,
    tier: 'intermediate',
    title: 'Bottom Row Fundamentals: C, V, N, M',
    shortTitle: 'C, V, N, M Reaches',
    description: 'Master downward reaches with your middle and index fingers: C and V on the left hand, N and M on the right hand.',
    objectives: [
      'Reach left middle finger down from D to C',
      'Reach left index finger down from F to V',
      'Reach right index finger down from J to N and M',
      'Maintain neutral wrist angle without resting palms heavily'
    ],
    keysIntroduced: ['c', 'v', 'n', 'm'],
    fingersUsed: [
      { finger: 'Left Middle', hand: 'left', keys: ['d', 'c'] },
      { finger: 'Left Index', hand: 'left', keys: ['f', 'v'] },
      { finger: 'Right Index', hand: 'right', keys: ['j', 'n', 'm'] }
    ],
    estimatedMinutes: 18,
    subLessons: [
      {
        id: 'l5-s1',
        lessonId: 'lesson-5',
        order: 1,
        title: 'Downward Reaches: D to C and F to V',
        type: 'key_intro',
        description: 'Curl your left middle finger down to C, and your left index finger down to V.',
        targetKeys: ['c', 'v'],
        learnedKeys: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'c', 'v', ' '],
        targetFinger: 'Left Middle (C) & Left Index (V)',
        targetFingerCode: 'li',
        exerciseText: 'd c d c f v f v dc cd fv vf civic cave dive cover voice view cure curve civil carve cave dive',
        durationSeconds: 90,
        minAccuracy: 90,
        minWpm: 18,
        tips: ['Curl your finger inward gently toward your palm rather than moving your whole hand down']
      },
      {
        id: 'l5-s2',
        lessonId: 'lesson-5',
        order: 2,
        title: 'Downward Reaches: J to N and J to M',
        type: 'key_intro',
        description: 'Reach your right index finger down to N and further rightward to M.',
        targetKeys: ['n', 'm'],
        learnedKeys: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'c', 'v', 'n', 'm', ' '],
        targetFinger: 'Right Index (N & M)',
        targetFingerCode: 'ri',
        exerciseText: 'j n j n j m j m jn nj jm mj name man mind mean main moon mine norm form firm name man mind',
        durationSeconds: 90,
        minAccuracy: 90,
        minWpm: 18,
        tips: ['N is directly below H/J, and M is directly below J/K']
      },
      {
        id: 'l5-s3',
        lessonId: 'lesson-5',
        order: 3,
        title: 'Vertical Transition Drill (Top to Bottom)',
        type: 'basic_drill',
        description: 'Practice full vertical reaches stretching from top row to bottom row through home anchors.',
        targetKeys: ['c', 'v', 'n', 'm', 'e', 'r', 'u', 'i'],
        learnedKeys: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'c', 'v', 'n', 'm', ' '],
        targetFinger: 'Index & Middle Vertical Reaches',
        targetFingerCode: 'lm',
        exerciseText: 'move come turn view clean never river cover human winter summer column victim motion number',
        durationSeconds: 100,
        minAccuracy: 92,
        minWpm: 20,
        tips: ['Always return through home position to keep your orientation centered']
      },
      {
        id: 'l5-s4',
        lessonId: 'lesson-5',
        order: 4,
        title: 'Core Words with C, V, N, M',
        type: 'words',
        description: 'Integrate the new bottom row consonants into popular English vocabulary.',
        targetKeys: ['c', 'v', 'n', 'm'],
        learnedKeys: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'c', 'v', 'n', 'm', ' '],
        targetFinger: 'All Learned Characters',
        targetFingerCode: 'th',
        exerciseText: 'music dance clean voice move seven came name mean even form common mind center country minute',
        durationSeconds: 110,
        minAccuracy: 93,
        minWpm: 22,
        tips: ['Keep your wrists floating gently rather than pressing into the table']
      },
      {
        id: 'l5-s5',
        lessonId: 'lesson-5',
        order: 5,
        title: 'Sentence Cadence with C, V, N, M',
        type: 'sentences',
        description: 'Type full expressive sentences with natural rhythm.',
        targetKeys: ['c', 'v', 'n', 'm'],
        learnedKeys: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'c', 'v', 'n', 'm', ' '],
        targetFinger: 'Full Current Alphabet',
        targetFingerCode: 'li',
        exerciseText: 'music moves every human mind with calm grace; we can never forget common memories from home;',
        durationSeconds: 120,
        minAccuracy: 94,
        minWpm: 22,
        tips: ['Focus on clean finger separation without hitting adjacent keys']
      },
      {
        id: 'l5-s6',
        lessonId: 'lesson-5',
        order: 6,
        title: 'Bottom Row Stability Challenge',
        type: 'accuracy_challenge',
        description: 'Prove 95%+ precision on downward reaches while maintaining proper wrist posture.',
        targetKeys: ['c', 'v', 'n', 'm'],
        learnedKeys: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'c', 'v', 'n', 'm', ' '],
        targetFinger: 'Index & Middle Precision',
        targetFingerCode: 'ri',
        exerciseText: 'seven men came to clean every room; their voices sounded clear in the center of town;',
        durationSeconds: 120,
        minAccuracy: 95,
        minWpm: 22,
        tips: ['Check that your fingers remain curved like typing claws over home row']
      },
      {
        id: 'l5-s7',
        lessonId: 'lesson-5',
        order: 7,
        title: 'Three-Row Integration Assessment',
        type: 'review',
        description: 'Full assessment across three rows testing speed, rhythm, and accuracy.',
        targetKeys: ['c', 'v', 'n', 'm', 'a', 'e', 'i', 'o', 'u'],
        learnedKeys: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'c', 'v', 'n', 'm', ' '],
        targetFinger: 'All 8 Operational Fingers',
        targetFingerCode: 'th',
        exerciseText: 'clean water and fresh air give everyone great energy; notice how music creates harmony and peace;',
        durationSeconds: 140,
        minAccuracy: 94,
        minWpm: 26,
        tips: ['Your typing speed is accelerating smoothly!']
      }
    ]
  },

  // =========================================================================
  // LESSON 6: Bottom Row Completion (Z, X, B, Punctuation , and .)
  // =========================================================================
  {
    id: 'lesson-6',
    order: 6,
    tier: 'intermediate',
    title: 'Bottom Row Completion: Z, X, B, Comma & Period',
    shortTitle: 'Z, X, B & Punctuation',
    description: 'Complete the entire 26-letter English alphabet plus standard sentence punctuation marks: comma and period.',
    objectives: [
      'Reach left pinky down to Z and left ring down to X',
      'Reach left index finger down and rightward to B',
      'Reach right middle down to comma (,) and right ring down to period (.)',
      'Integrate all 26 letters and sentence punctuation into continuous prose'
    ],
    keysIntroduced: ['z', 'x', 'b', ',', '.'],
    fingersUsed: [
      { finger: 'Left Pinky', hand: 'left', keys: ['a', 'z'] },
      { finger: 'Left Ring', hand: 'left', keys: ['s', 'x'] },
      { finger: 'Left Index', hand: 'left', keys: ['f', 'b'] },
      { finger: 'Right Middle', hand: 'right', keys: ['k', ','] },
      { finger: 'Right Ring', hand: 'right', keys: ['l', '.'] }
    ],
    estimatedMinutes: 20,
    subLessons: [
      {
        id: 'l6-s1',
        lessonId: 'lesson-6',
        order: 1,
        title: 'Awkward Reaches: Z, X and B',
        type: 'key_intro',
        description: 'Reach left pinky to Z, left ring to X, and left index to B.',
        targetKeys: ['z', 'x', 'b'],
        learnedKeys: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'c', 'v', 'n', 'm', 'z', 'x', 'b', ' '],
        targetFinger: 'Left Bottom Row Tier',
        targetFingerCode: 'lp',
        exerciseText: 'z x b x z b zoo box zone exit back buzz exam next brave maze zero text bronze cube zebra box',
        durationSeconds: 100,
        minAccuracy: 90,
        minWpm: 18,
        tips: ['Z and X require gentle lateral wrist rotation; do not strain your pinky']
      },
      {
        id: 'l6-s2',
        lessonId: 'lesson-6',
        order: 2,
        title: 'Sentence Punctuation: Comma and Period',
        type: 'key_intro',
        description: 'Reach right middle finger down to comma (,) and right ring finger down to period (.).',
        targetKeys: [',', '.'],
        learnedKeys: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'c', 'v', 'n', 'm', 'z', 'x', 'b', ',', '.', ' '],
        targetFinger: 'Right Middle (,) & Right Ring (.)',
        targetFingerCode: 'rm',
        exerciseText: 'k , k , l . l . one, two, three. stop, look, listen. calm, steady, fast. work, learn, grow.',
        durationSeconds: 100,
        minAccuracy: 92,
        minWpm: 18,
        tips: ['Always type a space immediately after a comma or period']
      },
      {
        id: 'l6-s3',
        lessonId: 'lesson-6',
        order: 3,
        title: 'Complete 26-Letter Alphabet Integration',
        type: 'basic_drill',
        description: 'Type pangrams containing every single letter of the English alphabet.',
        targetKeys: ['all 26 letters'],
        learnedKeys: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'c', 'v', 'n', 'm', 'z', 'x', 'b', ',', '.', ' '],
        targetFinger: 'All 10 Fingers',
        targetFingerCode: 'th',
        exerciseText: 'the quick brown fox jumps over the lazy dog. pack my box with five dozen liquor jugs.',
        durationSeconds: 120,
        minAccuracy: 93,
        minWpm: 22,
        tips: ['Pangrams train full keyboard muscle coordination in minimal time']
      },
      {
        id: 'l6-s4',
        lessonId: 'lesson-6',
        order: 4,
        title: 'Complex Vocabulary with Rare Letters',
        type: 'words',
        description: 'Type rich English vocabulary featuring z, x, q, and b with punctuation.',
        targetKeys: ['z', 'x', 'b', 'q'],
        learnedKeys: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'c', 'v', 'n', 'm', 'z', 'x', 'b', ',', '.', ' '],
        targetFinger: 'All Fingers',
        targetFingerCode: 'li',
        exerciseText: 'extra, brave, zebra, boxer, climb, puzzle, complex, bronze, luxury, balance, oxygen, public, frozen.',
        durationSeconds: 120,
        minAccuracy: 93,
        minWpm: 24,
        tips: ['Treat awkward reaches as rhythmic pauses rather than speed traps']
      },
      {
        id: 'l6-s5',
        lessonId: 'lesson-6',
        order: 5,
        title: 'Punctuation Pauses and Cadence',
        type: 'sentences',
        description: 'Practice natural sentences featuring commas and periods.',
        targetKeys: [',', '.'],
        learnedKeys: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'c', 'v', 'n', 'm', 'z', 'x', 'b', ',', '.', ' '],
        targetFinger: 'Right Hand Punctuation Reaches',
        targetFingerCode: 'rr',
        exerciseText: 'take your time, breathe deeply, and keep a steady pace. with regular practice, your speed will soar.',
        durationSeconds: 130,
        minAccuracy: 94,
        minWpm: 24,
        tips: ['Follow every period with a space before the next word starts']
      },
      {
        id: 'l6-s6',
        lessonId: 'lesson-6',
        order: 6,
        title: 'Alphabetical Speed Sprint',
        type: 'speed_challenge',
        description: 'Target at least 28 WPM across full alphabet sentences with 93%+ accuracy.',
        targetKeys: ['all 26 letters'],
        learnedKeys: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'c', 'v', 'n', 'm', 'z', 'x', 'b', ',', '.', ' '],
        targetFinger: 'Full 10-Finger Hand System',
        targetFingerCode: 'th',
        exerciseText: 'the quick brown fox jumps over the lazy dog, while five brave boxer wizards quickly jump into action.',
        durationSeconds: 130,
        minAccuracy: 93,
        minWpm: 28,
        tips: ['Maintain confidence and let muscle memory drive each word']
      },
      {
        id: 'l6-s7',
        lessonId: 'lesson-6',
        order: 7,
        title: 'Full Alphabet Master Assessment',
        type: 'review',
        description: 'Demonstrate mastery of all 26 letters of the English keyboard and punctuation.',
        targetKeys: ['all letters', ',', '.'],
        learnedKeys: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'c', 'v', 'n', 'm', 'z', 'x', 'b', ',', '.', ' '],
        targetFinger: 'Complete Keyboard',
        targetFingerCode: 'ri',
        exerciseText: 'mastering all letters allows your thoughts to flow straight into words. focus, relax, and type with joy.',
        durationSeconds: 150,
        minAccuracy: 95,
        minWpm: 28,
        tips: ['All 26 letters unlocked! You are now typing with all 10 fingers.']
      }
    ]
  },

  // =========================================================================
  // LESSON 7: High-Frequency Words & Bigram Fluency
  // =========================================================================
  {
    id: 'lesson-7',
    order: 7,
    tier: 'intermediate',
    title: 'High-Frequency Words & Bigram Fluency',
    shortTitle: 'Core Vocabulary & Bigrams',
    description: 'Automate muscle memory for the 100 most common English words, high-frequency bigrams (th, he, in, er, an), and trigrams.',
    objectives: [
      'Type top 50 English core words as single rhythmic bursts',
      'Optimize finger transitions on high-frequency letter pairs',
      'Eliminate micro-stutters between consecutive words',
      'Boost typing speed past 32 WPM'
    ],
    keysIntroduced: ['frequent bigrams'],
    fingersUsed: [
      { finger: 'All 10 Fingers', hand: 'left', keys: ['full alphabet'] }
    ],
    estimatedMinutes: 20,
    subLessons: [
      {
        id: 'l7-s1',
        lessonId: 'lesson-7',
        order: 1,
        title: 'Top 25 Core English Words',
        type: 'words',
        description: 'These 25 words account for over 30% of all written English.',
        targetKeys: ['the', 'and', 'for', 'you', 'that', 'with'],
        learnedKeys: ['all 26 letters', ',', '.'],
        targetFinger: 'Both Hands',
        targetFingerCode: 'th',
        exerciseText: 'the and for you that with have this from they word what some time could make like into look more',
        durationSeconds: 110,
        minAccuracy: 94,
        minWpm: 26,
        tips: ['Recognize these words by shape rather than spelling them out letter by letter']
      },
      {
        id: 'l7-s2',
        lessonId: 'lesson-7',
        order: 2,
        title: 'Mastering Essential Bigrams (th, he, er, in, an)',
        type: 'basic_drill',
        description: 'Train lightning-fast transitions between consecutive fingers.',
        targetKeys: ['th', 'he', 'er', 'in', 'an', 're', 'on', 'at'],
        learnedKeys: ['all 26 letters', ',', '.'],
        targetFinger: 'Consecutive Finger Pairs',
        targetFingerCode: 'ri',
        exerciseText: 'the they them then their other mother father brother weather water under enter stand land hand',
        durationSeconds: 110,
        minAccuracy: 94,
        minWpm: 28,
        tips: ['For "th", let your right index tap h immediately as left index taps t']
      },
      {
        id: 'l7-s3',
        lessonId: 'lesson-7',
        order: 3,
        title: 'Common Trigrams: the, ing, ion, ent',
        type: 'spacing_drill',
        description: 'Type three-letter clusters as unified muscle gestures.',
        targetKeys: ['ing', 'ion', 'ent', 'and', 'for'],
        learnedKeys: ['all 26 letters', ',', '.'],
        targetFinger: 'Both Hands',
        targetFingerCode: 'lm',
        exerciseText: 'running reading writing flowing moving station action nation question moment student payment ancient',
        durationSeconds: 120,
        minAccuracy: 94,
        minWpm: 30,
        tips: ['"ing" is right middle (i) -> right index (n) -> left index (g)']
      },
      {
        id: 'l7-s4',
        lessonId: 'lesson-7',
        order: 4,
        title: 'Alternating Hand Rhythm Drills',
        type: 'basic_drill',
        description: 'Alternating between left and right hands unlocks maximum possible typing speed.',
        targetKeys: ['alternating words'],
        learnedKeys: ['all 26 letters', ',', '.'],
        targetFinger: 'Alternating Hands',
        targetFingerCode: 'th',
        exerciseText: 'problem visual formal submit enrich signals suspend panel dial body field enrich signals dial',
        durationSeconds: 120,
        minAccuracy: 95,
        minWpm: 30,
        tips: ['Left, right, left, right: feel the drumbeat in your keystrokes']
      },
      {
        id: 'l7-s5',
        lessonId: 'lesson-7',
        order: 5,
        title: 'High-Velocity Accuracy Challenge',
        type: 'accuracy_challenge',
        description: 'Maintain strict 96% accuracy over continuous prose with no breaks.',
        targetKeys: ['all letters', ',', '.'],
        learnedKeys: ['all 26 letters', ',', '.'],
        targetFinger: 'All Fingers',
        targetFingerCode: 'ri',
        exerciseText: 'when you focus on accuracy, your speed increases naturally. keep your wrists light and breathe.',
        durationSeconds: 120,
        minAccuracy: 96,
        minWpm: 28,
        tips: ['Prioritize rhythm over frantic rushing']
      },
      {
        id: 'l7-s6',
        lessonId: 'lesson-7',
        order: 6,
        title: '35 WPM Velocity Milestone Sprint',
        type: 'speed_challenge',
        description: 'Break through the 35 WPM threshold on standard vocabulary.',
        targetKeys: ['common vocabulary'],
        learnedKeys: ['all 26 letters', ',', '.'],
        targetFinger: 'Both Hands',
        targetFingerCode: 'th',
        exerciseText: 'great minds build habits of daily practice. every minute spent typing sharpens your natural speed and precision.',
        durationSeconds: 120,
        minAccuracy: 94,
        minWpm: 35,
        tips: ['Keep your eyes scanning one to two words ahead']
      },
      {
        id: 'l7-s7',
        lessonId: 'lesson-7',
        order: 7,
        title: 'Fluency Comprehensive Assessment',
        type: 'review',
        description: 'Prove full high-frequency mastery across mixed vocabulary and bigram drills.',
        targetKeys: ['all letters', ',', '.'],
        learnedKeys: ['all 26 letters', ',', '.'],
        targetFinger: 'All Fingers',
        targetFingerCode: 'li',
        exerciseText: 'typing with confidence allows you to express your ideas directly. words appear effortlessly on the screen.',
        durationSeconds: 150,
        minAccuracy: 95,
        minWpm: 32,
        tips: ['Excellent progress! You have built true conversational typing speed.']
      }
    ]
  },

  // =========================================================================
  // LESSON 8: Capitalization & Shift Key Mastery
  // =========================================================================
  {
    id: 'lesson-8',
    order: 8,
    tier: 'intermediate',
    title: 'Capitalization & Shift Key Mastery',
    shortTitle: 'Opposite Shift Keys',
    description: 'Master the opposite-hand shift key rule: right pinky shifts for left-hand letters, left pinky shifts for right-hand letters.',
    objectives: [
      'Use Right Shift when typing left-hand letters (A, S, D, F, Q, W, E, R, T, Z, X, C, V, B)',
      'Use Left Shift when typing right-hand letters (J, K, L, Y, U, I, O, P, N, M)',
      'Never use the same hand to hold Shift and press a letter key',
      'Capitalize proper nouns, beginnings of sentences, and acronyms effortlessly'
    ],
    keysIntroduced: ['ShiftLeft', 'ShiftRight', 'A-Z'],
    fingersUsed: [
      { finger: 'Left Pinky', hand: 'left', keys: ['Left Shift'] },
      { finger: 'Right Pinky', hand: 'right', keys: ['Right Shift'] }
    ],
    estimatedMinutes: 18,
    subLessons: [
      {
        id: 'l8-s1',
        lessonId: 'lesson-8',
        order: 1,
        title: 'Right Shift: Left Hand Capitals',
        type: 'key_intro',
        description: 'Hold Right Shift with your right pinky while typing letters with your left hand.',
        targetKeys: ['A', 'S', 'D', 'F', 'T', 'W', 'E', 'R', 'C', 'B'],
        learnedKeys: ['A-Z', 'a-z', ',', '.'],
        targetFinger: 'Right Pinky (Shift) + Left Hand',
        targetFingerCode: 'rp',
        exerciseText: 'A S D F T W E R C B Alice David Frank Thomas William Robert Clara Benjamin Alice David Frank',
        durationSeconds: 100,
        minAccuracy: 92,
        minWpm: 20,
        tips: ['Press Right Shift first, strike the left key cleanly, then release Right Shift']
      },
      {
        id: 'l8-s2',
        lessonId: 'lesson-8',
        order: 2,
        title: 'Left Shift: Right Hand Capitals',
        type: 'key_intro',
        description: 'Hold Left Shift with your left pinky while typing letters with your right hand.',
        targetKeys: ['J', 'K', 'L', 'Y', 'U', 'I', 'O', 'P', 'N', 'M'],
        learnedKeys: ['A-Z', 'a-z', ',', '.'],
        targetFinger: 'Left Pinky (Shift) + Right Hand',
        targetFingerCode: 'lp',
        exerciseText: 'J K L Y U I O P N M James Karen Lisa York Oliver Paul Nancy Michael India Japan Kenya',
        durationSeconds: 100,
        minAccuracy: 92,
        minWpm: 20,
        tips: ['Keep your right fingers relaxed as left pinky holds Left Shift']
      },
      {
        id: 'l8-s3',
        lessonId: 'lesson-8',
        order: 3,
        title: 'World Cities & Proper Nouns',
        type: 'words',
        description: 'Practice alternating opposite Shift keys on world capitals.',
        targetKeys: ['Shifted words'],
        learnedKeys: ['A-Z', 'a-z', ',', '.'],
        targetFinger: 'Both Pinkies (Alternating Shift)',
        targetFingerCode: 'th',
        exerciseText: 'London, Paris, Tokyo, New York, Delhi, Berlin, Sydney, Rome, Toronto, Singapore, Boston, Madrid, Zurich.',
        durationSeconds: 110,
        minAccuracy: 93,
        minWpm: 24,
        tips: ['Notice which Shift key activates depending on the first letter of each city']
      },
      {
        id: 'l8-s4',
        lessonId: 'lesson-8',
        order: 4,
        title: 'Full Capitalized Sentences',
        type: 'sentences',
        description: 'Type natural sentences featuring standard capitalization and punctuation.',
        targetKeys: ['Complete sentences'],
        learnedKeys: ['A-Z', 'a-z', ',', '.'],
        targetFinger: 'Full 10-Finger Hand System',
        targetFingerCode: 'li',
        exerciseText: 'Every morning brings a new beginning. Focus on the present moment, and give your very best effort.',
        durationSeconds: 120,
        minAccuracy: 94,
        minWpm: 26,
        tips: ['Release Shift immediately after the first capital letter']
      },
      {
        id: 'l8-s5',
        lessonId: 'lesson-8',
        order: 5,
        title: 'Shift Precision Challenge',
        type: 'accuracy_challenge',
        description: 'Lock in 96%+ accuracy across mixed proper names and sentences.',
        targetKeys: ['Capital letters', ',', '.'],
        learnedKeys: ['A-Z', 'a-z', ',', '.'],
        targetFinger: 'Pinky Shift Coordination',
        targetFingerCode: 'rp',
        exerciseText: 'Dr. Watson and Sherlock Holmes visited London, Paris, and Rome during the pleasant spring months.',
        durationSeconds: 120,
        minAccuracy: 96,
        minWpm: 25,
        tips: ['Do not let Shift linger into subsequent lowercase letters']
      },
      {
        id: 'l8-s6',
        lessonId: 'lesson-8',
        order: 6,
        title: 'Capitalization Mastery Assessment',
        type: 'review',
        description: 'Verify complete mastery of opposite-hand Shift keying in continuous prose.',
        targetKeys: ['A-Z', 'a-z', ',', '.'],
        learnedKeys: ['A-Z', 'a-z', ',', '.'],
        targetFinger: 'Complete Keyboard',
        targetFingerCode: 'th',
        exerciseText: 'The North American continent and Europe share centuries of cultural exchange, literature, and innovation.',
        durationSeconds: 140,
        minAccuracy: 95,
        minWpm: 30,
        tips: ['Opposite Shift is now ingrained in your muscle memory!']
      }
    ]
  },

  // =========================================================================
  // LESSON 9: Number Row & Essential Symbols
  // =========================================================================
  {
    id: 'lesson-9',
    order: 9,
    tier: 'advanced',
    title: 'Number Row & Essential Symbols',
    shortTitle: 'Numbers & Symbols',
    description: 'Reach up to the number row (1 through 0) and master essential punctuation including apostrophes, quotes, hyphens, and exclamation marks.',
    objectives: [
      'Reach left hand fingers up to 1, 2, 3, 4, 5',
      'Reach right hand fingers up to 6, 7, 8, 9, 0',
      'Master apostrophe (\'), quotes ("), hyphen (-), question mark (?), and exclamation (!)',
      'Type dates, measurements, and contractions without breaking rhythm'
    ],
    keysIntroduced: ['1-0', "'", '"', '-', '?', '!'],
    fingersUsed: [
      { finger: 'Left Pinky', hand: 'left', keys: ['1'] },
      { finger: 'Left Ring', hand: 'left', keys: ['2'] },
      { finger: 'Left Middle', hand: 'left', keys: ['3'] },
      { finger: 'Left Index', hand: 'left', keys: ['4', '5'] },
      { finger: 'Right Index', hand: 'right', keys: ['6', '7'] },
      { finger: 'Right Middle', hand: 'right', keys: ['8'] },
      { finger: 'Right Ring', hand: 'right', keys: ['9'] },
      { finger: 'Right Pinky', hand: 'right', keys: ['0', '-', "'"] }
    ],
    estimatedMinutes: 20,
    subLessons: [
      {
        id: 'l9-s1',
        lessonId: 'lesson-9',
        order: 1,
        title: 'Left Hand Numbers: 1, 2, 3, 4, 5',
        type: 'key_intro',
        description: 'Reach upward: Pinky to 1, Ring to 2, Middle to 3, Index to 4 and 5.',
        targetKeys: ['1', '2', '3', '4', '5'],
        learnedKeys: ['1', '2', '3', '4', '5', 'a-z'],
        targetFinger: 'Left Hand Number Row Reaches',
        targetFingerCode: 'li',
        exerciseText: '1 2 3 4 5 12 34 51 25 43 room 101 page 23 order 45 level 12 step 34 items 52 room 101 page 23',
        durationSeconds: 100,
        minAccuracy: 90,
        minWpm: 20,
        tips: ['Extend your fingers straight up from QWERT to reach 12345']
      },
      {
        id: 'l9-s2',
        lessonId: 'lesson-9',
        order: 2,
        title: 'Right Hand Numbers: 6, 7, 8, 9, 0',
        type: 'key_intro',
        description: 'Reach upward: Index to 6 and 7, Middle to 8, Ring to 9, Pinky to 0.',
        targetKeys: ['6', '7', '8', '9', '0'],
        learnedKeys: ['0-9', 'a-z'],
        targetFinger: 'Right Hand Number Row Reaches',
        targetFingerCode: 'ri',
        exerciseText: '6 7 8 9 0 67 89 90 78 69 year 1998 code 2048 route 66 speed 120 count 365 order 789 gate 80',
        durationSeconds: 100,
        minAccuracy: 90,
        minWpm: 20,
        tips: ['0 is directly above P; use your right pinky']
      },
      {
        id: 'l9-s3',
        lessonId: 'lesson-9',
        order: 3,
        title: 'Apostrophes, Quotes & Hyphens',
        type: 'words',
        description: 'Master contractions, dialogue quotes, and hyphenated compound words.',
        targetKeys: ["'", '"', '-'],
        learnedKeys: ["'", '"', '-', 'a-z', 'A-Z'],
        targetFinger: 'Right Pinky (Quotes & Hyphens)',
        targetFingerCode: 'rp',
        exerciseText: "don't can't won't it's well-known user-friendly \"hello\" \"yes\" \"ready\" high-speed part-time don't can't",
        durationSeconds: 110,
        minAccuracy: 92,
        minWpm: 22,
        tips: ['Apostrophe is reached with right pinky directly to the right of semicolon']
      },
      {
        id: 'l9-s4',
        lessonId: 'lesson-9',
        order: 4,
        title: 'Questions and Exclamations: ? and !',
        type: 'sentences',
        description: 'Express questions and excitement using Shift + ? and Shift + 1 (!).',
        targetKeys: ['?', '!'],
        learnedKeys: ['?', '!', '0-9', 'A-Z', 'a-z', ',', '.'],
        targetFinger: 'Shift + Punctuation',
        targetFingerCode: 'lp',
        exerciseText: 'Are you ready? Yes, of course! How many items remain? Exactly 42 items! Keep moving forward!',
        durationSeconds: 120,
        minAccuracy: 93,
        minWpm: 25,
        tips: ['! is Left Shift + 1 (left pinky + right shift or right pinky + left pinky reach)']
      },
      {
        id: 'l9-s5',
        lessonId: 'lesson-9',
        order: 5,
        title: 'Data & Technical Passage Sprint',
        type: 'speed_challenge',
        description: 'Type mixed numbers, symbols, and text with at least 26 WPM.',
        targetKeys: ['0-9', 'symbols'],
        learnedKeys: ['0-9', 'A-Z', 'a-z', 'symbols'],
        targetFinger: 'All Fingers',
        targetFingerCode: 'th',
        exerciseText: 'In 2026, over 85% of users completed 15 lessons, improving average speeds from 22 WPM to 54 WPM!',
        durationSeconds: 130,
        minAccuracy: 94,
        minWpm: 26,
        tips: ['Do not look down when reaching for number keys; anchor with the opposite hand']
      },
      {
        id: 'l9-s6',
        lessonId: 'lesson-9',
        order: 6,
        title: 'Complete Number & Symbol Review',
        type: 'review',
        description: 'Full verification of numerical reaches and punctuation.',
        targetKeys: ['0-9', 'punctuation'],
        learnedKeys: ['all characters'],
        targetFinger: 'Complete Keyboard Range',
        targetFingerCode: 'ri',
        exerciseText: 'Flight 747 departs at 08:30 from Gate 14. "Please confirm your 6-digit booking code," said the agent.',
        durationSeconds: 140,
        minAccuracy: 95,
        minWpm: 28,
        tips: ['You have conquered the entire physical keyboard layout!']
      }
    ]
  },

  // =========================================================================
  // LESSON 10: Touch-Typing Mastery & Final Assessment
  // =========================================================================
  {
    id: 'lesson-10',
    order: 10,
    tier: 'advanced',
    title: 'Touch-Typing Mastery & Final Assessment',
    shortTitle: 'Mastery Assessment',
    description: 'Synthesize all skills in high-speed endurance, pinpoint accuracy, dynamic transitions, and earn your Touch-Typing Graduation certificate.',
    objectives: [
      'Maintain 40+ WPM across long-form continuous passages',
      'Sustain over 96% accuracy under endurance conditions',
      'Demonstrate effortless touch-typing without glances at keys',
      'Graduate as a certified touch-typist'
    ],
    keysIntroduced: ['complete mastery'],
    fingersUsed: [
      { finger: 'All 10 Fingers', hand: 'left', keys: ['full keyboard'] }
    ],
    estimatedMinutes: 22,
    subLessons: [
      {
        id: 'l10-s1',
        lessonId: 'lesson-10',
        order: 1,
        title: 'Full Keyboard Flow Warmup',
        type: 'basic_drill',
        description: 'Warm up every finger muscle across balanced rhythm sentences.',
        targetKeys: ['full keyboard'],
        learnedKeys: ['all characters'],
        targetFinger: 'All 10 Fingers',
        targetFingerCode: 'th',
        exerciseText: 'Breathe smoothly, sit upright with relaxed shoulders, and let your fingers find their natural resting home.',
        durationSeconds: 110,
        minAccuracy: 95,
        minWpm: 32,
        tips: ['Gentle breathing and good posture prevent fatigue']
      },
      {
        id: 'l10-s2',
        lessonId: 'lesson-10',
        order: 2,
        title: 'Endurance Marathon: 2-Minute Flow',
        type: 'speed_challenge',
        description: 'Maintain steady momentum across 120 seconds of continuous literature.',
        targetKeys: ['full keyboard'],
        learnedKeys: ['all characters'],
        targetFinger: 'All 10 Fingers',
        targetFingerCode: 'li',
        exerciseText: 'True typing mastery is the art of disappearing into the words. Your fingers become direct extensions of your thoughts, translating ideas into keystrokes with fluid precision, unhindered speed, and effortless grace.',
        durationSeconds: 120,
        minAccuracy: 95,
        minWpm: 38,
        tips: ['Pace yourself: start steady and accelerate through the second half']
      },
      {
        id: 'l10-s3',
        lessonId: 'lesson-10',
        order: 3,
        title: 'The 98% Precision Masterclass',
        type: 'accuracy_challenge',
        description: 'Strict accuracy challenge: hit at least 98% accuracy on challenging vocabulary.',
        targetKeys: ['full keyboard'],
        learnedKeys: ['all characters'],
        targetFinger: 'All 10 Fingers',
        targetFingerCode: 'rm',
        exerciseText: 'Excellence is never an accident; it is always the result of high intention, sincere effort, and intelligent execution.',
        durationSeconds: 120,
        minAccuracy: 98,
        minWpm: 30,
        tips: ['Prioritize perfection on every single keystroke']
      },
      {
        id: 'l10-s4',
        lessonId: 'lesson-10',
        order: 4,
        title: 'Dynamic Real-World Synthesis',
        type: 'sentences',
        description: 'A rich mixture of prose, numbers, dialogue, and varied vocabulary.',
        targetKeys: ['full keyboard'],
        learnedKeys: ['all characters'],
        targetFinger: 'All 10 Fingers',
        targetFingerCode: 'th',
        exerciseText: '"In 2026, technology is best experienced when it feels completely seamless," wrote Dr. Harris in Chapter 4.',
        durationSeconds: 130,
        minAccuracy: 95,
        minWpm: 36,
        tips: ['Transition smoothly between text, quotes, and numbers']
      },
      {
        id: 'l10-s5',
        lessonId: 'lesson-10',
        order: 5,
        title: 'Final Touch-Typing Graduation Trial',
        type: 'review',
        description: 'The definitive comprehensive examination. Pass this trial to complete the TypeArena Touch-Typing Curriculum.',
        targetKeys: ['full keyboard'],
        learnedKeys: ['all characters'],
        targetFinger: 'Complete Touch-Typing Mastery',
        targetFingerCode: 'th',
        exerciseText: 'Congratulations on reaching the pinnacle of the TypeArena Touch-Typing Academy. You have trained all ten fingers, developed instinctive muscle memory, and unlocked true freedom of expression at the keyboard. Keep typing with pride and joy!',
        durationSeconds: 180,
        minAccuracy: 95,
        minWpm: 35,
        tips: ['You are now a certified touch-typist! Celebrate your incredible achievement.']
      }
    ]
  }
];

// Helper functions for curriculum navigation
export function getLessonById(id: string): DetailedLesson | undefined {
  return DETAILED_LESSONS.find((l) => l.id === id);
}

export function getSubLessonById(subId: string): { lesson: DetailedLesson; subLesson: SubLesson } | undefined {
  for (const lesson of DETAILED_LESSONS) {
    const subLesson = lesson.subLessons.find((s) => s.id === subId);
    if (subLesson) {
      return { lesson, subLesson };
    }
  }
  return undefined;
}

export function getNextSubLesson(currentSubId: string): { lesson: DetailedLesson; subLesson: SubLesson } | null {
  for (let lIdx = 0; lIdx < DETAILED_LESSONS.length; lIdx++) {
    const lesson = DETAILED_LESSONS[lIdx];
    const sIdx = lesson.subLessons.findIndex((s) => s.id === currentSubId);
    if (sIdx !== -1) {
      // If there is another sublesson in this lesson
      if (sIdx + 1 < lesson.subLessons.length) {
        return { lesson, subLesson: lesson.subLessons[sIdx + 1] };
      }
      // Otherwise, first sublesson of the next lesson
      if (lIdx + 1 < DETAILED_LESSONS.length) {
        const nextLesson = DETAILED_LESSONS[lIdx + 1];
        if (nextLesson.subLessons.length > 0) {
          return { lesson: nextLesson, subLesson: nextLesson.subLessons[0] };
        }
      }
      return null;
    }
  }
  return null;
}

export function getAllSubLessonsCount(): number {
  return DETAILED_LESSONS.reduce((acc, l) => acc + l.subLessons.length, 0);
}

/**
 * Generates practice drill content targeting user's actual mistakes and weakest keys.
 */
export function generateAdaptivePracticeText(
  mistakeKeys: string[],
  mistakeWords: string[],
  fallbackKeys: string[] = ['f', 'j', 'd', 'k', 's', 'l', 'a', ';']
): string {
  const cleanKeys = mistakeKeys
    .map((k) => k.toLowerCase().trim())
    .filter((k) => k.length === 1 && /[a-z0-9;,.]/i.test(k));

  const activeKeys = cleanKeys.length > 0 ? cleanKeys : fallbackKeys;

  const keyPairs: string[] = [];
  for (let i = 0; i < activeKeys.length; i++) {
    const k1 = activeKeys[i];
    const k2 = activeKeys[(i + 1) % activeKeys.length];
    keyPairs.push(`${k1} ${k1} ${k2} ${k2} ${k1}${k2} ${k2}${k1}`);
    keyPairs.push(`${k1}${k2}${k1} ${k2}${k1}${k2}`);
  }

  const cleanWords = mistakeWords
    .map((w) => w.trim().replace(/[^a-zA-Z0-9]/g, ''))
    .filter((w) => w.length > 1);

  const wordRepeats: string[] = [];
  cleanWords.slice(0, 8).forEach((word) => {
    wordRepeats.push(`${word} ${word}`);
  });

  const combined = [
    ...keyPairs,
    ...wordRepeats,
    ...keyPairs.reverse()
  ].join(' ');

  return combined.length > 30 ? combined : 'focus on steady cadence and accurate finger reaches on every keystroke.';
}
