import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  RotateCcw,
  ArrowRight,
  Target,
  Zap,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Award,
  Sparkles
} from 'lucide-react';
import type { TestResult, UserSettings } from '../../types';
import { LiveWpmChart } from './LiveWpmChart';
import { Button3D } from '../ui3d/Button3D';

interface ResultModalProps {
  result: TestResult;
  settings: UserSettings;
  isNewPB?: boolean;
  pbType?: string;
  onRestart: () => void;
  onNextTest: () => void;
  onPracticeMistakes: (keys: string[], words: string[]) => void;
}

export const ResultModal: React.FC<ResultModalProps> = ({
  result,
  settings,
  isNewPB = false,
  pbType,
  onRestart,
  onNextTest,
  onPracticeMistakes
}) => {
  useEffect(() => {
    if (isNewPB) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [isNewPB]);

  // Check minimum WPM and Accuracy requirements if configured
  const meetsMinWpm = settings.minWpm <= 0 || result.wpm >= settings.minWpm;
  const meetsMinAccuracy = settings.minAccuracy <= 0 || result.accuracy >= settings.minAccuracy;
  const hasThresholds = settings.minWpm > 0 || settings.minAccuracy > 0;
  const overallPass = meetsMinWpm && meetsMinAccuracy;

  return (
    <div className="card-3d card-3d-glass w-full max-w-4xl mx-auto rounded-3xl border border-[var(--border-color)] p-6 sm:p-8 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      {/* Subtle Specular Top Highlight */}
      <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[var(--color-primary)]/40 to-transparent pointer-events-none" />
      {/* Header Banner: PB or Pass/Fail */}
      {isNewPB && (
        <div className="flex items-center justify-center gap-2 p-3 mb-6 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 font-bold text-sm tracking-wide">
          <Award className="w-5 h-5 text-amber-400" />
          <span>NEW PERSONAL BEST! {pbType ? `(${pbType})` : ''} — Congratulations!</span>
        </div>
      )}

      {hasThresholds && (
        <div
          className={`flex items-center justify-between p-3.5 mb-6 rounded-2xl border text-sm font-semibold ${
            overallPass
              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
              : 'bg-rose-500/15 border-rose-500/30 text-rose-400'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {overallPass ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-400" />
            )}
            <span>
              {overallPass
                ? 'CRITERIA SATISFIED — TEST PASSED'
                : 'CRITERIA NOT MET — TEST NOT PASSED'}
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            {settings.minWpm > 0 && (
              <span className={meetsMinWpm ? 'text-emerald-400' : 'text-rose-400'}>
                Min WPM: {settings.minWpm} ({result.wpm} achieved)
              </span>
            )}
            {settings.minAccuracy > 0 && (
              <span className={meetsMinAccuracy ? 'text-emerald-400' : 'text-rose-400'}>
                Min Acc: {settings.minAccuracy}% ({result.accuracy}% achieved)
              </span>
            )}
          </div>
        </div>
      )}

      {/* Primary Top Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {/* Net WPM */}
        <div className="flex flex-col p-4 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-color)]">
          <span className="text-xs uppercase font-semibold tracking-wider text-[var(--text-sub)] flex items-center gap-1.5 mb-1">
            <Zap className="w-3.5 h-3.5 text-[var(--color-primary)]" />
            WPM
          </span>
          <span className="text-4xl sm:text-5xl font-extrabold font-mono text-[var(--color-primary)]">
            {result.wpm}
          </span>
          <span className="text-[11px] text-[var(--text-sub)] mt-1 font-mono">
            Raw: {result.rawWpm} WPM
          </span>
        </div>

        {/* Accuracy */}
        <div className="flex flex-col p-4 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-color)]">
          <span className="text-xs uppercase font-semibold tracking-wider text-[var(--text-sub)] flex items-center gap-1.5 mb-1">
            <Target className="w-3.5 h-3.5 text-[var(--color-correct)]" />
            Accuracy
          </span>
          <span
            className={`text-4xl sm:text-5xl font-extrabold font-mono ${
              result.accuracy >= 95
                ? 'text-[var(--color-correct)]'
                : result.accuracy >= 85
                ? 'text-yellow-400'
                : 'text-[var(--color-error)]'
            }`}
          >
            {result.accuracy}%
          </span>
          <span className="text-[11px] text-[var(--text-sub)] mt-1 font-mono">
            Errors: {result.characterStats.incorrect + result.characterStats.extra}
          </span>
        </div>

        {/* Consistency */}
        <div className="flex flex-col p-4 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-color)]">
          <span className="text-xs uppercase font-semibold tracking-wider text-[var(--text-sub)] flex items-center gap-1.5 mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
            Consistency
          </span>
          <span className="text-4xl sm:text-5xl font-extrabold font-mono text-[var(--text-main)]">
            {result.consistency}%
          </span>
          <span className="text-[11px] text-[var(--text-sub)] mt-1 font-mono">
            Rhythm stability
          </span>
        </div>

        {/* Time / Duration */}
        <div className="flex flex-col p-4 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-color)]">
          <span className="text-xs uppercase font-semibold tracking-wider text-[var(--text-sub)] flex items-center gap-1.5 mb-1">
            Time
          </span>
          <span className="text-4xl sm:text-5xl font-extrabold font-mono text-[var(--text-main)]">
            {result.duration}s
          </span>
          <span className="text-[11px] text-[var(--text-sub)] mt-1 font-mono capitalize">
            {result.mode} test
          </span>
        </div>
      </div>

      {/* Speed & Error Timeline Chart */}
      <div className="mb-6">
        <LiveWpmChart timeline={result.timeline} height={160} />
      </div>

      {/* Detailed Character Stats & Mistake Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {/* Character Breakdown */}
        <div className="p-4 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-color)]">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-sub)] mb-3">
            Character Breakdown
          </h4>
          <div className="grid grid-cols-4 gap-2 font-mono text-center">
            <div className="p-2 rounded-xl bg-[var(--bg-surface)]">
              <span className="block text-[10px] text-[var(--text-sub)] uppercase">Correct</span>
              <span className="text-lg font-bold text-[var(--color-correct)]">
                {result.characterStats.correct}
              </span>
            </div>
            <div className="p-2 rounded-xl bg-[var(--bg-surface)]">
              <span className="block text-[10px] text-[var(--text-sub)] uppercase">Incorrect</span>
              <span className="text-lg font-bold text-[var(--color-error)]">
                {result.characterStats.incorrect}
              </span>
            </div>
            <div className="p-2 rounded-xl bg-[var(--bg-surface)]">
              <span className="block text-[10px] text-[var(--text-sub)] uppercase">Extra</span>
              <span className="text-lg font-bold text-yellow-400">
                {result.characterStats.extra}
              </span>
            </div>
            <div className="p-2 rounded-xl bg-[var(--bg-surface)]">
              <span className="block text-[10px] text-[var(--text-sub)] uppercase">Missed</span>
              <span className="text-lg font-bold text-[var(--text-sub)]">
                {result.characterStats.missed}
              </span>
            </div>
          </div>
        </div>

        {/* Mistyped Keys & Practice My Mistakes */}
        <div className="p-4 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-color)] flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-sub)] mb-2">
              Mistyped Keys & Difficult Words
            </h4>
            {result.mistakes.length > 0 || result.mistypedWords.length > 0 ? (
              <div className="flex flex-wrap items-center gap-1.5 mb-3">
                {result.mistakes.slice(0, 8).map((char, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-lg bg-[var(--color-error-bg)] text-[var(--color-error)] border border-[var(--color-error)]/30 font-mono text-xs font-bold"
                  >
                    {char === ' ' ? '␣ Space' : char}
                  </span>
                ))}
                {result.mistypedWords.slice(0, 3).map((w, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-lg bg-[var(--bg-surface)] text-[var(--text-main)] border border-[var(--border-color)] font-mono text-xs"
                  >
                    {w}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[var(--color-correct)] font-medium mb-3">
                Flawless precision! Zero mistyped keys.
              </p>
            )}
          </div>

          {(result.mistakes.length > 0 || result.mistypedWords.length > 0) && (
            <Button3D
              variant="danger"
              size="sm"
              icon={<Sparkles className="w-3.5 h-3.5" />}
              onClick={() => onPracticeMistakes(result.mistakes, result.mistypedWords)}
              className="w-full text-xs"
            >
              Practice My Mistakes (Generate Targeted Drill)
            </Button3D>
          )}
        </div>
      </div>

      {/* 3D Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[var(--border-color)]">
        <Button3D
          variant="secondary"
          size="md"
          icon={<RotateCcw className="w-4 h-4 text-[var(--text-sub)]" />}
          onClick={onRestart}
        >
          Restart Test (Tab + Enter)
        </Button3D>

        <Button3D
          variant="primary"
          size="md"
          icon={<ArrowRight className="w-4 h-4" />}
          onClick={onNextTest}
        >
          Next Test
        </Button3D>
      </div>
    </div>
  );
};
