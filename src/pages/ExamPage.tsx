import React, { useState, useCallback } from 'react';
import {
  GraduationCap,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Play
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { ExamConfig, ExamResult, TestResult } from '../types';
import { generateTestText } from '../lib/generator';
import { evaluateExam } from '../lib/metrics';
import { useSettings } from '../context/SettingsContext';
import { useTypingEngine } from '../hooks/useTypingEngine';
import { useRestartShortcut } from '../hooks/useRestartShortcut';
import { TypingArea } from '../components/typing/TypingArea';
import { LiveStatsBar } from '../components/typing/LiveStatsBar';

export const ExamPage: React.FC = () => {
  const { settings } = useSettings();

  const [examConfig, setExamConfig] = useState<ExamConfig>({
    duration: 60,
    minWpm: 50,
    minAccuracy: 95,
    punctuation: true,
    numbers: false,
    allowBackspace: true,
    strictStopOnError: false
  });

  const [isExamActive, setIsExamActive] = useState(false);
  const [examResult, setExamResult] = useState<ExamResult | null>(null);
  const [examText, setExamText] = useState('');
  const [isFocused, setIsFocused] = useState(true);

  const startExam = () => {
    const text = generateTestText({
      mode: 'time',
      timeOption: 'custom',
      customTime: examConfig.duration,
      punctuation: examConfig.punctuation,
      numbers: examConfig.numbers
    });
    setExamText(text);
    setExamResult(null);
    setIsExamActive(true);
    engine.resetTest();
    setIsFocused(true);
  };

  const handleTestComplete = (res: TestResult) => {
    const evalResult = evaluateExam(
      res.wpm,
      res.accuracy,
      res.characterStats.incorrect + res.characterStats.extra,
      examConfig
    );

    const fullResult: ExamResult = {
      passed: evalResult.passed,
      config: examConfig,
      wpm: res.wpm,
      accuracy: res.accuracy,
      errors: res.characterStats.incorrect + res.characterStats.extra,
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      reasons: evalResult.reasons,
      certificateId: `TA-EXAM-${Date.now().toString(36).toUpperCase()}`
    };

    if (evalResult.passed) {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
    }

    setExamResult(fullResult);
    setIsExamActive(false);
  };

  const engine = useTypingEngine({
    initialText: examText,
    mode: 'time',
    timeOption: 'custom',
    customTime: examConfig.duration,
    wordOption: 50,
    customWords: 50,
    settings: {
      ...settings,
      disableBackspace: !examConfig.allowBackspace,
      stopOnError: examConfig.strictStopOnError,
      difficulty: examConfig.strictStopOnError ? 'expert' : 'normal'
    },
    onTestComplete: handleTestComplete
  });

  const handleRestartExam = useCallback(() => {
    setExamResult(null);
    setIsExamActive(true);
    engine.resetTest();
    setIsFocused(true);
  }, [engine]);

  useRestartShortcut({
    onRestart: handleRestartExam,
    enabled: isExamActive || Boolean(examResult)
  });

  return (
    <div className="w-full max-w-4xl mx-auto py-6 sm:py-10 px-4">
      {/* Ongoing Exam Screen */}
      {isExamActive ? (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)] text-xs">
            <span className="font-bold text-[var(--color-primary)] flex items-center gap-1.5 uppercase tracking-wider">
              <GraduationCap className="w-4 h-4" />
              Official Examination in Progress
            </span>
            <div className="flex items-center gap-4 text-[var(--text-sub)] font-mono">
              <span>Required: {examConfig.minWpm} WPM</span>
              <span>Min Acc: {examConfig.minAccuracy}%</span>
            </div>
          </div>

          <LiveStatsBar
            wpm={engine.wpm}
            rawWpm={engine.rawWpm}
            accuracy={engine.accuracy}
            errors={engine.errors}
            elapsedSeconds={engine.elapsedSeconds}
            remainingSeconds={engine.remainingSeconds}
            mode="time"
            currentWordIndex={engine.currentWordIndex}
            totalWords={engine.words.length}
          />

          <TypingArea
            words={engine.words}
            currentWordIndex={engine.currentWordIndex}
            currentInput={engine.currentInput}
            wordHistory={engine.wordHistory}
            caretStyle="line"
            smoothCaret={true}
            fontSize={24}
            isFocused={isFocused}
            onFocus={() => setIsFocused(true)}
            onKeyDown={engine.handleKeyDown}
          />
        </div>
      ) : examResult ? (
        /* Exam Scorecard & Certificate Result */
        <div className="card-3d card-3d-glass p-8 rounded-3xl border border-[var(--border-color)] shadow-2xl animate-in fade-in zoom-in-95 relative overflow-hidden">
          {/* Top highlight */}
          <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[var(--color-primary)]/40 to-transparent pointer-events-none" />
          <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-6 mb-6">
            <div className="flex items-center gap-3">
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                  examResult.passed
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-rose-500/20 text-rose-400'
                }`}
              >
                {examResult.passed ? (
                  <CheckCircle2 className="w-8 h-8" />
                ) : (
                  <XCircle className="w-8 h-8" />
                )}
              </div>
              <div>
                <span className="text-xs uppercase font-bold tracking-widest text-[var(--text-sub)]">
                  Examination Assessment
                </span>
                <h2 className="text-2xl font-black text-[var(--text-main)]">
                  {examResult.passed ? 'TEST RESULT: PASSED' : 'TEST RESULT: NOT PASSED'}
                </h2>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs text-[var(--text-sub)] block">Certificate ID</span>
              <span className="text-xs font-mono font-bold text-[var(--color-primary)]">
                {examResult.certificateId}
              </span>
            </div>
          </div>

          {/* Exam Requirements Check Table */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 text-center font-mono">
            <div className="p-4 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-color)]">
              <span className="block text-xs uppercase text-[var(--text-sub)] mb-1">WPM Speed</span>
              <span className="text-3xl font-bold text-[var(--color-primary)]">
                {examResult.wpm}
              </span>
              <span className="block text-[11px] text-[var(--text-sub)] mt-1">
                Target: {examResult.config.minWpm} WPM (
                {examResult.wpm >= examResult.config.minWpm ? 'Passed' : 'Failed'})
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-color)]">
              <span className="block text-xs uppercase text-[var(--text-sub)] mb-1">Accuracy</span>
              <span
                className={`text-3xl font-bold ${
                  examResult.accuracy >= examResult.config.minAccuracy
                    ? 'text-[var(--color-correct)]'
                    : 'text-[var(--color-error)]'
                }`}
              >
                {examResult.accuracy}%
              </span>
              <span className="block text-[11px] text-[var(--text-sub)] mt-1">
                Target: {examResult.config.minAccuracy}% (
                {examResult.accuracy >= examResult.config.minAccuracy ? 'Passed' : 'Failed'})
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-color)]">
              <span className="block text-xs uppercase text-[var(--text-sub)] mb-1">
                Exam Duration
              </span>
              <span className="text-3xl font-bold text-[var(--text-main)]">
                {examResult.config.duration}s
              </span>
              <span className="block text-[11px] text-[var(--text-sub)] mt-1">
                Errors: {examResult.errors}
              </span>
            </div>
          </div>

          {/* If failed, show clear reasons */}
          {!examResult.passed && examResult.reasons.length > 0 && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs mb-6">
              <span className="font-bold block mb-1">Failure Criteria:</span>
              <ul className="list-disc pl-5 space-y-1">
                {examResult.reasons.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-[var(--border-color)]">
            <span className="text-xs text-[var(--text-sub)]">Certified on {examResult.date}</span>
            <button
              onClick={() => setExamResult(null)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[var(--color-primary)] text-[var(--bg-main)] font-bold text-xs shadow-md"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Configure New Exam</span>
            </button>
          </div>
        </div>
      ) : (
        /* Exam Configuration Form */
        <div className="card-3d card-3d-glass p-8 rounded-3xl border border-[var(--border-color)] shadow-xl relative overflow-hidden">
          {/* Top highlight */}
          <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[var(--color-primary)]/40 to-transparent pointer-events-none" />
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-2xl bg-[var(--color-primary)]/15 text-[var(--color-primary)]">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-main)]">
                Typing Examination Certification
              </h1>
              <p className="text-xs text-[var(--text-sub)]">
                Configure formal test conditions to evaluate speed and precision against professional benchmarks.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
            {/* Exam Duration */}
            <div className="p-4 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-color)]">
              <label className="block text-xs font-semibold uppercase text-[var(--text-sub)] mb-2">
                Exam Duration
              </label>
              <select
                value={examConfig.duration}
                onChange={(e) =>
                  setExamConfig((prev) => ({ ...prev, duration: parseInt(e.target.value, 10) }))
                }
                className="w-full px-3 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-sm font-mono text-[var(--text-main)]"
              >
                <option value={30}>30 Seconds (Quick Evaluation)</option>
                <option value={60}>60 Seconds (1 Minute Standard)</option>
                <option value={120}>120 Seconds (2 Minute Fluency)</option>
                <option value={300}>300 Seconds (5 Minute Professional)</option>
              </select>
            </div>

            {/* Minimum WPM Passing Target */}
            <div className="p-4 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-color)]">
              <label className="block text-xs font-semibold uppercase text-[var(--text-sub)] mb-2">
                Minimum WPM Required to Pass
              </label>
              <input
                type="number"
                min="20"
                max="150"
                value={examConfig.minWpm}
                onChange={(e) =>
                  setExamConfig((prev) => ({
                    ...prev,
                    minWpm: Math.max(10, parseInt(e.target.value, 10) || 0)
                  }))
                }
                className="w-full px-3 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-sm font-mono text-[var(--text-main)]"
              />
            </div>

            {/* Minimum Accuracy Passing Target */}
            <div className="p-4 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-color)]">
              <label className="block text-xs font-semibold uppercase text-[var(--text-sub)] mb-2">
                Minimum Accuracy Required
              </label>
              <select
                value={examConfig.minAccuracy}
                onChange={(e) =>
                  setExamConfig((prev) => ({
                    ...prev,
                    minAccuracy: parseInt(e.target.value, 10)
                  }))
                }
                className="w-full px-3 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-sm font-mono text-[var(--text-main)]"
              >
                <option value={90}>90% (Standard)</option>
                <option value={95}>95% (High Precision)</option>
                <option value={98}>98% (Professional Stenographer)</option>
                <option value={100}>100% (Flawless)</option>
              </select>
            </div>

            {/* Backspace Permission */}
            <div className="p-4 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-color)]">
              <label className="block text-xs font-semibold uppercase text-[var(--text-sub)] mb-2">
                Backspace Policy
              </label>
              <select
                value={examConfig.allowBackspace ? 'allowed' : 'forbidden'}
                onChange={(e) =>
                  setExamConfig((prev) => ({
                    ...prev,
                    allowBackspace: e.target.value === 'allowed'
                  }))
                }
                className="w-full px-3 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-sm font-mono text-[var(--text-main)]"
              >
                <option value="allowed">Allowed (Normal corrections permitted)</option>
                <option value="forbidden">Forbidden (Keystrokes are permanent)</option>
              </select>
            </div>
          </div>

          {/* Toggles */}
          <div className="flex flex-wrap items-center gap-4 mb-8">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-[var(--text-main)]">
              <input
                type="checkbox"
                checked={examConfig.punctuation}
                onChange={(e) =>
                  setExamConfig((prev) => ({ ...prev, punctuation: e.target.checked }))
                }
                className="rounded accent-[var(--color-primary)] w-4 h-4"
              />
              <span>Include Punctuation Marks</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-[var(--text-main)]">
              <input
                type="checkbox"
                checked={examConfig.numbers}
                onChange={(e) =>
                  setExamConfig((prev) => ({ ...prev, numbers: e.target.checked }))
                }
                className="rounded accent-[var(--color-primary)] w-4 h-4"
              />
              <span>Include Numbers</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-[var(--text-main)]">
              <input
                type="checkbox"
                checked={examConfig.strictStopOnError}
                onChange={(e) =>
                  setExamConfig((prev) => ({ ...prev, strictStopOnError: e.target.checked }))
                }
                className="rounded accent-[var(--color-primary)] w-4 h-4"
              />
              <span>Strict Stop on Error (Must resolve error before advancing)</span>
            </label>
          </div>

          <div className="flex items-center justify-end pt-4 border-t border-[var(--border-color)]">
            <button
              onClick={startExam}
              className="btn-3d flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-[var(--color-primary)] text-[var(--bg-main)] font-extrabold text-sm shadow-xl shadow-[var(--color-primary)]/20 hover:opacity-90"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Begin Official Examination</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
