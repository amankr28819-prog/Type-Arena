export type TestMode = 'time' | 'words' | 'quote' | 'code' | 'zen' | 'custom';
export type TimeOption = 15 | 30 | 60 | 120 | 'custom';
export type WordOption = 10 | 25 | 50 | 100 | 'custom';
export type QuoteLength = 'short' | 'medium' | 'long';
export type Difficulty = 'easy' | 'normal' | 'advanced' | 'expert' | 'master';
export type LayoutType = 'classic' | 'minimal' | 'focus' | 'dashboard' | 'developer';
export type CaretStyle = 'line' | 'block' | 'underline' | 'box';
export type SoundProfile = 'off' | 'clicky' | 'tactile' | 'linear' | 'typewriter' | 'beep';
export type LanguageOption = 'english' | 'hindi' | 'spanish' | 'french' | 'german';

export interface ThemeColors {
  bgMain: string;
  bgSurface: string;
  bgSubtle: string;
  borderColor: string;
  textMain: string;
  textSub: string;
  textMuted: string;
  colorPrimary: string;
  colorCorrect: string;
  colorError: string;
  colorErrorBg: string;
  colorCaret: string;
  keyBg: string;
  keyText: string;
  keyActive: string;
}

export interface ThemeAtmosphere {
  glow?: string;
  ambientParticles?: 'stars' | 'bubbles' | 'matrix' | 'sparks' | 'sakura' | 'neon' | 'dust' | 'none';
  gridPattern?: boolean;
  glassOpacity?: number;
}

export interface ThemeConfig {
  id: string;
  name: string;
  category: 'dark' | 'light' | 'retro' | 'colorful' | 'minimal' | 'scifi' | 'nature';
  colors: ThemeColors;
  atmosphere?: ThemeAtmosphere;
}

export type AnimationIntensity = 'off' | 'low' | 'medium' | 'high';
export type UiDepth = 'none' | 'subtle' | 'medium' | 'deep';
export type BackgroundAtmosphere = 'none' | 'subtle' | 'dynamic';
export type ThemePreset = 'minimal' | 'balanced' | 'immersive' | 'futuristic';

export interface UserSettings {
  themeId: string;
  customThemes: ThemeConfig[];
  layout: LayoutType;
  fontFamily: string;
  fontSize: number; // in px
  caretStyle: CaretStyle;
  smoothCaret: boolean;
  soundProfile: SoundProfile;
  soundVolume: number; // 0 to 1
  playErrorSound: boolean;
  blindMode: boolean;
  stopOnError: boolean;
  disableBackspace: boolean;
  difficulty: Difficulty;
  minWpm: number; // 0 = disabled
  minAccuracy: number; // 0 = disabled
  targetWpm: number; // 0 = disabled
  showLiveWpm: boolean;
  showLiveAccuracy: boolean;
  showLiveTimer: boolean;
  showVirtualKeyboard: boolean;
  keyboardHeatmap: boolean;
  reducedMotion: boolean;
  highContrast: boolean;
  language: LanguageOption;
  punctuation: boolean;
  numbers: boolean;
  animationIntensity: AnimationIntensity;
  uiDepth: UiDepth;
  backgroundAtmosphere: BackgroundAtmosphere;
  glassmorphism: boolean;
  cardTilt: boolean;
  cursorGlow: boolean;
  themePreset: ThemePreset;
}

export interface KeystrokeEvent {
  key: string;
  expected: string;
  timestamp: number;
  isCorrect: boolean;
  latencyMs: number;
}

export interface CharacterStats {
  correct: number;
  incorrect: number;
  extra: number;
  missed: number;
}

export interface TestResult {
  id: string;
  timestamp: number;
  mode: TestMode;
  duration: number; // in seconds
  wordCount: number;
  wpm: number;
  rawWpm: number;
  netWpm: number;
  burstWpm?: number;
  accuracy: number;
  consistency: number;
  characterStats: CharacterStats;
  backspaceCount: number;
  mistakes: string[]; // unique characters mistyped
  mistypedWords: string[];
  keystrokes: KeystrokeEvent[];
  timeline: { time: number; wpm: number; rawWpm: number; errors: number }[];
  difficulty: Difficulty;
  language: LanguageOption;
  passedMinCriteria?: boolean;
}

export interface PersonalBests {
  time15: number;
  time30: number;
  time60: number;
  time120: number;
  words10: number;
  words25: number;
  words50: number;
  words100: number;
  bestAccuracy: number;
  bestConsistency: number;
}

export interface KeyAnalytics {
  key: string;
  totalPresses: number;
  errorCount: number;
  errorRate: number; // 0 to 100
  avgLatencyMs: number;
}

export interface BigramAnalytics {
  bigram: string;
  count: number;
  errorCount: number;
  errorRate: number;
  avgLatencyMs: number;
}

export interface CourseLesson {
  id: string;
  title: string;
  tier: 'beginner' | 'intermediate' | 'advanced';
  order: number;
  description: string;
  targetKeys: string[];
  fingerTips: { finger: string; keys: string[] }[];
  exerciseText: string;
  minAccuracy: number;
  minWpm: number;
}

export interface CourseProgress {
  lessonId: string;
  completed: boolean;
  stars: number; // 1 to 3
  bestWpm: number;
  bestAccuracy: number;
  timestamp: number;
}

export type SubLessonType =
  | 'key_intro'
  | 'basic_drill'
  | 'spacing_drill'
  | 'words'
  | 'sentences'
  | 'accuracy_challenge'
  | 'speed_challenge'
  | 'review';

export interface SubLesson {
  id: string;
  lessonId: string;
  order: number;
  title: string;
  type: SubLessonType;
  description: string;
  targetKeys: string[];
  learnedKeys: string[];
  targetFinger: string;
  targetFingerCode: 'lp' | 'lr' | 'lm' | 'li' | 'th' | 'ri' | 'rm' | 'rr' | 'rp';
  exerciseText: string;
  durationSeconds: number;
  minAccuracy: number;
  minWpm: number;
  tips: string[];
}

export interface DetailedLesson {
  id: string;
  order: number;
  tier: 'beginner' | 'intermediate' | 'advanced';
  title: string;
  shortTitle: string;
  description: string;
  objectives: string[];
  keysIntroduced: string[];
  fingersUsed: { finger: string; hand: 'left' | 'right'; keys: string[] }[];
  estimatedMinutes: number;
  subLessons: SubLesson[];
}

export interface SubLessonProgress {
  subLessonId: string;
  lessonId: string;
  completed: boolean;
  bestWpm: number;
  bestAccuracy: number;
  bestConsistency: number;
  lowestErrors: number;
  attempts: number;
  totalTimeSpent: number; // in seconds
  keyStats: Record<string, { correct: number; incorrect: number }>;
  timestamp: number;
}

export interface LearnStats {
  completedLessonsCount: number;
  completedSubLessonsCount: number;
  totalSubLessonsCount: number;
  courseProgressPercent: number;
  totalLearningTimeSeconds: number;
  bestOverallWpm: number;
  bestOverallAccuracy: number;
  weakestKeys: { key: string; errorRate: number; attempts: number }[];
  currentStreakDays: number;
}

export interface ExamConfig {
  duration: number; // in seconds, e.g. 60, 120, 300
  minWpm: number;
  minAccuracy: number;
  punctuation: boolean;
  numbers: boolean;
  allowBackspace: boolean;
  strictStopOnError: boolean;
}

export interface ExamResult {
  passed: boolean;
  config: ExamConfig;
  wpm: number;
  accuracy: number;
  errors: number;
  date: string;
  reasons: string[];
  certificateId: string;
}
