import type { CourseLesson } from '../types';

export const COURSE_LESSONS: CourseLesson[] = [
  // BEGINNER CURRICULUM
  {
    id: 'beg-1',
    tier: 'beginner',
    order: 1,
    title: 'Home Row: ASDF JKL;',
    description: 'Learn the primary resting position for all 8 fingers. Keep your index fingers anchored on F and J bumps.',
    targetKeys: ['a', 's', 'd', 'f', 'j', 'k', 'l', ';'],
    fingerTips: [
      { finger: 'Left Pinky', keys: ['a'] },
      { finger: 'Left Ring', keys: ['s'] },
      { finger: 'Left Middle', keys: ['d'] },
      { finger: 'Left Index', keys: ['f'] },
      { finger: 'Right Index', keys: ['j'] },
      { finger: 'Right Middle', keys: ['k'] },
      { finger: 'Right Ring', keys: ['l'] },
      { finger: 'Right Pinky', keys: [';'] }
    ],
    exerciseText: 'asdf jkl; asdf jkl; a s d f j k l ; ff jj kk dd ss aa ll ;; fad lad ask dad flask salads fall',
    minAccuracy: 90,
    minWpm: 15
  },
  {
    id: 'beg-2',
    tier: 'beginner',
    order: 2,
    title: 'Home Row Center: G & H',
    description: 'Reach inward with your index fingers to tap G and H without shifting your other fingers.',
    targetKeys: ['g', 'h'],
    fingerTips: [
      { finger: 'Left Index', keys: ['f', 'g'] },
      { finger: 'Right Index', keys: ['j', 'h'] }
    ],
    exerciseText: 'fgf jhj ggg hhh flag glad half dash hash flash hall fall shag jag sash gash glad half',
    minAccuracy: 90,
    minWpm: 18
  },
  {
    id: 'beg-3',
    tier: 'beginner',
    order: 3,
    title: 'Top Row: QWERTY UIOP',
    description: 'Reach up from home row to the top row keys, returning fingers immediately to home position.',
    targetKeys: ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    fingerTips: [
      { finger: 'Left Pinky', keys: ['q'] },
      { finger: 'Left Ring', keys: ['w'] },
      { finger: 'Left Middle', keys: ['e'] },
      { finger: 'Left Index', keys: ['r', 't'] },
      { finger: 'Right Index', keys: ['y', 'u'] },
      { finger: 'Right Middle', keys: ['i'] },
      { finger: 'Right Ring', keys: ['o'] },
      { finger: 'Right Pinky', keys: ['p'] }
    ],
    exerciseText: 'type wire rope tree quiet power write order trip poet peer route equip require port quote',
    minAccuracy: 92,
    minWpm: 20
  },
  {
    id: 'beg-4',
    tier: 'beginner',
    order: 4,
    title: 'Bottom Row: ZXCV BNM',
    description: 'Reach downwards with slight angle to bottom row keys while maintaining gentle wrist elevation.',
    targetKeys: ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.'],
    fingerTips: [
      { finger: 'Left Pinky', keys: ['z'] },
      { finger: 'Left Ring', keys: ['x'] },
      { finger: 'Left Middle', keys: ['c'] },
      { finger: 'Left Index', keys: ['v', 'b'] },
      { finger: 'Right Index', keys: ['n', 'm'] },
      { finger: 'Right Middle', keys: [','] },
      { finger: 'Right Ring', keys: ['.'] }
    ],
    exerciseText: 'zone view exit back move calm camp bone next maze scan buzz vine verb climb mix box comb zero',
    minAccuracy: 92,
    minWpm: 20
  },
  {
    id: 'beg-5',
    tier: 'beginner',
    order: 5,
    title: 'Full Keyboard Flow',
    description: 'Seamlessly combine all three rows with common short English words.',
    targetKeys: ['all letters'],
    fingerTips: [
      { finger: 'Thumbs', keys: ['space'] }
    ],
    exerciseText: 'the quick brown fox jumps over the lazy dog and runs across the wide green fields with great joy',
    minAccuracy: 94,
    minWpm: 25
  },

  // INTERMEDIATE CURRICULUM
  {
    id: 'int-1',
    tier: 'intermediate',
    order: 1,
    title: 'Most Common Bigrams',
    description: 'Train muscle memory for the most frequent English two-letter combinations: th, he, in, er, an, re, on, at, en, nd.',
    targetKeys: ['t', 'h', 'e', 'i', 'n', 'r', 'a', 'o'],
    fingerTips: [
      { finger: 'Focus', keys: ['Transition speed between consecutive finger movements'] }
    ],
    exerciseText: 'the they then there their other mother father brother water under enter another stand land friend send',
    minAccuracy: 95,
    minWpm: 32
  },
  {
    id: 'int-2',
    tier: 'intermediate',
    order: 2,
    title: '100 Frequent Vocabulary Words',
    description: 'Build instantaneous recognition of core words without looking at the keyboard.',
    targetKeys: ['common words'],
    fingerTips: [
      { finger: 'Focus', keys: ['Type whole words as single rhythmic bursts'] }
    ],
    exerciseText: 'about which their would people could first after should between through change light house world school place',
    minAccuracy: 95,
    minWpm: 35
  },
  {
    id: 'int-3',
    tier: 'intermediate',
    order: 3,
    title: 'Number Row Fluency',
    description: 'Reach up to the number keys 1 through 0 using the standard finger assignments.',
    targetKeys: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    fingerTips: [
      { finger: 'Left Pinky', keys: ['1'] },
      { finger: 'Left Ring', keys: ['2'] },
      { finger: 'Left Middle', keys: ['3'] },
      { finger: 'Left Index', keys: ['4', '5'] },
      { finger: 'Right Index', keys: ['6', '7'] },
      { finger: 'Right Middle', keys: ['8'] },
      { finger: 'Right Ring', keys: ['9'] },
      { finger: 'Right Pinky', keys: ['0'] }
    ],
    exerciseText: 'room 404 year 1998 code 2048 route 66 speed 120 count 365 items 789 gate 15 order 820 track 930',
    minAccuracy: 93,
    minWpm: 28
  },
  {
    id: 'int-4',
    tier: 'intermediate',
    order: 4,
    title: 'Capitalization & Shift Keys',
    description: 'Use opposite Shift keys: press Right Shift for left-hand letters, Left Shift for right-hand letters.',
    targetKeys: ['Shift', 'A-Z'],
    fingerTips: [
      { finger: 'Left Pinky', keys: ['Left Shift'] },
      { finger: 'Right Pinky', keys: ['Right Shift'] }
    ],
    exerciseText: 'London Paris Tokyo New York Delhi Berlin Sydney Rome Toronto Singapore Chicago Boston Madrid Zurich',
    minAccuracy: 94,
    minWpm: 30
  },
  {
    id: 'int-5',
    tier: 'intermediate',
    order: 5,
    title: 'Speed Building Sprint',
    description: 'Maintain high momentum with simple, rhythmically balanced words.',
    targetKeys: ['balanced words'],
    fingerTips: [
      { finger: 'Focus', keys: ['Eliminate micro-pauses between words'] }
    ],
    exerciseText: 'time work fast live flow glow mind build dream reach create spark pulse stream power focus shine rapid',
    minAccuracy: 96,
    minWpm: 45
  },

  // ADVANCED CURRICULUM
  {
    id: 'adv-1',
    tier: 'advanced',
    order: 1,
    title: 'Programming Syntax & Symbols',
    description: 'Master braces, brackets, quotes, semicolons, and operators without slowing down.',
    targetKeys: ['{', '}', '[', ']', '(', ')', '<', '>', ';', ':', '=', '+', '-', '*'],
    fingerTips: [
      { finger: 'Pinkies & Ring', keys: ['Brackets, parentheses, semicolons, equal signs'] }
    ],
    exerciseText: 'const items = [10, 20, 30]; if (value >= 0 && value <= 100) { return items.filter(x => x > 15); }',
    minAccuracy: 94,
    minWpm: 35
  },
  {
    id: 'adv-2',
    tier: 'advanced',
    order: 2,
    title: 'Complex Punctuation & Quotes',
    description: 'Type rich literary passages with dialogue quotes, hyphens, semicolons, and commas.',
    targetKeys: ['"', "'", '-', ';', ':', '?', '!'],
    fingerTips: [
      { finger: 'Focus', keys: ['Smooth punctuation transitions without breaking rhythm'] }
    ],
    exerciseText: '"Simplicity," he whispered, "is not the absence of clutter; it is the presence of purpose." Isn\'t that true?',
    minAccuracy: 95,
    minWpm: 40
  },
  {
    id: 'adv-3',
    tier: 'advanced',
    order: 3,
    title: 'Difficult Letter Combinations',
    description: 'Tricky consonant clusters and awkward reaches (e.g. sq, zw, xt, pl, cr, br, qu).',
    targetKeys: ['q', 'z', 'x', 'w', 'p', 'b'],
    fingerTips: [
      { finger: 'Focus', keys: ['Finger isolation and rapid independent striking'] }
    ],
    exerciseText: 'squid quartz oxygen complex exquisite bronze sapphire physics puzzle rhythmic awkward zigzag squeeze',
    minAccuracy: 95,
    minWpm: 42
  },
  {
    id: 'adv-4',
    tier: 'advanced',
    order: 4,
    title: 'Master Marathon',
    description: 'A full endurance passage testing speed, accuracy, consistency, and pacing.',
    targetKeys: ['endurance'],
    fingerTips: [
      { finger: 'Focus', keys: ['Deep concentration, calm breathing, smooth cadence'] }
    ],
    exerciseText: 'True typing mastery is the art of disappearing into the words. Your fingers become direct extensions of your thoughts, translating ideas into keystrokes with fluid precision, unhindered speed, and effortless grace.',
    minAccuracy: 97,
    minWpm: 55
  }
];
