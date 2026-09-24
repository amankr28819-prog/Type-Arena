/**
 * TypeArena Canonical Typing Engine & Session State
 * 
 * Single source of truth for:
 * - Session state & lifecycle
 * - Timestamp-based precision timer (no setInterval drift)
 * - True keystroke accuracy (Backspace NEVER erases historical errors)
 * - Official Net WPM & Raw WPM calculation
 * - Comprehensive error tracking and per-key analytics
 */

export type SessionStatus = 'idle' | 'countdown' | 'running' | 'paused' | 'completed' | 'expired';

export interface KeystrokeRecord {
  key: string;
  expected: string;
  timestamp: number;
  isCorrect: boolean;
  latencyMs: number;
}

export interface ErrorRecord {
  expected: string;
  actual: string;
  index: number;
  timestamp: number;
}

export interface KeyStats {
  correct: number;
  incorrect: number;
  accuracy: number;
}

export interface TypingSession {
  status: SessionStatus;
  mode: string;
  duration: number; // configured duration in seconds (0 for untimed)
  startTime: number | null;
  endTime: number | null;
  pauseTime: number | null;
  accumulatedPauseMs: number;
  elapsedMs: number;
  remainingMs: number;

  targetText: string;
  targetWords: string[];
  currentWordIndex: number;
  currentInput: string;
  wordHistory: string[];
  currentIndex: number;

  totalKeystrokes: number;
  correctKeystrokes: number;
  incorrectKeystrokes: number;
  backspaces: number;

  totalCharactersAttempted: number;
  correctCharacters: number;
  incorrectCharacters: number;

  wpm: number;
  rawWpm: number;
  accuracy: number;

  errorsByKey: Record<string, number>;
  correctByKey: Record<string, number>;
  history: KeystrokeRecord[];
  errors: ErrorRecord[];
  timeline: { time: number; wpm: number; rawWpm: number; errors: number }[];
}

export interface CreateSessionOptions {
  targetText: string;
  mode?: string;
  duration?: number;
}

/**
 * Creates a fresh, canonical typing session.
 */
export function createTypingSession(options: CreateSessionOptions): TypingSession {
  const targetText = options.targetText || '';
  const duration = options.duration && options.duration > 0 ? options.duration : 0;
  const targetWords = targetText.split(' ');

  return {
    status: 'idle',
    mode: options.mode || 'time',
    duration,
    startTime: null,
    endTime: null,
    pauseTime: null,
    accumulatedPauseMs: 0,
    elapsedMs: 0,
    remainingMs: duration * 1000,

    targetText,
    targetWords,
    currentWordIndex: 0,
    currentInput: '',
    wordHistory: [],
    currentIndex: 0,

    totalKeystrokes: 0,
    correctKeystrokes: 0,
    incorrectKeystrokes: 0,
    backspaces: 0,

    totalCharactersAttempted: 0,
    correctCharacters: 0,
    incorrectCharacters: 0,

    wpm: 0,
    rawWpm: 0,
    accuracy: 100,

    errorsByKey: {},
    correctByKey: {},
    history: [],
    errors: [],
    timeline: []
  };
}

/**
 * Accuracy = correct keystrokes / (correct keystrokes + incorrect keystrokes)
 * Backspace DOES NOT decrease incorrect keystrokes.
 */
export function calculateAccuracy(correctKeystrokes: number, incorrectKeystrokes: number): number {
  const total = correctKeystrokes + incorrectKeystrokes;
  if (total <= 0) return 100;
  const acc = (correctKeystrokes / total) * 100;
  return Math.min(100, Math.max(0, parseFloat(acc.toFixed(2))));
}

/**
 * Standard WPM = (correct characters / 5) / elapsed minutes
 * Clamped to 0 at start (< 0.5s) to avoid NaN / Infinity
 */
export function calculateWpm(correctChars: number, elapsedSeconds: number): number {
  if (!isFinite(elapsedSeconds) || elapsedSeconds < 0.5) return 0;
  const minutes = elapsedSeconds / 60;
  const wpm = (correctChars / 5) / minutes;
  return Math.max(0, Math.round(wpm));
}

/**
 * Raw WPM = (total attempted keystrokes / 5) / elapsed minutes
 */
export function calculateRawWpm(totalKeystrokes: number, elapsedSeconds: number): number {
  if (!isFinite(elapsedSeconds) || elapsedSeconds < 0.5) return 0;
  const minutes = elapsedSeconds / 60;
  const raw = (totalKeystrokes / 5) / minutes;
  return Math.max(0, Math.round(raw));
}

/**
 * Net WPM = Raw WPM - (uncorrected errors / elapsed minutes)
 */
