import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  ArrowLeft,
  ArrowRight,
  AlertCircle,
  Award,
  Sparkles,
  Target,
  Clock,
  Zap,
  BarChart2
} from 'lucide-react';
import type { DetailedLesson, SubLesson, SubLessonProgress } from '../../types';
import { useSettings } from '../../context/SettingsContext';
import { useLearnEngine } from '../../hooks/useLearnEngine';
import { HandPlacementVisualizer } from './HandPlacementVisualizer';
import { VirtualKeyboard } from '../typing/VirtualKeyboard';
import { Button3D } from '../ui3d/Button3D';
import { Card3D } from '../ui3d/Card3D';
import { getFingerForKey } from '../../lib/fingerMapping';

interface SubLessonPlayerProps {
  lesson: DetailedLesson;
  subLesson: SubLesson;
  onBack: () => void;
  onNextSubLesson?: () => void;
  onPracticeMistakes?: (mistakeKeys: string[], mistakeWords: string[]) => void;
  onSubLessonCompleted?: (progress: SubLessonProgress) => void;
}

export const SubLessonPlayer: React.FC<SubLessonPlayerProps> = ({
  lesson,
  subLesson,
  onBack,
  onNextSubLesson,
  onPracticeMistakes,
  onSubLessonCompleted
}) => {
  const { settings } = useSettings();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(true);
  const [lastProgress, setLastProgress] = useState<SubLessonProgress | null>(null);
  const [lastPassed, setLastPassed] = useState<boolean | null>(null);

  const engine = useLearnEngine({
    subLesson,
    settings,
    onComplete: (progress, passed) => {
      setLastProgress(progress);
      setLastPassed(passed);
      if (passed) {
        onSubLessonCompleted?.(progress);
      }
    }
  });

  // Focus input automatically
  useEffect(() => {
    if (engine.status === 'typing' || engine.status === 'ready') {
      inputRef.current?.focus();
    }
  }, [engine.status]);

  const handleContainerClick = () => {
    inputRef.current?.focus();
    setIsFocused(true);
  };

  // Coaching tips based on live session metrics
  const getCoachingTip = () => {
    if (engine.status === 'ready') {
      return `Target: ${subLesson.minWpm} WPM & ${subLesson.minAccuracy}% Accuracy. Press Start or Space to begin.`;
    }
    if (engine.status === 'paused') {
      return 'Session paused. Take a breath and resume when ready.';
    }
    if (engine.liveAccuracy < 90 && engine.elapsedSeconds > 10) {
      return 'Accuracy below target. Slow down slightly to lock in muscle memory.';
    }
    if (engine.liveAccuracy >= 96 && engine.elapsedSeconds > 10) {
      return 'Exceptional precision! Keep this rhythmic momentum going.';
    }
    if (subLesson.tips.length > 0) {
      return subLesson.tips[0];
    }
    return `Rest fingers on home row anchors (F and J).`;
  };

  // Progress percentage of text completed
  const totalWords = engine.words.length;
  const progressPercent = totalWords > 0
    ? Math.min(100, Math.round(((engine.currentWordIndex + (engine.currentInput.length > 0 ? 0.5 : 0)) / totalWords) * 100))
    : 0;

  // Format time mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const perKeyAnalysis = engine.getPerKeyAnalysis();
  const mistakeKeys = perKeyAnalysis.filter((k) => k.incorrect > 0).map((k) => k.key);

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6 select-none" onClick={handleContainerClick}>
      {/* Hidden real input listener */}
      <input
        ref={inputRef}
        type="text"
        className="opacity-0 absolute -z-50 pointer-events-none"
        onKeyDown={engine.handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        autoFocus
      />

      {/* Top Header Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[var(--border-color)]">
        <button
          onClick={onBack}
          className="text-xs font-semibold text-[var(--color-primary)] hover:underline flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to {lesson.title}</span>
        </button>

        <div className="flex items-center gap-4 text-xs font-mono text-[var(--text-sub)]">
          <span className="flex items-center gap-1">
            <Target className="w-3.5 h-3.5 text-[var(--color-primary)]" />
            Min Acc: <strong className="text-[var(--text-main)]">{subLesson.minAccuracy}%</strong>
          </span>
          <span className="flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            Goal: <strong className="text-[var(--text-main)]">{subLesson.minWpm} WPM</strong>
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-[var(--text-sub)]" />
            Duration: <strong className="text-[var(--text-main)]">{formatTime(subLesson.durationSeconds)}</strong>
          </span>
        </div>
      </div>

      {/* SubLesson Info & Objective Banner */}
      <Card3D glass className="p-5 sm:p-6 rounded-3xl border border-[var(--border-color)] shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-[var(--color-primary)]/15 text-[var(--color-primary)] border border-[var(--color-primary)]/30">
                Lesson {lesson.order}.{subLesson.order}
              </span>
              <span className="text-xs font-medium uppercase tracking-wider text-[var(--text-sub)]">
                {subLesson.type.replace('_', ' ')}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[var(--text-main)] tracking-tight">
              {subLesson.title}
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-sub)] max-w-2xl">
              {subLesson.description}
            </p>
          </div>

          {/* Target Keys Tags */}
          <div className="flex flex-col sm:items-end gap-1.5 shrink-0">
            <span className="text-[11px] font-semibold text-[var(--text-sub)] uppercase">Target Keys</span>
            <div className="flex flex-wrap items-center gap-1.5">
              {subLesson.targetKeys.map((k, idx) => (
                <kbd
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-color)] text-[var(--color-primary)] font-mono font-bold text-xs shadow-xs"
                >
                  {k === ' ' ? 'Space' : k}
                </kbd>
              ))}
            </div>
          </div>
        </div>
      </Card3D>

      {/* Live Statistics & Session Controls Bar */}
      <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm flex flex-wrap items-center justify-between gap-4">
        {/* Real Live Metrics */}
        <div className="flex items-center gap-5 font-mono">
          {/* Timer */}
          <div className="flex flex-col">
            <span className="text-[10px] uppercase text-[var(--text-sub)] font-bold flex items-center gap-1">
              <Clock className="w-3 h-3 text-[var(--color-primary)]" />
              Time
            </span>
            <span className="text-xl sm:text-2xl font-black text-[var(--text-main)]">
              {formatTime(engine.remainingSeconds)}
            </span>
          </div>

          <div className="w-[1px] h-8 bg-[var(--border-color)]" />

          {/* Live WPM */}
          <div className="flex flex-col">
            <span className="text-[10px] uppercase text-[var(--text-sub)] font-bold">WPM</span>
            <span className="text-xl sm:text-2xl font-black text-[var(--color-primary)]">
              {engine.liveWpm}
            </span>
          </div>

          <div className="w-[1px] h-8 bg-[var(--border-color)]" />

          {/* Live Accuracy */}
          <div className="flex flex-col">
            <span className="text-[10px] uppercase text-[var(--text-sub)] font-bold">Accuracy</span>
            <span
              className={`text-xl sm:text-2xl font-black ${
                engine.liveAccuracy >= subLesson.minAccuracy ? 'text-emerald-400' : 'text-amber-400'
              }`}
            >
              {engine.liveAccuracy}%
            </span>
          </div>

          <div className="w-[1px] h-8 bg-[var(--border-color)]" />

          {/* Errors */}
          <div className="flex flex-col">
            <span className="text-[10px] uppercase text-[var(--text-sub)] font-bold">Errors</span>
            <span className={`text-xl sm:text-2xl font-black ${engine.liveErrors > 0 ? 'text-rose-400' : 'text-[var(--text-sub)]'}`}>
              {engine.liveErrors}
            </span>
          </div>
        </div>

        {/* Progress & Controls */}
        <div className="flex items-center gap-3">
          {/* Progress Mini Bar */}
          <div className="hidden sm:flex flex-col items-end gap-1 w-28">
            <span className="text-[10px] font-mono text-[var(--text-sub)]">{progressPercent}% done</span>
            <div className="w-full h-2 rounded-full bg-[var(--bg-subtle)] overflow-hidden">
              <div
                className="h-full bg-[var(--color-primary)] transition-all duration-200 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Start / Pause / Resume Button */}
          {engine.status === 'ready' && (
            <Button3D
              variant="primary"
              size="md"
              icon={<Play className="w-4 h-4 fill-current" />}
              onClick={engine.startSession}
            >
              Start Sublesson
            </Button3D>
          )}

          {engine.status === 'typing' && (
            <Button3D
              variant="secondary"
              size="sm"
              icon={<Pause className="w-4 h-4" />}
              onClick={engine.pauseSession}
            >
              Pause
            </Button3D>
          )}

          {engine.status === 'paused' && (
            <Button3D
              variant="primary"
              size="sm"
              icon={<Play className="w-4 h-4 fill-current" />}
              onClick={engine.resumeSession}
            >
              Resume
            </Button3D>
          )}

          {/* Reset Button */}
          <Button3D
            variant="ghost"
            size="sm"
            icon={<RotateCcw className="w-3.5 h-3.5" />}
            onClick={() => {
              engine.resetSession();
              setLastProgress(null);
              setLastPassed(null);
            }}
            title="Restart Sublesson"
          />
        </div>
      </div>

      {/* Countdown Overlay when Starting */}
      {engine.status === 'countdown' && (
        <div className="p-8 rounded-3xl bg-[var(--bg-surface)] border-2 border-[var(--color-primary)] shadow-2xl flex flex-col items-center justify-center gap-3 animate-in fade-in zoom-in-95">
          <span className="text-xs uppercase font-mono tracking-widest text-[var(--color-primary)] font-bold">
            Get Ready
          </span>
          <div className="text-6xl sm:text-7xl font-black text-[var(--text-main)] font-mono animate-pulse">
            {engine.countdown > 0 ? engine.countdown : 'START!'}
          </div>
          <span className="text-xs text-[var(--text-sub)]">
            Rest fingers gently on F &amp; J anchor bumps
          </span>
        </div>
      )}

      {/* Dedicated Typing Area */}
      {engine.status !== 'finished' && engine.status !== 'countdown' && (
        <div
          className={`typing-deck-3d p-6 sm:p-8 rounded-3xl transition-all relative overflow-hidden ${
            !isFocused ? 'ring-1 ring-amber-500/30' : ''
          }`}
        >
          {/* Unfocused overlay prompt */}
          {!isFocused && (
            <div className="absolute inset-0 z-30 bg-[var(--bg-main)]/60 backdrop-blur-xs flex items-center justify-center">
              <span className="text-xs sm:text-sm font-semibold text-[var(--color-primary)] bg-[var(--bg-surface)] px-4 py-2 rounded-xl border border-[var(--border-color)] shadow-lg">
                Click anywhere to focus and type
              </span>
            </div>
          )}

          {/* Text stream */}
          <div
            className="flex flex-wrap items-center gap-x-2.5 gap-y-3 font-mono leading-relaxed"
            style={{ fontSize: `${settings.fontSize || 24}px` }}
          >
            {engine.words.map((word, wIdx) => {
              const isPast = wIdx < engine.currentWordIndex;
              const isCurrent = wIdx === engine.currentWordIndex;
              const typedWord = isPast ? engine.wordHistory[wIdx] || '' : isCurrent ? engine.currentInput : '';

              return (
                <span
                  key={wIdx}
                  className={`relative inline-flex items-center transition-opacity ${
                    isPast
                      ? typedWord === word
                        ? 'opacity-60'
                        : 'opacity-80'
                      : isCurrent
                      ? 'opacity-100 font-bold'
                      : 'opacity-40'
                  }`}
                >
                  {word.split('').map((char, cIdx) => {
                    let charClass = 'text-[var(--text-sub)]';

                    if (isPast) {
                      charClass = typedWord[cIdx] === char ? 'text-[var(--color-correct)]' : 'text-[var(--color-error)] underline';
                    } else if (isCurrent) {
                      if (cIdx < typedWord.length) {
                        charClass = typedWord[cIdx] === char ? 'text-[var(--color-correct)]' : 'text-[var(--color-error)] bg-[var(--color-error-bg)] rounded-xs';
                      } else if (cIdx === typedWord.length) {
                        // Current active target character
                        charClass = 'text-[var(--text-main)] underline decoration-[var(--color-primary)] decoration-2 underline-offset-4';
                      }
                    }

                    return (
                      <span key={cIdx} className={`typing-char ${charClass}`}>
                        {char}
                      </span>
                    );
                  })}

                  {/* Extra characters typed by mistake */}
                  {isCurrent && typedWord.length > word.length && (
                    <span className="text-[var(--color-error)] opacity-80 underline wavy">
                      {typedWord.slice(word.length)}
                    </span>
                  )}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Real-time Dynamic Coaching Tip Banner */}
      <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-[var(--bg-subtle)]/60 border border-[var(--border-color)]/70 text-xs">
        <div className="flex items-center gap-2 text-[var(--text-sub)]">
          <Sparkles className="w-3.5 h-3.5 text-[var(--color-primary)] shrink-0" />
          <span>{getCoachingTip()}</span>
        </div>
        <div className="hidden sm:flex items-center gap-2 font-mono text-[11px] text-[var(--text-sub)]">
          <span>Target Finger:</span>
          <strong className="text-[var(--color-primary)]">
            {engine.activeChar ? getFingerForKey(engine.activeChar).description : subLesson.targetFinger}
          </strong>
        </div>
      </div>

      {/* Real Hand Placement & Finger Reach Visualizer (Single Canonical Source of Truth) */}
      <HandPlacementVisualizer
        targetChar={engine.activeChar}
        upcomingChar={engine.nextChar}
        currentChar={engine.currentInput ? engine.currentInput[engine.currentInput.length - 1] : ''}
        isError={engine.liveErrors > 0}
      />

      {/* Synchronized 3D Virtual Keyboard */}
      {settings.showVirtualKeyboard && (
        <VirtualKeyboard
          currentKey={engine.activeChar}
          nextKey={engine.nextChar}
          isError={engine.liveErrors > 0}
          showFingerGuides={true}
        />
      )}

      {/* Results Screen when Finished */}
      {engine.status === 'finished' && lastProgress && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[var(--bg-surface)] border-2 border-[var(--border-color)] shadow-2xl animate-in fade-in zoom-in-95 flex flex-col gap-6">
          {/* Header Status */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[var(--border-color)] pb-6">
            <div className="flex items-center gap-4">
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                  lastPassed
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                }`}
              >
                {lastPassed ? (
                  <Award className="w-8 h-8" />
                ) : (
                  <AlertCircle className="w-8 h-8" />
                )}
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-[var(--text-main)]">
                  {lastPassed ? 'Sublesson Passed & Mastered! ✓' : 'Sublesson Incomplete — Try Again!'}
                </h3>
                <p className="text-xs sm:text-sm text-[var(--text-sub)]">
                  {lastPassed
                    ? 'Your muscle memory is locking in. Proceed to the next exercise or practice mistakes!'
                    : `Requirement: ${subLesson.minWpm} WPM and ${subLesson.minAccuracy}% accuracy.`}
                </p>
              </div>
            </div>

            {/* Overall Score Pill */}
            <div className="flex items-center gap-6 text-center font-mono">
              <div>
                <span className="block text-[10px] text-[var(--text-sub)] uppercase">WPM</span>
                <span className="text-3xl font-black text-[var(--color-primary)]">
                  {lastProgress.bestWpm}
                </span>
              </div>
              <div>
                <span className="block text-[10px] text-[var(--text-sub)] uppercase">Accuracy</span>
                <span className="text-3xl font-black text-emerald-400">
                  {lastProgress.bestAccuracy}%
                </span>
              </div>
              <div>
                <span className="block text-[10px] text-[var(--text-sub)] uppercase">Errors</span>
                <span className="text-3xl font-black text-rose-400">
                  {lastProgress.lowestErrors}
                </span>
              </div>
            </div>
          </div>

          {/* Detailed Statistics Breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)]">
              <span className="text-[10px] text-[var(--text-sub)] uppercase font-semibold">Raw WPM</span>
              <span className="text-lg font-bold text-[var(--text-main)] font-mono block">
                {engine.liveRawWpm}
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)]">
              <span className="text-[10px] text-[var(--text-sub)] uppercase font-semibold">Time Elapsed</span>
              <span className="text-lg font-bold text-[var(--text-main)] font-mono block">
                {formatTime(lastProgress.totalTimeSpent)}
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)]">
              <span className="text-[10px] text-[var(--text-sub)] uppercase font-semibold">Consistency</span>
              <span className="text-lg font-bold text-[var(--text-main)] font-mono block">
                {lastProgress.bestConsistency}%
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)]">
              <span className="text-[10px] text-[var(--text-sub)] uppercase font-semibold">Backspaces</span>
              <span className="text-lg font-bold text-[var(--text-main)] font-mono block">
                {engine.backspaceCount}
              </span>
            </div>
          </div>

          {/* Per-Key Breakdown & Mistakes Diagnostic */}
          {perKeyAnalysis.length > 0 && (
            <div className="flex flex-col gap-2.5 p-4 rounded-2xl bg-[var(--bg-subtle)]/50 border border-[var(--border-color)]">
              <div className="flex items-center justify-between text-xs font-bold text-[var(--text-main)]">
                <span className="flex items-center gap-1.5">
                  <BarChart2 className="w-4 h-4 text-[var(--color-primary)]" />
                  Per-Key Precision Diagnostic
                </span>
                <span className="text-[11px] text-[var(--text-sub)] font-normal font-mono">
                  {perKeyAnalysis.length} keys evaluated
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {perKeyAnalysis.slice(0, 12).map((k, idx) => (
                  <div
                    key={idx}
                    className={`p-2 rounded-lg border text-xs font-mono flex items-center justify-between ${
                      k.accuracy < 90
                        ? 'border-rose-500/40 bg-rose-500/10'
                        : 'border-[var(--border-color)] bg-[var(--bg-surface)]'
                    }`}
                  >
                    <kbd className="font-bold text-[var(--text-main)]">{k.key}</kbd>
                    <span className={k.accuracy >= 90 ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-bold'}>
                      {k.accuracy}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[var(--border-color)]">
            <div className="flex items-center gap-2">
              <Button3D
                variant="secondary"
                size="md"
                icon={<RotateCcw className="w-4 h-4" />}
                onClick={() => {
                  engine.resetSession();
                  setLastProgress(null);
                  setLastPassed(null);
                }}
              >
                Retry Sublesson
              </Button3D>

              {mistakeKeys.length > 0 && onPracticeMistakes && (
                <Button3D
                  variant="outline"
                  size="md"
                  icon={<Target className="w-4 h-4 text-amber-400" />}
                  onClick={() => onPracticeMistakes(mistakeKeys, [])}
                >
                  Practice My Mistakes
                </Button3D>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button3D
                variant="ghost"
                size="md"
                onClick={onBack}
              >
                Back to Curriculum
              </Button3D>

              {lastPassed && onNextSubLesson && (
                <Button3D
                  variant="primary"
                  size="md"
                  icon={<ArrowRight className="w-4 h-4" />}
                  onClick={onNextSubLesson}
                >
                  Next Sublesson
                </Button3D>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
