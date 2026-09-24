import React from 'react';
import type { TestMode } from '../../types';

interface LiveStatsBarProps {
  wpm: number;
  rawWpm: number;
  accuracy: number;
  errors: number;
  elapsedSeconds: number;
  remainingSeconds: number | null;
  mode: TestMode;
  currentWordIndex: number;
  totalWords: number;
  targetWpm?: number;
  blindMode?: boolean;
}

export const LiveStatsBar: React.FC<LiveStatsBarProps> = ({
  wpm,
  rawWpm,
  accuracy,
  errors,
  elapsedSeconds,
  remainingSeconds,
  mode,
  currentWordIndex,
  totalWords,
  targetWpm = 0,
  blindMode = false
}) => {
  const isPaceAhead = targetWpm > 0 && wpm >= targetWpm;

  return (
    <div className="card-3d card-3d-glass w-full flex flex-wrap items-center justify-between gap-4 px-5 py-3 rounded-2xl border border-[var(--border-color)] shadow-xl relative overflow-hidden">
      {/* Subtle Specular Top Highlight */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--color-primary)]/30 to-transparent pointer-events-none" />

      {/* Timer / Progress */}
      <div className="flex items-center gap-4 sm:gap-6">
        {mode === 'time' && remainingSeconds !== null && (
          <div className="flex flex-col p-2 px-3.5 rounded-xl bg-[var(--bg-subtle)]/75 border border-[var(--border-color)]/70 shadow-inner">
            <span className="text-[10px] uppercase tracking-wider text-[var(--text-sub)] font-semibold">
              Time Remaining
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-[var(--color-primary)]">
              {Math.max(0, Math.ceil(remainingSeconds))}s
            </span>
          </div>
        )}

        {mode === 'words' && (
          <div className="flex flex-col p-2 px-3.5 rounded-xl bg-[var(--bg-subtle)]/75 border border-[var(--border-color)]/70 shadow-inner">
            <span className="text-[10px] uppercase tracking-wider text-[var(--text-sub)] font-semibold">
              Words Progress
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-[var(--color-primary)]">
              {Math.min(currentWordIndex, totalWords)} / {totalWords}
            </span>
          </div>
        )}

        {(mode === 'quote' || mode === 'code' || mode === 'zen' || mode === 'custom') && (
          <div className="flex flex-col p-2 px-3.5 rounded-xl bg-[var(--bg-subtle)]/75 border border-[var(--border-color)]/70 shadow-inner">
            <span className="text-[10px] uppercase tracking-wider text-[var(--text-sub)] font-semibold">
              Elapsed Time
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-[var(--color-primary)]">
              {elapsedSeconds}s
            </span>
          </div>
        )}
      </div>

      {/* Live Core Metrics */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Live WPM */}
        <div className="flex flex-col items-center p-2 px-3.5 rounded-xl bg-[var(--bg-subtle)]/60 border border-[var(--border-color)]/60 shadow-xs">
          <span className="text-[10px] uppercase tracking-wider text-[var(--text-sub)] font-semibold">
            WPM
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold font-mono text-[var(--text-main)]">
            {wpm}
          </span>
        </div>

        {/* Live Accuracy */}
        <div className="flex flex-col items-center p-2 px-3.5 rounded-xl bg-[var(--bg-subtle)]/60 border border-[var(--border-color)]/60 shadow-xs">
          <span className="text-[10px] uppercase tracking-wider text-[var(--text-sub)] font-semibold">
            Accuracy
          </span>
          <span
            className={`text-2xl sm:text-3xl font-extrabold font-mono ${
              accuracy >= 95
                ? 'text-[var(--color-correct)]'
                : accuracy >= 85
                ? 'text-yellow-400'
                : 'text-[var(--color-error)]'
            }`}
          >
            {accuracy}%
          </span>
        </div>

        {/* Errors */}
        <div className="flex flex-col items-center p-2 px-3.5 rounded-xl bg-[var(--bg-subtle)]/60 border border-[var(--border-color)]/60 shadow-xs">
          <span className="text-[10px] uppercase tracking-wider text-[var(--text-sub)] font-semibold">
            Errors
          </span>
          <span
            className={`text-2xl sm:text-3xl font-extrabold font-mono ${
              errors > 0 ? 'text-[var(--color-error)]' : 'text-[var(--text-sub)]'
            }`}
          >
            {errors}
          </span>
        </div>

        {/* Raw WPM */}
        <div className="hidden md:flex flex-col items-center p-2 px-3 rounded-xl bg-[var(--bg-subtle)]/40 border border-[var(--border-color)]/40 shadow-xs">
          <span className="text-[10px] uppercase tracking-wider text-[var(--text-sub)] font-semibold">
            Raw WPM
          </span>
          <span className="text-xl font-bold font-mono text-[var(--text-sub)]">
            {rawWpm}
          </span>
        </div>

        {/* Target Pace status */}
        {targetWpm > 0 && (
          <div className="hidden lg:flex flex-col items-center">
            <span className="text-[10px] uppercase tracking-wider text-[var(--text-sub)] font-semibold">
              Target ({targetWpm})
            </span>
            <span
              className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider shadow-xs ${
                isPaceAhead
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
              }`}
            >
              {isPaceAhead ? `+${wpm - targetWpm} Ahead` : `${targetWpm - wpm} Behind`}
            </span>
          </div>
        )}

        {/* Blind mode indicator */}
        {blindMode && (
          <div className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-400 border border-purple-500/30 shadow-xs">
            Blind Mode
          </div>
        )}
      </div>
    </div>
  );
};
