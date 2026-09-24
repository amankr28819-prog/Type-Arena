import { useState, useEffect, useRef, useCallback } from 'react';
import type {
  TestMode,
  TimeOption,
  WordOption,
  TestResult,
  KeystrokeEvent,
  UserSettings
} from '../types';
import {
  calculateWpm,
  calculateRawWpm,
  calculateNetWpm,
  calculateAccuracy,
  calculateConsistency,
  calculateBurstSpeed
} from '../lib/metrics';
import { soundEngine } from '../lib/audio';
import { storage } from '../lib/storage';

interface UseTypingEngineProps {
  initialText: string;
  mode: TestMode;
  timeOption: TimeOption;
  customTime: number;
  wordOption: WordOption;
  customWords: number;
  settings: UserSettings;
  onTestComplete?: (result: TestResult) => void;
}

export function useTypingEngine({
  initialText,
  mode,
  timeOption,
  customTime,
  wordOption,
  customWords,
  settings,
  onTestComplete
}: UseTypingEngineProps) {
  const [text, setText] = useState(initialText);
  const words = useRef<string[]>([]);
  words.current = text.split(' ');

  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentInput, setCurrentInput] = useState('');
  const [wordHistory, setWordHistory] = useState<string[]>([]);

  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isFailed, setIsFailed] = useState(false);
  const [failReason, setFailReason] = useState('');

  // Target duration in seconds for time mode
  const targetDuration = mode === 'time'
    ? (timeOption === 'custom' ? (customTime || 45) : (timeOption || 30))
    : 0;

  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(
    mode === 'time' ? targetDuration : null
  );

  // Cumulative Canonical Keystroke and Error Tracking
  const correctKeystrokesRef = useRef<number>(0);
  const incorrectKeystrokesRef = useRef<number>(0);
  const backspaceCountRef = useRef<number>(0);
  const errorHistoryRef = useRef<{ expected: string; actual: string; index: number; timestamp: number }[]>([]);
  const correctByKeyRef = useRef<Record<string, number>>({});
  const errorsByKeyRef = useRef<Record<string, number>>({});

  // Precision Timestamp Timer References
  const startTimeRef = useRef<number | null>(null);
  const pausedTimeRef = useRef<number | null>(null);
  const accumulatedPauseMsRef = useRef<number>(0);
  const lastKeyTimeRef = useRef<number | null>(null);
  const keystrokesRef = useRef<KeystrokeEvent[]>([]);
  const timelineRef = useRef<{ time: number; wpm: number; rawWpm: number; errors: number }[]>([]);
  const timerIntervalRef = useRef<number | null>(null);
  const resultSavedRef = useRef(false);

  // Reset test state completely
  const resetTest = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    setIsActive(false);
    setIsPaused(false);
    setIsFinished(false);
    setIsFailed(false);
    setFailReason('');
    setCurrentWordIndex(0);
    setCurrentInput('');
    setWordHistory([]);
    setElapsedSeconds(0);
    const dur = mode === 'time'
      ? (timeOption === 'custom' ? (customTime || 45) : (timeOption || 30))
      : null;
    setRemainingSeconds(dur);

    // Reset precision metrics
    startTimeRef.current = null;
    pausedTimeRef.current = null;
    accumulatedPauseMsRef.current = 0;
    lastKeyTimeRef.current = null;
    correctKeystrokesRef.current = 0;
    incorrectKeystrokesRef.current = 0;
    backspaceCountRef.current = 0;
    errorHistoryRef.current = [];
    correctByKeyRef.current = {};
    errorsByKeyRef.current = {};
    keystrokesRef.current = [];
    timelineRef.current = [];
    resultSavedRef.current = false;
  }, [mode, timeOption, customTime]);

  // Sync text when initialText changes
  useEffect(() => {
    setText(initialText);
    resetTest();
  }, [initialText, resetTest]);

  // Pause and Resume session controls
  const pauseTest = useCallback(() => {
    if (!isActive || isFinished || isPaused) return;
    setIsPaused(true);
    pausedTimeRef.current = performance.now();
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  }, [isActive, isFinished, isPaused]);

  const resumeTest = useCallback(() => {
    if (!isPaused || isFinished) return;
    if (pausedTimeRef.current !== null) {
      accumulatedPauseMsRef.current += (performance.now() - pausedTimeRef.current);
      pausedTimeRef.current = null;
    }
    setIsPaused(false);
    lastKeyTimeRef.current = performance.now();
  }, [isPaused, isFinished]);

  // Live accurate metrics derived from canonical keystroke history
  const currentDurationForWpm = startTimeRef.current
    ? Math.max(0.5, (performance.now() - startTimeRef.current - accumulatedPauseMsRef.current) / 1000)
    : Math.max(1, elapsedSeconds);

  const currentWpm = calculateWpm(correctKeystrokesRef.current, currentDurationForWpm);
  const currentRawWpm = calculateRawWpm(
    correctKeystrokesRef.current + incorrectKeystrokesRef.current,
    currentDurationForWpm
  );
  const currentAccuracy = calculateAccuracy(
    correctKeystrokesRef.current,
    incorrectKeystrokesRef.current
  );
  const currentErrors = incorrectKeystrokesRef.current;

  // Finalize test and compute full result
  const finishTest = useCallback((finalDurationOverride?: number) => {
    if (resultSavedRef.current) return;
    resultSavedRef.current = true;

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    setIsActive(false);
    setIsPaused(false);
    setIsFinished(true);

    let actualDuration: number;
    if (finalDurationOverride !== undefined) {
      actualDuration = finalDurationOverride;
    } else if (startTimeRef.current) {
      const raw = (performance.now() - startTimeRef.current - accumulatedPauseMsRef.current) / 1000;
      if (mode === 'time' && targetDuration > 0) {
        actualDuration = Math.min(targetDuration, Math.max(1, Math.round(raw)));
      } else {
        actualDuration = Math.max(1, Math.round(raw));
      }
    } else {
      actualDuration = Math.max(1, elapsedSeconds);
    }

    setElapsedSeconds(actualDuration);
    if (mode === 'time' && targetDuration > 0) {
      setRemainingSeconds(0);
    }

    const finalCorrect = correctKeystrokesRef.current;
    const finalIncorrect = incorrectKeystrokesRef.current;
    const finalTotalAttempted = finalCorrect + finalIncorrect;

    const finalWpm = calculateWpm(finalCorrect, actualDuration);
    const finalRaw = calculateRawWpm(finalTotalAttempted, actualDuration);
    const finalNet = calculateNetWpm(finalRaw, finalIncorrect, actualDuration);
    const finalAccuracy = calculateAccuracy(finalCorrect, finalIncorrect);
    const finalConsistency = calculateConsistency(keystrokesRef.current);

    // Identify unique mistyped keys from canonical error history
    const mistakeKeys = Array.from(
      new Set(
        errorHistoryRef.current
          .map((e) => e.expected.toLowerCase())
          .filter((k) => k && k !== ' ')
      )
    );

    // Identify mistyped words
    const mistypedWords: string[] = [];
    wordHistory.forEach((typed, idx) => {
      const exp = words.current[idx];
      if (typed !== exp) mistypedWords.push(exp);
    });

    const finalBurst = calculateBurstSpeed(keystrokesRef.current);

    const characterStats = {
      correct: finalCorrect,
      incorrect: finalIncorrect,
      extra: 0,
      missed: 0
    };

    const result: TestResult = {
      id: `test_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: Date.now(),
      mode,
      duration: actualDuration,
      wordCount: currentWordIndex + (currentInput.length > 0 ? 1 : 0),
      wpm: finalWpm,
      rawWpm: finalRaw,
      netWpm: finalNet,
      burstWpm: finalBurst,
      accuracy: finalAccuracy,
      consistency: finalConsistency,
      characterStats,
      backspaceCount: backspaceCountRef.current,
      mistakes: mistakeKeys,
      mistypedWords,
      keystrokes: keystrokesRef.current,
      timeline: timelineRef.current.length > 0 ? timelineRef.current : [
        { time: actualDuration, wpm: finalWpm, rawWpm: finalRaw, errors: finalIncorrect }
      ],
      difficulty: settings.difficulty,
      language: settings.language
    };

    storage.saveTestResult(result);
    soundEngine.playSuccessChime();

    if (onTestComplete) {
      onTestComplete(result);
    }
  }, [
    elapsedSeconds,
    mode,
    targetDuration,
    currentWordIndex,
    currentInput,
    settings.difficulty,
    settings.language,
    wordHistory,
    onTestComplete
  ]);

  // Interval timer for live updates with timestamp drift compensation and boundary protection
  useEffect(() => {
    if (!isActive || isFinished || isPaused) return;

    let lastRecordedSec = 0;

    const handleVisibilityChange = () => {
      if (document.hidden) return;
      if (!startTimeRef.current || !isActive || isFinished || isPaused) return;
      const exactElapsed = (performance.now() - startTimeRef.current - accumulatedPauseMsRef.current) / 1000;
      if (mode === 'time' && targetDuration > 0 && exactElapsed >= targetDuration) {
        finishTest(targetDuration);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    timerIntervalRef.current = window.setInterval(() => {
      if (!startTimeRef.current || isPaused) return;
      const exactElapsed = (performance.now() - startTimeRef.current - accumulatedPauseMsRef.current) / 1000;
      const wholeElapsed = Math.floor(exactElapsed);

      setElapsedSeconds(wholeElapsed);

      // Record live sample in timeline once per whole second
      if (wholeElapsed > lastRecordedSec) {
        lastRecordedSec = wholeElapsed;
        const liveW = calculateWpm(correctKeystrokesRef.current, Math.max(1, wholeElapsed));
        const liveRaw = calculateRawWpm(
          correctKeystrokesRef.current + incorrectKeystrokesRef.current,
          Math.max(1, wholeElapsed)
        );
        timelineRef.current.push({
          time: wholeElapsed,
          wpm: liveW,
          rawWpm: liveRaw,
          errors: incorrectKeystrokesRef.current
        });
      }

      // Time Mode countdown rule: automatically ends at strict boundary
      if (mode === 'time' && targetDuration > 0) {
        if (exactElapsed >= targetDuration) {
          finishTest(targetDuration);
          return;
        }
        const rem = Math.max(0, targetDuration - exactElapsed);
        setRemainingSeconds(Math.ceil(rem));
      }
    }, 50);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    };
  }, [isActive, isFinished, isPaused, mode, targetDuration, finishTest]);

  // Keydown processor
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent | KeyboardEvent) => {
      if (isFinished || isFailed || isPaused) return;

      const key = e.key;

      // Prevent browser focus shift for Tab and Escape
      if (key === 'Tab' || key === 'Escape') {
        e.preventDefault();
        return;
      }

      // Ignore modifier and function keys alone
      if (
        key === 'Shift' ||
        key === 'Control' ||
        key === 'Alt' ||
        key === 'Meta' ||
        key === 'CapsLock' ||
        (key.startsWith('F') && key.length > 1)
      ) {
        return;
      }

      const now = performance.now();
      const latency = lastKeyTimeRef.current ? Math.round(now - lastKeyTimeRef.current) : 0;
      lastKeyTimeRef.current = now;

      // Start timer on first typing keystroke using performance.now()
      if (!isActive) {
        setIsActive(true);
        startTimeRef.current = performance.now();
        accumulatedPauseMsRef.current = 0;
      }

      const activeWord = words.current[currentWordIndex] || '';

      // Backspace handling
      if (key === 'Backspace') {
        e.preventDefault();

        if (settings.disableBackspace) {
          return;
        }

        // Backspace tracks separately; NEVER removes past error from incorrectKeystrokesRef!
        backspaceCountRef.current += 1;

        if (currentInput.length > 0) {
          setCurrentInput((prev) => prev.slice(0, -1));
        } else if (
          currentWordIndex > 0 &&
          (settings.difficulty === 'easy' || settings.difficulty === 'normal')
        ) {
          // Move back to previous word
          const prevWord = wordHistory[currentWordIndex - 1] || '';
          setWordHistory((prev) => prev.slice(0, -1));
          setCurrentWordIndex((prev) => prev - 1);
          setCurrentInput(prevWord);
        }
        return;
      }

      // Space key handling (finish word and advance)
      if (key === ' ') {
        e.preventDefault();

        // Prevent skipping without typing anything
        if (currentInput.length === 0) return;

        // Stop on Error / Expert mode: cannot advance word if there are uncorrected errors
        if (
          (settings.stopOnError || settings.difficulty === 'expert') &&
          currentInput !== activeWord
        ) {
          soundEngine.playErrorSound();
          return;
        }

        const isMatch = currentInput === activeWord;

        if (isMatch) {
          correctKeystrokesRef.current += 1;
          correctByKeyRef.current[' '] = (correctByKeyRef.current[' '] || 0) + 1;
          soundEngine.playKeystroke(settings.soundProfile);
        } else {
          incorrectKeystrokesRef.current += 1;
          errorsByKeyRef.current[' '] = (errorsByKeyRef.current[' '] || 0) + 1;
          errorHistoryRef.current.push({
            expected: ' ',
            actual: ' ',
            index: currentWordIndex,
            timestamp: now
          });
          if (settings.playErrorSound) {
            soundEngine.playErrorSound();
          } else {
            soundEngine.playKeystroke(settings.soundProfile);
          }
        }

        keystrokesRef.current.push({
          key: ' ',
          expected: ' ',
          timestamp: now,
          isCorrect: isMatch,
          latencyMs: latency
        });

        const nextHistory = [...wordHistory, currentInput];
        setWordHistory(nextHistory);
        setCurrentInput('');
        const nextIndex = currentWordIndex + 1;
        setCurrentWordIndex(nextIndex);

        // Word count completion check
        const targetWordsCount =
          wordOption === 'custom' ? (customWords || 37) : wordOption;

        if (mode === 'words' && nextIndex >= targetWordsCount) {
          finishTest();
        } else if (nextIndex >= words.current.length) {
          finishTest();
        }
        return;
      }

      // Printable single character handling
      if (key.length === 1) {
        e.preventDefault();

        const charIndex = currentInput.length;
        const expectedChar = activeWord[charIndex] || '';
        const isCorrect = key === expectedChar;

        // Sound feedback
        if (isCorrect) {
          soundEngine.playKeystroke(settings.soundProfile);
          correctKeystrokesRef.current += 1;
          correctByKeyRef.current[expectedChar] = (correctByKeyRef.current[expectedChar] || 0) + 1;
        } else {
          incorrectKeystrokesRef.current += 1;
          const errorKey = expectedChar || 'extra';
          errorsByKeyRef.current[errorKey] = (errorsByKeyRef.current[errorKey] || 0) + 1;
          errorHistoryRef.current.push({
            expected: expectedChar,
            actual: key,
            index: charIndex,
            timestamp: now
          });

          if (settings.playErrorSound) {
            soundEngine.playErrorSound();
          } else {
            soundEngine.playKeystroke(settings.soundProfile);
          }
        }

        // Master difficulty: instant failure on first mistake
        if (settings.difficulty === 'master' && !isCorrect) {
          setIsFailed(true);
          setFailReason('Master Difficulty: Test terminated due to error.');
          soundEngine.playErrorSound();
          return;
        }

        // Stop on error: prevent typing incorrect char
        if (
          (settings.stopOnError || settings.difficulty === 'expert') &&
          !isCorrect
        ) {
          keystrokesRef.current.push({
            key,
            expected: expectedChar,
            timestamp: now,
            isCorrect: false,
            latencyMs: latency
          });
          return;
        }

        // Record keystroke event
        keystrokesRef.current.push({
          key,
          expected: expectedChar || 'extra',
          timestamp: now,
          isCorrect,
          latencyMs: latency
        });

        const nextInput = currentInput + key;
        setCurrentInput(nextInput);

        // Check if finished on the final word of quote or custom text
        if (
          (mode === 'quote' || mode === 'custom' || mode === 'code') &&
          currentWordIndex === words.current.length - 1 &&
          nextInput === activeWord
        ) {
          finishTest();
        }
      }
    },
    [
      isFinished,
      isFailed,
      isPaused,
      isActive,
      currentWordIndex,
      currentInput,
      wordHistory,
      settings,
      mode,
      wordOption,
      customWords,
      finishTest
    ]
  );

  return {
    text,
    words: words.current,
    currentWordIndex,
    currentInput,
    wordHistory,
    isActive,
    isPaused,
    isFinished,
    isFailed,
    failReason,
    elapsedSeconds,
    remainingSeconds,
    wpm: currentWpm,
    rawWpm: currentRawWpm,
    burstWpm: calculateBurstSpeed(keystrokesRef.current),
    accuracy: currentAccuracy,
    errors: currentErrors,
    timeline: timelineRef.current,
    handleKeyDown,
    resetTest,
    finishTest,
    pauseTest,
    resumeTest
  };
}
