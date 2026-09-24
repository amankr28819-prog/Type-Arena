/**
 * =========================================================================
 * TYPEARENA CANONICAL QWERTY TOUCH-TYPING FINGER MAPPING SYSTEM
 * =========================================================================
 * Single source of truth for:
 * - Keyboard key highlighting
 * - Finger highlighting & anatomical reach
 * - Hand placement visualization
 * - Lesson & sublesson guidance
 * - Per-finger analytics & weak-finger detection
 * - Adaptive practice recommendations
 */

export type FingerCode = 'lp' | 'lr' | 'lm' | 'li' | 'th' | 'ri' | 'rm' | 'rr' | 'rp';

export type FingerId =
  | 'left-pinky'
  | 'left-ring'
  | 'left-middle'
  | 'left-index'
  | 'left-thumb'
  | 'right-thumb'
  | 'right-index'
  | 'right-middle'
  | 'right-ring'
  | 'right-pinky';

export type HandSide = 'left' | 'right';

export type ReachDirection = 'home' | 'up' | 'down' | 'inner' | 'outer';

export interface FingerDefinition {
  id: FingerId;
  code: FingerCode;
  name: string;
  hand: HandSide;
  homeKey: string;
  color: string;
  badgeBg: string;
  badgeText: string;
  isAnchor: boolean;
  assignedKeys: string[];
}

export interface KeyFingerAssignment {
  char: string;
  displayKey: string;
  id: FingerId; // backward compatibility
  fingerId: FingerId;
  name: string; // backward compatibility
  fingerCode: FingerCode;
  fingerName: string;
  hand: HandSide;
  homeKey: string;
  color: string;
  reachDirection: ReachDirection;
  isAnchor: boolean;
  needsShift: boolean;
  shiftHand?: HandSide;
  shiftFingerCode?: FingerCode;
  shiftFingerName?: string;
  description: string;
}

/**
 * Standard Finger Color Palette & Badges
 */
export const FINGER_COLORS: Record<FingerCode, { bg: string; text: string; name: string }> = {
  lp: { bg: 'rgba(236, 72, 153, 0.18)', text: '#f472b6', name: 'Left Pinky' },
  lr: { bg: 'rgba(168, 85, 247, 0.18)', text: '#c084fc', name: 'Left Ring' },
  lm: { bg: 'rgba(59, 130, 246, 0.18)', text: '#60a5fa', name: 'Left Middle' },
  li: { bg: 'rgba(16, 185, 129, 0.18)', text: '#34d399', name: 'Left Index' },
  th: { bg: 'rgba(245, 158, 11, 0.18)', text: '#fbbf24', name: 'Thumbs' },
  ri: { bg: 'rgba(20, 184, 166, 0.18)', text: '#2dd4bf', name: 'Right Index' },
  rm: { bg: 'rgba(59, 130, 246, 0.18)', text: '#60a5fa', name: 'Right Middle' },
  rr: { bg: 'rgba(168, 85, 247, 0.18)', text: '#c084fc', name: 'Right Ring' },
  rp: { bg: 'rgba(236, 72, 153, 0.18)', text: '#f472b6', name: 'Right Pinky' }
};

/**
 * Canonical 10-Finger Architecture Definitions
 */