export function calculateNetWpm(rawWpm: number, uncorrectedErrors: number, elapsedSeconds: number): number {
  if (!isFinite(elapsedSeconds) || elapsedSeconds < 0.5) return 0;
  const minutes = elapsedSeconds / 60;
  const penalty = uncorrectedErrors / minutes;
  return Math.max(0, Math.round(rawWpm - penalty));
}

/**
 * Formats seconds into mm:ss with zero-padding and finite clamping.
 */
export function formatTimerDisplay(seconds: number): string {
  if (!isFinite(seconds) || isNaN(seconds) || seconds < 0) return '00:00';
  const s = Math.floor(seconds);
  const mins = Math.floor(s / 60);
  const secs = s % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Starts the typing session if it is idle.
 */
export function startSession(session: TypingSession, now: number = performance.now()): void {
  if (session.status !== 'idle' && session.status !== 'countdown') return;
  session.status = 'running';
  session.startTime = now;
  session.pauseTime = null;
  session.accumulatedPauseMs = 0;
  session.elapsedMs = 0;
  if (session.duration > 0) {
    session.remainingMs = session.duration * 1000;
  }
}

/**
 * Pauses the active typing session.
 */
export function pauseSession(session: TypingSession, now: number = performance.now()): void {
  if (session.status !== 'running') return;
  session.status = 'paused';
  session.pauseTime = now;
}

/**
 * Resumes a paused typing session.
 */
export function resumeSession(session: TypingSession, now: number = performance.now()): void {
  if (session.status !== 'paused') return;
  if (session.pauseTime !== null) {
    session.accumulatedPauseMs += (now - session.pauseTime);
    session.pauseTime = null;
  }
  session.status = 'running';
}

/**
 * Updates the session timer using timestamps and checks for expiration.
 */
export function updateSessionTimer(session: TypingSession, now: number = performance.now()): boolean {
  if (session.status !== 'running' || session.startTime === null) return false;

  const currentElapsed = now - session.startTime - session.accumulatedPauseMs;
  session.elapsedMs = Math.max(0, currentElapsed);

  if (session.duration > 0) {
    const totalDurationMs = session.duration * 1000;
    if (session.elapsedMs >= totalDurationMs) {
      session.elapsedMs = totalDurationMs;
      session.remainingMs = 0;
      session.status = 'expired';
      session.endTime = now;
      finalizeSessionMetrics(session);
      return true; // Session completed on time boundary
    } else {
      session.remainingMs = totalDurationMs - session.elapsedMs;
    }
  }

  // Update live metrics
  const elapsedSec = session.elapsedMs / 1000;
  session.wpm = calculateWpm(session.correctCharacters, elapsedSec);
  session.rawWpm = calculateRawWpm(session.totalCharactersAttempted, elapsedSec);
  session.accuracy = calculateAccuracy(session.correctKeystrokes, session.incorrectKeystrokes);

  return false;
}

/**
 * Process a physical keystroke against the canonical session.
 */
export function processKeystroke(
  session: TypingSession,
  key: string,
  now: number = performance.now(),
  options: { stopOnError?: boolean; disableBackspace?: boolean } = {}
): { accepted: boolean; isCorrect?: boolean; finished: boolean } {
  if (session.status === 'completed' || session.status === 'expired') {
    return { accepted: false, finished: true };
  }

  // Auto-start on first typing keystroke if idle
  if (session.status === 'idle') {
    startSession(session, now);
  }

  if (session.status !== 'running') {
    return { accepted: false, finished: false };
  }

  const lastStroke = session.history[session.history.length - 1];
  const latencyMs = lastStroke ? Math.max(1, Math.min(2000, Math.round(now - lastStroke.timestamp))) : 50;

  const activeWord = session.targetWords[session.currentWordIndex] || '';

  // 1. Backspace handling
  if (key === 'Backspace') {
    if (options.disableBackspace) {
      return { accepted: false, finished: false };
    }

    session.backspaces += 1;

    if (session.currentInput.length > 0) {
      session.currentInput = session.currentInput.slice(0, -1);
      session.currentIndex = Math.max(0, session.currentIndex - 1);
    } else if (session.currentWordIndex > 0) {
      // Revert to previous word
      const prevWord = session.wordHistory[session.currentWordIndex - 1] || '';
      session.wordHistory = session.wordHistory.slice(0, -1);
      session.currentWordIndex -= 1;
      session.currentInput = prevWord;
      session.currentIndex = Math.max(0, session.currentIndex - 1);
    }

    return { accepted: true, finished: false };
  }

  // 2. Space key handling (advance word)
  if (key === ' ') {
    if (session.currentInput.length === 0) {
      return { accepted: false, finished: false };
    }

    // Stop on error check
    if (options.stopOnError && session.currentInput !== activeWord) {
      return { accepted: false, finished: false };
    }

    const isMatch = session.currentInput === activeWord;
    session.totalKeystrokes += 1;
    session.totalCharactersAttempted += 1;

    if (isMatch) {
      session.correctKeystrokes += 1;
      session.correctCharacters += 1; // space counts
      session.correctByKey[' '] = (session.correctByKey[' '] || 0) + 1;
    } else {
      session.incorrectKeystrokes += 1;
      session.incorrectCharacters += 1;
      session.errorsByKey[' '] = (session.errorsByKey[' '] || 0) + 1;
      session.errors.push({
        expected: ' ',
        actual: key,
        index: session.currentIndex,
        timestamp: now
      });
    }

    session.history.push({
      key: ' ',
      expected: ' ',
      timestamp: now,
      isCorrect: isMatch,
      latencyMs
    });

    session.wordHistory.push(session.currentInput);
    session.currentInput = '';
    session.currentWordIndex += 1;
    session.currentIndex += 1;
    session.accuracy = calculateAccuracy(session.correctKeystrokes, session.incorrectKeystrokes);

    // Check if test completed by words
    const isFinished = session.currentWordIndex >= session.targetWords.length;
    if (isFinished) {
      finishTypingSession(session, now);
      return { accepted: true, isCorrect: isMatch, finished: true };
    }

    return { accepted: true, isCorrect: isMatch, finished: false };
  }

  // 3. Normal printable single character
  if (key.length === 1) {
    const charIndex = session.currentInput.length;
    const expectedChar = activeWord[charIndex] || '';
    const isCorrect = key === expectedChar;

    session.totalKeystrokes += 1;
    session.totalCharactersAttempted += 1;

    if (isCorrect) {
      session.correctKeystrokes += 1;
      session.correctCharacters += 1;
      session.correctByKey[expectedChar] = (session.correctByKey[expectedChar] || 0) + 1;
    } else {
      session.incorrectKeystrokes += 1;
      session.incorrectCharacters += 1;
      const errorKey = expectedChar || 'extra';
      session.errorsByKey[errorKey] = (session.errorsByKey[errorKey] || 0) + 1;
      session.errors.push({
        expected: expectedChar,
        actual: key,
        index: session.currentIndex,
        timestamp: now
      });

      if (options.stopOnError) {
        session.history.push({
          key,
          expected: expectedChar,
          timestamp: now,
          isCorrect: false,
          latencyMs
        });
        return { accepted: false, isCorrect: false, finished: false };
      }
    }

    session.history.push({
      key,
      expected: expectedChar || 'extra',
      timestamp: now,
      isCorrect,
      latencyMs
    });

    session.currentInput += key;
    session.currentIndex += 1;
    session.accuracy = calculateAccuracy(session.correctKeystrokes, session.incorrectKeystrokes);

    // Check if last word finished
    if (
      session.currentWordIndex === session.targetWords.length - 1 &&
      session.currentInput === activeWord
    ) {
      finishTypingSession(session, now);
      return { accepted: true, isCorrect, finished: true };
    }

    return { accepted: true, isCorrect, finished: false };
  }

  return { accepted: false, finished: false };
}

/**
 * Finalize typing session, freeze metrics and set final status.
 */
export function finishTypingSession(session: TypingSession, now: number = performance.now()): void {
  if (session.status === 'completed' || session.status === 'expired') return;

  session.status = 'completed';
  session.endTime = now;

  if (session.startTime !== null) {
    const rawElapsed = (now - session.startTime - session.accumulatedPauseMs) / 1000;
    if (session.duration > 0) {
      session.elapsedMs = Math.min(session.duration * 1000, Math.max(500, rawElapsed * 1000));
      session.remainingMs = 0;
    } else {
      session.elapsedMs = Math.max(500, rawElapsed * 1000);
      session.remainingMs = 0;
    }
  }

  finalizeSessionMetrics(session);
}

function finalizeSessionMetrics(session: TypingSession): void {
  const elapsedSec = Math.max(0.5, session.elapsedMs / 1000);
  session.wpm = calculateWpm(session.correctCharacters, elapsedSec);
  session.rawWpm = calculateRawWpm(session.totalCharactersAttempted, elapsedSec);
  session.accuracy = calculateAccuracy(session.correctKeystrokes, session.incorrectKeystrokes);
}

/**
 * Computes per-key accuracy breakdown from session.
 */
export function getSessionKeyAnalytics(session: TypingSession): Record<string, KeyStats> {
  const allKeys = new Set([
    ...Object.keys(session.correctByKey),
    ...Object.keys(session.errorsByKey)
  ]);

  const result: Record<string, KeyStats> = {};
  allKeys.forEach((k) => {
    const correct = session.correctByKey[k] || 0;
    const incorrect = session.errorsByKey[k] || 0;
    const total = correct + incorrect;
    result[k] = {
      correct,
      incorrect,
      accuracy: total > 0 ? parseFloat(((correct / total) * 100).toFixed(1)) : 100
    };
  });

  return result;
}
