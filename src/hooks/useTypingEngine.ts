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

  const startTimeRef = useRef<number | null>(null);
  const lastKeyTimeRef = useRef<number | null>(null);
  const keystrokesRef = useRef<KeystrokeEvent[]>([]);
  const timelineRef = useRef<{ time: number; wpm: number; rawWpm: number; errors: number }[]>([]);
  const backspaceCountRef = useRef(0);
  const timerIntervalRef = useRef<number | null>(null);
  const resultSavedRef = useRef(false);

  // Sync text when initialText changes
  useEffect(() => {
    setText(initialText);
    resetTest();
  }, [initialText]);

  // Reset test state completely
  const resetTest = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    setIsActive(false);
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
    startTimeRef.current = null;
    lastKeyTimeRef.current = null;
    keystrokesRef.current = [];
    timelineRef.current = [];
    backspaceCountRef.current = 0;
    resultSavedRef.current = false;
  }, [mode, timeOption, customTime]);

  // Compute live character statistics
  const getCharacterStats = useCallback(() => {
    let correct = 0;
    let incorrect = 0;
    let extra = 0;
    let missed = 0;

    // Evaluate completed words
    wordHistory.forEach((typed, idx) => {
      const expected = words.current[idx] || '';
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
      // Count space
      correct++;
    });

    // Evaluate active word in progress
    const activeExpected = words.current[currentWordIndex] || '';
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
  const currentTotalTyped = stats.correct + stats.incorrect + stats.extra;
  const currentDurationForWpm = startTimeRef.current
    ? Math.max(0.5, (performance.now() - startTimeRef.current) / 1000)
    : Math.max(1, elapsedSeconds);
  const currentWpm = calculateWpm(stats.correct, currentDurationForWpm);
  const currentRawWpm = calculateRawWpm(currentTotalTyped, currentDurationForWpm);
  const currentAccuracy = calculateAccuracy(stats);
  const currentErrors = stats.incorrect + stats.extra;

  // Finalize test and compute full result
  const finishTest = useCallback((finalDurationOverride?: number) => {
    if (resultSavedRef.current) return;
    resultSavedRef.current = true;

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    setIsActive(false);
    setIsFinished(true);

    let actualDuration: number;
    if (finalDurationOverride !== undefined) {
      actualDuration = finalDurationOverride;
    } else if (startTimeRef.current) {
      const raw = (performance.now() - startTimeRef.current) / 1000;
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

    const finalStats = getCharacterStats();
    const finalWpm = calculateWpm(finalStats.correct, actualDuration);
    const finalRaw = calculateRawWpm(
      finalStats.correct + finalStats.incorrect + finalStats.extra,
      actualDuration
    );
    const finalNet = calculateNetWpm(finalRaw, finalStats.incorrect + finalStats.extra, actualDuration);
    const finalAccuracy = calculateAccuracy(finalStats);
    const finalConsistency = calculateConsistency(keystrokesRef.current);

    // Identify unique mistyped keys
    const mistakeKeys = Array.from(
      new Set(
        keystrokesRef.current
          .filter((k) => !k.isCorrect)
          .map((k) => k.expected.toLowerCase())
      )
    );

    // Identify mistyped words
    const mistypedWords: string[] = [];
    wordHistory.forEach((typed, idx) => {
      const exp = words.current[idx];
      if (typed !== exp) mistypedWords.push(exp);
    });

    const finalBurst = calculateBurstSpeed(keystrokesRef.current);

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
      characterStats: finalStats,
      backspaceCount: backspaceCountRef.current,
      mistakes: mistakeKeys,
      mistypedWords,
      keystrokes: keystrokesRef.current,
      timeline: timelineRef.current.length > 0 ? timelineRef.current : [
        { time: actualDuration, wpm: finalWpm, rawWpm: finalRaw, errors: finalStats.incorrect }
      ],
      difficulty: settings.difficulty,
      language: settings.language
    };

    // Save to storage
    storage.saveTestResult(result);
    soundEngine.playSuccessChime();

    if (onTestComplete) {
      onTestComplete(result);
    }
  }, [
    elapsedSeconds,
    getCharacterStats,
    mode,
    targetDuration,
    currentWordIndex,
    currentInput,
    settings.difficulty,
    settings.language,
    wordHistory,
    onTestComplete
  ]);

  // Interval timer for live updates with timestamp drift compensation and tab-switch safety
  useEffect(() => {
    if (!isActive || isFinished) return;

    let lastRecordedSec = 0;

    const handleVisibilityChange = () => {
      if (document.hidden) return;
      if (!startTimeRef.current || !isActive || isFinished) return;
      const exactElapsed = (performance.now() - startTimeRef.current) / 1000;
      if (mode === 'time' && targetDuration > 0 && exactElapsed >= targetDuration) {
        finishTest(targetDuration);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    timerIntervalRef.current = window.setInterval(() => {
      if (!startTimeRef.current) return;
      const exactElapsed = (performance.now() - startTimeRef.current) / 1000;
      const wholeElapsed = Math.floor(exactElapsed);

      setElapsedSeconds(wholeElapsed);

      // Record live sample in timeline once per whole second
      if (wholeElapsed > lastRecordedSec) {
        lastRecordedSec = wholeElapsed;
        const currentStats = getCharacterStats();
        const liveW = calculateWpm(currentStats.correct, Math.max(1, wholeElapsed));
        const liveRaw = calculateRawWpm(
          currentStats.correct + currentStats.incorrect + currentStats.extra,
          Math.max(1, wholeElapsed)
        );
        timelineRef.current.push({
          time: wholeElapsed,
          wpm: liveW,
          rawWpm: liveRaw,
          errors: currentStats.incorrect + currentStats.extra
        });
      }

      // Time Mode countdown rule: automatically ends at target duration
      if (mode === 'time' && targetDuration > 0) {
        const rem = Math.max(0, targetDuration - exactElapsed);
        setRemainingSeconds(Math.ceil(rem));
        if (exactElapsed >= targetDuration) {
          finishTest(targetDuration);
        }
      }
    }, 50);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    };
  }, [isActive, isFinished, mode, targetDuration, finishTest, getCharacterStats]);

  // Keydown processor
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent | KeyboardEvent) => {
      if (isFinished || isFailed) return;

      const key = e.key;

      // Ignore navigation, functional, modifier keys alone
      if (
        key === 'Tab' ||
        key === 'Shift' ||
        key === 'Control' ||
        key === 'Alt' ||
        key === 'Meta' ||
        key === 'CapsLock' ||
        key === 'Escape' ||
        key.startsWith('F') && key.length > 1
      ) {
        return;
      }

      const now = performance.now();
      const latency = lastKeyTimeRef.current ? Math.round(now - lastKeyTimeRef.current) : 0;
      lastKeyTimeRef.current = now;

      // Start timer on first keystroke using performance.now()
      if (!isActive) {
        setIsActive(true);
        startTimeRef.current = performance.now();
      }

      const activeWord = words.current[currentWordIndex] || '';

      // Backspace handling
      if (key === 'Backspace') {
        e.preventDefault();

        // Check if backspace is completely disabled by user setting
        if (settings.disableBackspace) {
          return;
        }

        backspaceCountRef.current += 1;

        if (currentInput.length > 0) {
          setCurrentInput((prev) => prev.slice(0, -1));
        } else if (
          currentWordIndex > 0 &&
          settings.difficulty === 'normal' // Advanced+ does not allow going back to previous words
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

        soundEngine.playKeystroke(settings.soundProfile);

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
        } else {
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
          // Record the failed attempt keystroke
          keystrokesRef.current.push({
            key,
            expected: expectedChar,
            timestamp: Date.now(),
            isCorrect: false,
            latencyMs: latency
          });
          return;
        }

        // Record keystroke event
        keystrokesRef.current.push({
          key,
          expected: expectedChar || 'extra',
          timestamp: Date.now(),
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
    finishTest
  };
}