export const ALL_FINGERS: Record<FingerId, FingerDefinition> = {
  'left-pinky': {
    id: 'left-pinky',
    code: 'lp',
    name: 'Left Pinky',
    hand: 'left',
    homeKey: 'A',
    color: '#ec4899',
    badgeBg: FINGER_COLORS.lp.bg,
    badgeText: FINGER_COLORS.lp.text,
    isAnchor: false,
    assignedKeys: ['q', 'a', 'z', '1', '`', '~', '!', 'tab', 'capslock', 'shiftleft']
  },
  'left-ring': {
    id: 'left-ring',
    code: 'lr',
    name: 'Left Ring',
    hand: 'left',
    homeKey: 'S',
    color: '#a855f7',
    badgeBg: FINGER_COLORS.lr.bg,
    badgeText: FINGER_COLORS.lr.text,
    isAnchor: false,
    assignedKeys: ['w', 's', 'x', '2', '@']
  },
  'left-middle': {
    id: 'left-middle',
    code: 'lm',
    name: 'Left Middle',
    hand: 'left',
    homeKey: 'D',
    color: '#3b82f6',
    badgeBg: FINGER_COLORS.lm.bg,
    badgeText: FINGER_COLORS.lm.text,
    isAnchor: false,
    assignedKeys: ['e', 'd', 'c', '3', '#']
  },
  'left-index': {
    id: 'left-index',
    code: 'li',
    name: 'Left Index',
    hand: 'left',
    homeKey: 'F',
    color: '#10b981',
    badgeBg: FINGER_COLORS.li.bg,
    badgeText: FINGER_COLORS.li.text,
    isAnchor: true, // Physical anchor bump on F
    assignedKeys: ['r', 't', 'f', 'g', 'v', 'b', '4', '5', '$', '%']
  },
  'left-thumb': {
    id: 'left-thumb',
    code: 'th',
    name: 'Thumbs',
    hand: 'left',
    homeKey: 'Space',
    color: '#f59e0b',
    badgeBg: FINGER_COLORS.th.bg,
    badgeText: FINGER_COLORS.th.text,
    isAnchor: false,
    assignedKeys: [' ']
  },
  'right-thumb': {
    id: 'right-thumb',
    code: 'th',
    name: 'Thumbs',
    hand: 'right',
    homeKey: 'Space',
    color: '#f59e0b',
    badgeBg: FINGER_COLORS.th.bg,
    badgeText: FINGER_COLORS.th.text,
    isAnchor: false,
    assignedKeys: [' ']
  },
  'right-index': {
    id: 'right-index',
    code: 'ri',
    name: 'Right Index',
    hand: 'right',
    homeKey: 'J',
    color: '#14b8a6',
    badgeBg: FINGER_COLORS.ri.bg,
    badgeText: FINGER_COLORS.ri.text,
    isAnchor: true, // Physical anchor bump on J
    assignedKeys: ['y', 'u', 'h', 'j', 'n', 'm', '6', '7', '^', '&']
  },
  'right-middle': {
    id: 'right-middle',
    code: 'rm',
    name: 'Right Middle',
    hand: 'right',
    homeKey: 'K',
    color: '#3b82f6',
    badgeBg: FINGER_COLORS.rm.bg,
    badgeText: FINGER_COLORS.rm.text,
    isAnchor: false,
    assignedKeys: ['i', 'k', ',', '<', '8', '*']
  },
  'right-ring': {
    id: 'right-ring',
    code: 'rr',
    name: 'Right Ring',
    hand: 'right',
    homeKey: 'L',
    color: '#a855f7',
    badgeBg: FINGER_COLORS.rr.bg,
    badgeText: FINGER_COLORS.rr.text,
    isAnchor: false,
    assignedKeys: ['o', 'l', '.', '>', '9', '(']
  },
  'right-pinky': {
    id: 'right-pinky',
    code: 'rp',
    name: 'Right Pinky',
    hand: 'right',
    homeKey: ';',
    color: '#ec4899',
    badgeBg: FINGER_COLORS.rp.bg,
    badgeText: FINGER_COLORS.rp.text,
    isAnchor: false,
    assignedKeys: [
      'p', ';', ':', "'", '"', '/', '?', '0', ')', '-', '_', '=', '+',
      '[', '{', ']', '}', '\\', '|', 'enter', 'backspace', 'shiftright'
    ]
  }
};

/**
 * Fast lookup map from single character or key symbol to canonical assignment
 */
interface KeyMetadata {
  fingerId: FingerId;
  reach: ReachDirection;
  needsShift?: boolean;
}

