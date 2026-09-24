import React from 'react';
import {
  ArrowLeft,
  Play,
  CheckCircle2,
  Target,
  BookOpen
} from 'lucide-react';
import type { DetailedLesson, SubLesson, SubLessonProgress } from '../../types';
import { Button3D } from '../ui3d/Button3D';
import { Card3D } from '../ui3d/Card3D';

interface LessonDetailViewProps {
  lesson: DetailedLesson;
  progressMap: Record<string, SubLessonProgress>;
  onBack: () => void;
  onSelectSubLesson: (subLesson: SubLesson) => void;
  onMarkLessonComplete?: () => void;
}

export const LessonDetailView: React.FC<LessonDetailViewProps> = ({
  lesson,
  progressMap,
  onBack,
  onSelectSubLesson
}) => {
  const totalSubs = lesson.subLessons.length;
  const completedSubs = lesson.subLessons.filter((s) => progressMap[s.id]?.completed).length;
  const isLessonComplete = completedSubs === totalSubs && totalSubs > 0;
  const progressPercent = totalSubs > 0 ? Math.round((completedSubs / totalSubs) * 100) : 0;

  // Best WPM & Accuracy achieved in this lesson
  let lessonBestWpm = 0;
  let lessonBestAcc = 0;
  lesson.subLessons.forEach((s) => {
    const prog = progressMap[s.id];
    if (prog) {
      if (prog.bestWpm > lessonBestWpm) lessonBestWpm = prog.bestWpm;
      if (prog.bestAccuracy > lessonBestAcc) lessonBestAcc = prog.bestAccuracy;
    }
  });

  // Find first incomplete sublesson
  const nextIncompleteSub = lesson.subLessons.find((s) => !progressMap[s.id]?.completed) || lesson.subLessons[0];

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6">
      {/* Back button */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-xs font-semibold text-[var(--color-primary)] hover:underline flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Curriculum Overview</span>
        </button>

        <span className="text-xs font-mono text-[var(--text-sub)] uppercase">
          Lesson {lesson.order} of 10
        </span>
      </div>

      {/* Hero Lesson Header Card */}
      <Card3D glass className="p-6 sm:p-8 rounded-3xl border border-[var(--border-color)] shadow-lg flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[var(--color-primary)]/15 text-[var(--color-primary)] border border-[var(--color-primary)]/30">
                {lesson.tier} Tier
              </span>
              <span className="text-xs font-mono text-[var(--text-sub)]">
                {lesson.estimatedMinutes} Mins Estimated
              </span>
              {isLessonComplete && (
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Lesson Complete
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-[var(--text-main)] tracking-tight">
              {lesson.title}
            </h1>
            <p className="text-sm text-[var(--text-sub)] max-w-2xl">
              {lesson.description}
            </p>
          </div>

          {/* Quick Start Action Button */}
          <div className="flex flex-col sm:items-end gap-2 shrink-0">
            <Button3D
              variant="primary"
              size="lg"
              icon={<Play className="w-4 h-4 fill-current" />}
              onClick={() => onSelectSubLesson(nextIncompleteSub)}
            >
              {isLessonComplete ? 'Practice Lesson Again' : 'Continue Next Sublesson'}
            </Button3D>
            <span className="text-[11px] text-[var(--text-sub)] font-mono">
              {completedSubs} of {totalSubs} Sublessons Completed ({progressPercent}%)
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2.5 rounded-full bg-[var(--bg-subtle)] overflow-hidden border border-[var(--border-color)]">
          <div
            className="h-full bg-gradient-to-r from-[var(--color-primary)] to-emerald-400 transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Learning Objectives & Target Keys Deck */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[var(--border-color)]">
          {/* Objectives */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold uppercase text-[var(--text-main)] flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-[var(--color-primary)]" />
              Learning Objectives
            </span>
            <ul className="flex flex-col gap-1.5 text-xs text-[var(--text-sub)]">
              {lesson.objectives.map((obj, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[var(--color-primary)] font-bold">•</span>
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Keys & Fingers */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-bold uppercase text-[var(--text-main)]">Keys Introduced</span>
              <div className="flex flex-wrap items-center gap-1.5">
                {lesson.keysIntroduced.map((k, idx) => (
                  <kbd
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-color)] text-[var(--color-primary)] font-mono font-bold text-xs shadow-xs"
                  >
                    {k}
                  </kbd>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-semibold text-[var(--text-sub)] uppercase">Finger Placement</span>
              <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--text-sub)]">
                {lesson.fingersUsed.slice(0, 4).map((f, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded-md bg-[var(--bg-subtle)] font-mono text-[11px]">
                    {f.finger}: {f.keys.join(', ')}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card3D>

      {/* Sublessons List Grid */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[var(--text-main)] flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[var(--color-primary)]" />
            <span>Structured Sublessons ({lesson.subLessons.length})</span>
          </h2>
          <span className="text-xs text-[var(--text-sub)]">
            Click any sublesson to start practice
          </span>
        </div>

        <div className="flex flex-col gap-2.5">
          {lesson.subLessons.map((sub) => {
            const prog = progressMap[sub.id];
            const isCompleted = prog?.completed;

            return (
              <Card3D
                key={sub.id}
                onClick={() => onSelectSubLesson(sub)}
                className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer select-none flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isCompleted
                    ? 'border-emerald-500/30 bg-[var(--bg-surface)] hover:border-emerald-500/60'
                    : 'border-[var(--border-color)] bg-[var(--bg-surface)] hover:border-[var(--color-primary)]'
                }`}
              >
                <div className="flex items-start sm:items-center gap-3.5">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-mono font-bold text-xs ${
                      isCompleted
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-[var(--bg-subtle)] text-[var(--text-sub)] border border-[var(--border-color)]'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : `${lesson.order}.${sub.order}`}
                  </div>

                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-[var(--text-main)] hover:text-[var(--color-primary)] transition-colors">
                        {sub.title}
                      </h3>
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-[var(--bg-subtle)] text-[var(--text-sub)] border border-[var(--border-color)]">
                        {sub.type.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-sub)] line-clamp-1">
                      {sub.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[var(--border-color)]">
                  {/* Performance stats if completed */}
                  {isCompleted && prog ? (
                    <div className="flex items-center gap-4 font-mono text-center">
                      <div>
                        <span className="text-[9px] uppercase text-[var(--text-sub)] block">Best</span>
                        <span className="text-xs font-bold text-[var(--color-primary)]">{prog.bestWpm} WPM</span>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase text-[var(--text-sub)] block">Acc</span>
                        <span className="text-xs font-bold text-emerald-400">{prog.bestAccuracy}%</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 text-xs text-[var(--text-sub)] font-mono">
                      <span>Goal: {sub.minWpm} WPM</span>
                      <span>Min Acc: {sub.minAccuracy}%</span>
                    </div>
                  )}

                  <Button3D
                    variant={isCompleted ? 'secondary' : 'primary'}
                    size="sm"
                    icon={<Play className="w-3.5 h-3.5 fill-current" />}
                  >
                    {isCompleted ? 'Practice Again' : 'Start Sublesson'}
                  </Button3D>
                </div>
              </Card3D>
            );
          })}
        </div>
      </div>
    </div>
  );
};
