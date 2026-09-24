import { useState, useEffect, useRef, useCallback } from 'react';
import type { SubLesson, SubLessonProgress, UserSettings } from '../types';
import {
  calculateWpm,
  calculateRawWpm,
  calculateAccuracy,
  calculateConsistency
} from '../lib/metrics';
import { soundEngine } from '../lib/audio';
import { storage } from '../lib/storage';

export interface UseLearnEngineProps {
  subLesson: SubLesson;
  settings: UserSettings;
  onComplete?: (progress: SubLessonProgress, passed: boolean) => void;
}

export type LearnSessionStatus = 'ready' | 'countdown' | 'typing' | 'paused' | 'finished';

export interface PerKeyDetail {
  key: string;
  correct: number;
  incorrect: number;
  accuracy: number;
}

export function useLearnEngine({ subLesson, settings, onComplete }: UseLearnEngineProps) {
  const [status, setStatus] = useState<LearnSessionStatus>('ready');
  const [countdown, setCountdown] = useState<number>(3);

  // Text breakdown
  const [exerciseText, setExerciseText] = useState(subLesson.exerciseText);
  const wordsRef = useRef<string[]>([]);
  wordsRef.current = exerciseText.split(' ');

  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentInput, setCurrentInput] = useState('');
  const [wordHistory, setWordHistory] = useState<string[]>([]);

  // Time & Timer tracking
  const targetDuration = subLesson.durationSeconds || 90;
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(targetDuration);

  const startTimeRef = useRef<number | null>(null);
  const pauseTimeRef = useRef<number | null>(null);
  const accumulatedPauseMsRef = useRef<number>(0);
  const timerIntervalRef = useRef<number | null>(null);
  const resultSavedRef = useRef(false);

  // Keystrokes & Performance Tracking
  const keystrokesRef = useRef<{ key: string; expected: string; timestamp: number; isCorrect: boolean; latencyMs: number }[]>([]);
  const lastKeyTimeRef = useRef<number | null>(null);
  const backspaceCountRef = useRef(0);

  // Per-Key tracking map
  const perKeyMapRef = useRef<Record<string, { correct: number; incorrect: number }>>({});

  // Reset/sync when sublesson changes
  useEffect(() => {
    setExerciseText(subLesson.exerciseText);
    wordsRef.current = subLesson.exerciseText.split(' ');
    resetSession();
  }, [subLesson]);

  const resetSession = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    setStatus('ready');
    setCountdown(3);
    setCurrentWordIndex(0);
    setCurrentInput('');
    setWordHistory([]);
    setElapsedSeconds(0);
    setRemainingSeconds(targetDuration);
    startTimeRef.current = null;
    pauseTimeRef.current = null;
    accumulatedPauseMsRef.current = 0;
    keystrokesRef.current = [];
    lastKeyTimeRef.current = null;
    backspaceCountRef.current = 0;
    perKeyMapRef.current = {};
    resultSavedRef.current = false;
  }, [targetDuration]);

  // Compute live character stats
  const getCharacterStats = useCallback(() => {
    let correct = 0;
    let incorrect = 0;
    let extra = 0;
    let missed = 0;

    wordHistory.forEach((typed, idx) => {
      const expected = wordsRef.current[idx] || '';
      for (let i = 0; i < Math.max(typed.length, expected.length); i++) {
        if (i < typed.length && i < expected.length) {
          if (typed[i] === expected[i]) correct++;
          else incorrect++;
        } else if (i >= expected.length) {
          extra++;
        } else {
          missed++;
        }
      }
      correct++; // Spacebar between words
    });

    const activeExpected = wordsRef.current[currentWordIndex] || '';
    for (let i = 0; i < currentInput.length; i++) {
      if (i < activeExpected.length) {
        if (currentInput[i] === activeExpected[i]) correct++;
        else incorrect++;
      } else {
        extra++;
      }
    }

    return { correct, incorrect, extra, missed };
  }, [currentInput, currentWordIndex, wordHistory]);

  const stats = getCharacterStats();
  const currentDuration = startTimeRef.current
    ? Math.max(0.5, (performance.now() - startTimeRef.current - accumulatedPauseMsRef.current) / 1000)
    : Math.max(1, elapsedSeconds);

  const liveWpm = calculateWpm(stats.correct, currentDuration);
  const liveRawWpm = calculateRawWpm(stats.correct + stats.incorrect + stats.extra, currentDuration);
  const liveAccuracy = calculateAccuracy(stats);
  const liveErrors = stats.incorrect + stats.extra;

  // Active expected character and next expected character
  const currentExpectedWord = wordsRef.current[currentWordIndex] || '';
  let activeChar = '';
  let nextChar = '';

  if (currentInput.length < currentExpectedWord.length) {
    activeChar = currentExpectedWord[currentInput.length];
    if (currentInput.length + 1 < currentExpectedWord.length) {
      nextChar = currentExpectedWord[currentInput.length + 1];
    } else {
      nextChar = ' ';
    }
  } else {
    // Current word typed, space is next
    activeChar = ' ';
    const nextWord = wordsRef.current[currentWordIndex + 1];
    nextChar = nextWord ? nextWord[0] : '';
  }

  // Finalize test and compute full result
  const finishSession = useCallback((finalDurationOverride?: number) => {
    if (resultSavedRef.current) return;
    resultSavedRef.current = true;

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    setStatus('finished');

    let finalDuration: number;
    if (finalDurationOverride !== undefined) {
      finalDuration = finalDurationOverride;
    } else if (startTimeRef.current) {
      const raw = (performance.now() - startTimeRef.current - accumulatedPauseMsRef.current) / 1000;
      finalDuration = Math.max(1, Math.min(targetDuration, Math.round(raw)));
    } else {
      finalDuration = Math.max(1, elapsedSeconds);
    }

    setElapsedSeconds(finalDuration);
    setRemainingSeconds(0);

    const finalStats = getCharacterStats();
    const finalWpm = calculateWpm(finalStats.correct, finalDuration);
    const finalAccuracy = calculateAccuracy(finalStats);
    const finalConsistency = calculateConsistency(keystrokesRef.current);

    const passed =
      finalWpm >= (subLesson.minWpm || 10) &&
      finalAccuracy >= (subLesson.minAccuracy || 90);

    const progress: SubLessonProgress = {
      subLessonId: subLesson.id,
      lessonId: subLesson.lessonId,
      completed: passed,
      bestWpm: finalWpm,
      bestAccuracy: finalAccuracy,
      bestConsistency: finalConsistency,
      lowestErrors: finalStats.incorrect + finalStats.extra,
      attempts: 1,
      totalTimeSpent: finalDuration,
      keyStats: { ...perKeyMapRef.current },
      timestamp: Date.now()
    };

    // Save sublesson progress locally
    storage.saveSubLessonProgress(progress);

    if (passed) {
      soundEngine.playSuccessChime();
    }

    onComplete?.(progress, passed);
  }, [
    elapsedSeconds,
    getCharacterStats,
    subLesson,
    targetDuration,
    onComplete
  ]);

  // Interval timer with timestamp drift compensation
  useEffect(() => {
    if (status !== 'typing') return;

    timerIntervalRef.current = window.setInterval(() => {
      if (!startTimeRef.current) return;
      const elapsedMs = performance.now() - startTimeRef.current - accumulatedPauseMsRef.current;
      const exactSeconds = Math.max(0, elapsedMs / 1000);
      const roundedElapsed = Math.floor(exactSeconds);

      setElapsedSeconds(roundedElapsed);
      const rem = Math.max(0, targetDuration - roundedElapsed);
      setRemainingSeconds(rem);

      if (rem <= 0) {
        finishSession(targetDuration);
      }
    }, 100);

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    };
  }, [status, targetDuration, finishSession]);

  // Countdown timer sequence
  useEffect(() => {
    if (status !== 'countdown') return;

    if (countdown > 0) {
      const timer = setTimeout(() => {
        soundEngine.playKeystroke('clicky');
        setCountdown((c) => c - 1);
      }, 750);
      return () => clearTimeout(timer);
    } else {
      // Countdown finished -> Start typing!
      setStatus('typing');
      startTimeRef.current = performance.now();
      lastKeyTimeRef.current = performance.now();
      soundEngine.playButtonClick();
    }
  }, [status, countdown]);

  // Public methods to control session
  const startSession = useCallback(() => {
    if (settings.reducedMotion) {
      // Skip countdown for reduced motion
      setStatus('typing');
      startTimeRef.current = performance.now();
      lastKeyTimeRef.current = performance.now();
      soundEngine.playButtonClick();
    } else {
      setStatus('countdown');
      setCountdown(3);
    }
  }, [settings.reducedMotion]);

  const pauseSession = useCallback(() => {
    if (status !== 'typing') return;
    setStatus('paused');
    pauseTimeRef.current = performance.now();
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  }, [status]);

  const resumeSession = useCallback(() => {
    if (status !== 'paused') return;
    if (pauseTimeRef.current) {
      accumulatedPauseMsRef.current += performance.now() - pauseTimeRef.current;
      pauseTimeRef.current = null;
    }
    setStatus('typing');
    lastKeyTimeRef.current = performance.now();
  }, [status]);

  // Handle key input
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (status !== 'typing') {
      if (status === 'ready' && (e.key === ' ' || e.key === 'Enter')) {
        startSession();
      }
      return;
    }

    if (e.key === 'Tab' || e.key === 'Escape') {
      e.preventDefault();
      return;
    }

    const now = performance.now();
    const latency = lastKeyTimeRef.current ? Math.min(2000, now - lastKeyTimeRef.current) : 120;
    lastKeyTimeRef.current = now;

    // Handle Backspace
    if (e.key === 'Backspace') {
      e.preventDefault();
      backspaceCountRef.current++;
      soundEngine.playKeystroke('tactile');

      if (currentInput.length > 0) {
        setCurrentInput((prev) => prev.slice(0, -1));
      } else if (currentWordIndex > 0) {
        const prevWord = wordHistory[currentWordIndex - 1];
        setWordHistory((prev) => prev.slice(0, -1));
        setCurrentWordIndex((idx) => idx - 1);
        setCurrentInput(prevWord);
      }
      return;
    }

    // Ignore non-printable modifier keys
    if (e.key.length > 1) return;

    e.preventDefault();
    const charTyped = e.key;

    // Check against expected character
    const expectedWord = wordsRef.current[currentWordIndex] || '';

    // Handle Space (completes current word)
    if (charTyped === ' ') {
      if (currentInput.length === 0) return; // Prevent double spaces

      const isWordCorrect = currentInput === expectedWord;
      const isSpaceExpected = currentInput.length >= expectedWord.length;

      // Track space key stat
      if (!perKeyMapRef.current[' ']) {
        perKeyMapRef.current[' '] = { correct: 0, incorrect: 0 };
      }
      if (isSpaceExpected) {
        perKeyMapRef.current[' '].correct++;
      } else {
        perKeyMapRef.current[' '].incorrect++;
      }

      keystrokesRef.current.push({
        key: ' ',
        expected: ' ',
        timestamp: Date.now(),
        isCorrect: isSpaceExpected,
        latencyMs: latency
      });

      if (isWordCorrect) {
        soundEngine.playKeystroke(settings.soundProfile);
      } else {
        soundEngine.playErrorSound();
      }

      setWordHistory((prev) => [...prev, currentInput]);
      setCurrentInput('');

      // Check if this was the last word
      if (currentWordIndex + 1 >= wordsRef.current.length) {
        finishSession();
      } else {
        setCurrentWordIndex((idx) => idx + 1);
      }
      return;
    }

    // Normal character typing
    const expectedChar = expectedWord[currentInput.length] || '';
    const isCharCorrect = charTyped === expectedChar;

    // Record per-key statistics
    const keyKey = (expectedChar || charTyped).toLowerCase();
    if (!perKeyMapRef.current[keyKey]) {
      perKeyMapRef.current[keyKey] = { correct: 0, incorrect: 0 };
    }
    if (isCharCorrect) {
      perKeyMapRef.current[keyKey].correct++;
      soundEngine.playKeystroke(settings.soundProfile);
    } else {
      perKeyMapRef.current[keyKey].incorrect++;
      soundEngine.playErrorSound();
    }

    keystrokesRef.current.push({
      key: charTyped,
      expected: expectedChar,
      timestamp: Date.now(),
      isCorrect: isCharCorrect,
      latencyMs: latency
    });

    const nextInput = currentInput + charTyped;
    setCurrentInput(nextInput);

    // If finished typing entire text without a trailing space on final word
    if (
      currentWordIndex === wordsRef.current.length - 1 &&
      nextInput.length >= expectedWord.length &&
      nextInput === expectedWord
    ) {
      setWordHistory((prev) => [...prev, nextInput]);
      finishSession();
    }
  }, [
    status,
    currentInput,
    currentWordIndex,
    wordHistory,
    settings.soundProfile,
    startSession,
    finishSession
  ]);

  // Format per-key breakdown for results display
  const getPerKeyAnalysis = useCallback((): PerKeyDetail[] => {
    return Object.entries(perKeyMapRef.current).map(([key, item]) => {
      const total = item.correct + item.incorrect;
      const accuracy = total > 0 ? Math.round((item.correct / total) * 100) : 100;
      return {
        key: key === ' ' ? 'Space' : key,
        correct: item.correct,
        incorrect: item.incorrect,
        accuracy
      };
    }).sort((a, b) => a.accuracy - b.accuracy);
  }, []);

  return {
    status,
    countdown,
    words: wordsRef.current,
    currentWordIndex,
    currentInput,
    wordHistory,
    activeChar,
    nextChar,
    elapsedSeconds,
    remainingSeconds,
    targetDuration,
    liveWpm,
    liveRawWpm,
    liveAccuracy,
    liveErrors,
    backspaceCount: backspaceCountRef.current,
    startSession,
    pauseSession,
    resumeSession,
    resetSession,
    handleKeyDown,
    finishSession,
    getPerKeyAnalysis
  };
}