const RAW_KEY_MAP: Record<string, KeyMetadata> = {
  // --- SPACE / THUMB ---
  ' ': { fingerId: 'right-thumb', reach: 'home' },
  'space': { fingerId: 'right-thumb', reach: 'home' },

  // --- LEFT PINKY (A, Q, Z, 1, `) ---
  'a': { fingerId: 'left-pinky', reach: 'home' },
  'q': { fingerId: 'left-pinky', reach: 'up' },
  'z': { fingerId: 'left-pinky', reach: 'down' },
  '1': { fingerId: 'left-pinky', reach: 'up' },
  '`': { fingerId: 'left-pinky', reach: 'up' },
  '~': { fingerId: 'left-pinky', reach: 'up', needsShift: true },
  '!': { fingerId: 'left-pinky', reach: 'up', needsShift: true },
  'tab': { fingerId: 'left-pinky', reach: 'up' },
  'capslock': { fingerId: 'left-pinky', reach: 'home' },
  'shiftleft': { fingerId: 'left-pinky', reach: 'down' },

  // --- LEFT RING (S, W, X, 2) ---
  's': { fingerId: 'left-ring', reach: 'home' },
  'w': { fingerId: 'left-ring', reach: 'up' },
  'x': { fingerId: 'left-ring', reach: 'down' },
  '2': { fingerId: 'left-ring', reach: 'up' },
  '@': { fingerId: 'left-ring', reach: 'up', needsShift: true },

  // --- LEFT MIDDLE (D, E, C, 3) ---
  'd': { fingerId: 'left-middle', reach: 'home' },
  'e': { fingerId: 'left-middle', reach: 'up' },
  'c': { fingerId: 'left-middle', reach: 'down' },
  '3': { fingerId: 'left-middle', reach: 'up' },
  '#': { fingerId: 'left-middle', reach: 'up', needsShift: true },

  // --- LEFT INDEX (F, G, R, T, V, B, 4, 5) ---
  // IMPORTANT: T and R and F and G and V and B are ALL Left Index!
  'f': { fingerId: 'left-index', reach: 'home' },
  'g': { fingerId: 'left-index', reach: 'inner' },
  'r': { fingerId: 'left-index', reach: 'up' },
  't': { fingerId: 'left-index', reach: 'up' },
  'v': { fingerId: 'left-index', reach: 'down' },
  'b': { fingerId: 'left-index', reach: 'down' },
  '4': { fingerId: 'left-index', reach: 'up' },
  '5': { fingerId: 'left-index', reach: 'up' },
  '$': { fingerId: 'left-index', reach: 'up', needsShift: true },
  '%': { fingerId: 'left-index', reach: 'up', needsShift: true },

  // --- RIGHT INDEX (J, H, U, Y, M, N, 6, 7) ---
  'j': { fingerId: 'right-index', reach: 'home' },
  'h': { fingerId: 'right-index', reach: 'inner' },
  'u': { fingerId: 'right-index', reach: 'up' },
  'y': { fingerId: 'right-index', reach: 'up' },
  'm': { fingerId: 'right-index', reach: 'down' },
  'n': { fingerId: 'right-index', reach: 'down' },
  '6': { fingerId: 'right-index', reach: 'up' },
  '7': { fingerId: 'right-index', reach: 'up' },
  '^': { fingerId: 'right-index', reach: 'up', needsShift: true },
  '&': { fingerId: 'right-index', reach: 'up', needsShift: true },

  // --- RIGHT MIDDLE (K, I, ,, 8) ---
  'k': { fingerId: 'right-middle', reach: 'home' },
  'i': { fingerId: 'right-middle', reach: 'up' },
  ',': { fingerId: 'right-middle', reach: 'down' },
  '<': { fingerId: 'right-middle', reach: 'down', needsShift: true },
  '8': { fingerId: 'right-middle', reach: 'up' },
  '*': { fingerId: 'right-middle', reach: 'up', needsShift: true },

  // --- RIGHT RING (L, O, ., 9) ---
  'l': { fingerId: 'right-ring', reach: 'home' },
  'o': { fingerId: 'right-ring', reach: 'up' },
  '.': { fingerId: 'right-ring', reach: 'down' },
  '>': { fingerId: 'right-ring', reach: 'down', needsShift: true },
  '9': { fingerId: 'right-ring', reach: 'up' },
  '(': { fingerId: 'right-ring', reach: 'up', needsShift: true },

  // --- RIGHT PINKY (;, P, /, 0, -, =, [, ], ', Enter) ---
  ';': { fingerId: 'right-pinky', reach: 'home' },
  ':': { fingerId: 'right-pinky', reach: 'home', needsShift: true },
  'p': { fingerId: 'right-pinky', reach: 'up' },
  '/': { fingerId: 'right-pinky', reach: 'down' },
  '?': { fingerId: 'right-pinky', reach: 'down', needsShift: true },
  "'": { fingerId: 'right-pinky', reach: 'home' },
  '"': { fingerId: 'right-pinky', reach: 'home', needsShift: true },
  '[': { fingerId: 'right-pinky', reach: 'up' },
  '{': { fingerId: 'right-pinky', reach: 'up', needsShift: true },
  ']': { fingerId: 'right-pinky', reach: 'up' },
  '}': { fingerId: 'right-pinky', reach: 'up', needsShift: true },
  '\\': { fingerId: 'right-pinky', reach: 'up' },
  '|': { fingerId: 'right-pinky', reach: 'up', needsShift: true },
  '0': { fingerId: 'right-pinky', reach: 'up' },
  ')': { fingerId: 'right-pinky', reach: 'up', needsShift: true },
  '-': { fingerId: 'right-pinky', reach: 'up' },
  '_': { fingerId: 'right-pinky', reach: 'up', needsShift: true },
  '=': { fingerId: 'right-pinky', reach: 'up' },
  '+': { fingerId: 'right-pinky', reach: 'up', needsShift: true },
  'enter': { fingerId: 'right-pinky', reach: 'home' },
  'backspace': { fingerId: 'right-pinky', reach: 'up' },
  'shiftright': { fingerId: 'right-pinky', reach: 'down' }
};

/**
 * Resolves the canonical finger assignment for any character or key.
 * Guaranteed to return correct standard touch-typing mappings.
 */
export function getFingerForKey(charOrKey: string): KeyFingerAssignment {
  if (!charOrKey) {
    return {
      char: '',
      displayKey: '',
      id: 'right-thumb',
      fingerId: 'right-thumb',
      name: 'Thumbs',
      fingerCode: 'th',
      fingerName: 'Thumbs',
      hand: 'right',
      homeKey: 'Space',
      color: '#f59e0b',
      reachDirection: 'home',
      isAnchor: false,
      needsShift: false,
      description: 'Rest on home row'
    };
  }

  const raw = charOrKey;
  const lower = charOrKey.toLowerCase();
  const isUppercaseLetter = charOrKey.length === 1 && charOrKey >= 'A' && charOrKey <= 'Z';

  // Check lookup table with lower-case key or symbol
  const entry = RAW_KEY_MAP[lower] || RAW_KEY_MAP[charOrKey];

  if (entry) {
    const finger = ALL_FINGERS[entry.fingerId];
    const needsShift = Boolean(entry.needsShift || isUppercaseLetter);

    // Opposite hand shift mapping
    let shiftHand: HandSide | undefined;
    let shiftFingerCode: FingerCode | undefined;
    let shiftFingerName: string | undefined;

    if (needsShift) {
      if (finger.hand === 'left') {
        shiftHand = 'right';
        shiftFingerCode = 'rp';
        shiftFingerName = 'Right Pinky (Shift)';
      } else {
        shiftHand = 'left';
        shiftFingerCode = 'lp';
        shiftFingerName = 'Left Pinky (Shift)';
      }
    }

    const displayKey = raw === ' ' ? 'Space' : raw.toUpperCase();

    return {
      char: raw,
      displayKey,
      id: finger.id,
      fingerId: finger.id,
      name: finger.name,
      fingerCode: finger.code,
      fingerName: finger.name,
      hand: finger.hand,
      homeKey: finger.homeKey,
      color: finger.color,
      reachDirection: entry.reach,
      isAnchor: finger.isAnchor && entry.reach === 'home',
      needsShift,
      shiftHand,
      shiftFingerCode,
      shiftFingerName,
      description: `${finger.name} • ${displayKey}`
    };
  }

  // Fallback for uncommon symbols / right side
  return {
    char: raw,
    displayKey: raw,
    id: 'right-pinky',
    fingerId: 'right-pinky',
    name: 'Right Pinky',
    fingerCode: 'rp',
    fingerName: 'Right Pinky',
    hand: 'right',
    homeKey: ';',
    color: '#ec4899',
    reachDirection: 'up',
    isAnchor: false,
    needsShift: false,
    description: `Right Pinky • ${raw}`
  };
}

/**
 * Backward compatibility alias for existing imports
 */
export const getFingerForChar = getFingerForKey;
