import React, { useState, useEffect, useCallback } from 'react';
import {
  BookOpen,
  GraduationCap,
  Play,
  RotateCcw,
  CheckCircle2,
  Zap,
  Target,
  Clock,
  Sparkles,
  ShieldAlert
} from 'lucide-react';
import {
  DETAILED_LESSONS,
  getLessonById,
  getNextSubLesson,
  generateAdaptivePracticeText
} from '../lib/learnCurriculum';
import type { DetailedLesson, SubLesson, SubLessonProgress, LearnStats } from '../types';
import { storage } from '../lib/storage';
import { LessonDetailView } from '../components/learn/LessonDetailView';
import { SubLessonPlayer } from '../components/learn/SubLessonPlayer';
import { Button3D } from '../components/ui3d/Button3D';
import { Card3D } from '../components/ui3d/Card3D';
import { ScrollReveal } from '../components/ui3d/ScrollReveal';

export const LearnPage: React.FC = () => {

  // Navigation View State
  const [activeView, setActiveView] = useState<'dashboard' | 'lesson-detail' | 'sublesson-player'>('dashboard');
  const [selectedLesson, setSelectedLesson] = useState<DetailedLesson | null>(null);
  const [selectedSubLesson, setSelectedSubLesson] = useState<SubLesson | null>(null);

  // Persistence State
  const [subProgressMap, setSubProgressMap] = useState<Record<string, SubLessonProgress>>({});
  const [overviewStats, setOverviewStats] = useState<LearnStats | null>(null);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  // Load real learning data from storage
  const loadProgressData = useCallback(async () => {
    const [subProg, overview] = await Promise.all([
      storage.getSubLessonProgress(),
      storage.getLearnOverviewStats()
    ]);
    setSubProgressMap(subProg);
    setOverviewStats(overview);
  }, []);

  useEffect(() => {
    loadProgressData();
  }, [loadProgressData]);

  // Find user's active/current sublesson (first incomplete sublesson)
  const findContinueSubLesson = (): { lesson: DetailedLesson; subLesson: SubLesson } => {
    for (const lesson of DETAILED_LESSONS) {
      for (const sub of lesson.subLessons) {
        if (!subProgressMap[sub.id]?.completed) {
          return { lesson, subLesson: sub };
        }
      }
    }
    // All completed, fallback to first sublesson
    return { lesson: DETAILED_LESSONS[0], subLesson: DETAILED_LESSONS[0].subLessons[0] };
  };

  const currentContinue = findContinueSubLesson();

  // Handlers for entering lesson or sublesson
  const handleOpenLesson = (lesson: DetailedLesson) => {
    setSelectedLesson(lesson);
    setActiveView('lesson-detail');
  };

  const handleStartSubLesson = (sub: SubLesson, lesson?: DetailedLesson) => {
    const parentLesson = lesson || selectedLesson || getLessonById(sub.lessonId) || DETAILED_LESSONS[0];
    setSelectedLesson(parentLesson);
    setSelectedSubLesson(sub);
    setActiveView('sublesson-player');
  };

  const handleNextSubLesson = () => {
    if (!selectedSubLesson) return;
    const next = getNextSubLesson(selectedSubLesson.id);
    if (next) {
      setSelectedLesson(next.lesson);
      setSelectedSubLesson(next.subLesson);
    } else {
      // Reached the end of the entire course!
      setActiveView('dashboard');
    }
  };

  const handleSubLessonCompleted = async (_progress: SubLessonProgress) => {
    // Reload live statistics and map
    await loadProgressData();
  };

  // Launch targeted practice for mistakes
  const handlePracticeMistakes = (mistakeKeys: string[], mistakeWords: string[]) => {
    const adaptiveText = generateAdaptivePracticeText(mistakeKeys, mistakeWords);
    const customMistakeSub: SubLesson = {
      id: `mistake-drill-${Date.now()}`,
      lessonId: selectedLesson?.id || 'lesson-1',
      order: 99,
      title: 'Targeted Mistake Practice Drill',
      type: 'accuracy_challenge',
      description: `Targeting your identified weakest keys: ${mistakeKeys.join(', ')}`,
      targetKeys: mistakeKeys,
      learnedKeys: mistakeKeys,
      targetFinger: 'Identified Weakest Fingers',
      targetFingerCode: 'th',
      exerciseText: adaptiveText,
      durationSeconds: 120,
      minAccuracy: 95,
      minWpm: 15,
      tips: ['Focus deliberately on the keys you recently mistyped']
    };

    setSelectedSubLesson(customMistakeSub);
    setActiveView('sublesson-player');
  };

  // Reset learning progress handler
  const handleConfirmReset = async () => {
    await storage.resetLearnProgress();
    setIsResetModalOpen(false);
    await loadProgressData();
    setActiveView('dashboard');
  };

  // Format seconds into minutes & seconds
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    if (m === 0) return `${s}s`;
    return `${m}m ${s > 0 ? `${s}s` : ''}`;
  };

  // 1. ACTIVE SUBLESSON TYPING ENVIRONMENT VIEW
  if (activeView === 'sublesson-player' && selectedSubLesson && selectedLesson) {
    return (
      <div className="py-6 sm:py-10 px-4">
        <SubLessonPlayer
          lesson={selectedLesson}
          subLesson={selectedSubLesson}
          onBack={() => setActiveView('lesson-detail')}
          onNextSubLesson={handleNextSubLesson}
          onPracticeMistakes={handlePracticeMistakes}
          onSubLessonCompleted={handleSubLessonCompleted}
        />
      </div>
    );
  }

  // 2. LESSON DETAIL VIEW (Showing all sub-lessons)
  if (activeView === 'lesson-detail' && selectedLesson) {
    return (
      <div className="py-6 sm:py-10 px-4">
        <LessonDetailView
          lesson={selectedLesson}
          progressMap={subProgressMap}
          onBack={() => setActiveView('dashboard')}
          onSelectSubLesson={(sub) => handleStartSubLesson(sub, selectedLesson)}
        />
      </div>
    );
  }

  // 3. MAIN LEARN DASHBOARD & CURRICULUM OVERVIEW
  const coursePercent = overviewStats?.courseProgressPercent || 0;
  const completedSubsCount = overviewStats?.completedSubLessonsCount || 0;
  const totalSubsCount = overviewStats?.totalSubLessonsCount || 64;
  const totalPracticeTime = overviewStats?.totalLearningTimeSeconds || 0;
  const bestWpm = overviewStats?.bestOverallWpm || 0;
  const bestAcc = overviewStats?.bestOverallAccuracy || 0;
  const weakestKeys = overviewStats?.weakestKeys || [];

  return (
    <div className="w-full max-w-6xl mx-auto py-6 sm:py-10 px-4 flex flex-col gap-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-[var(--color-primary)] font-bold text-xs uppercase tracking-wider">
            <GraduationCap className="w-4 h-4" />
            <span>Structured Touch-Typing Academy</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[var(--text-main)] tracking-tight">
            Master Every Key from Scratch
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-sub)] max-w-2xl">
            A 10-lesson structured curriculum designed by typing educators to build independent finger coordination, proper hand placement, and lightning muscle memory.
          </p>
        </div>

        {/* Reset Progress Action */}
        <button
          onClick={() => setIsResetModalOpen(true)}
          className="text-xs font-semibold text-[var(--text-sub)] hover:text-rose-400 flex items-center gap-1.5 transition-colors self-start sm:self-auto cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Course Progress</span>
        </button>
      </div>

      {/* Real Statistics Deck */}
      <ScrollReveal animation="fadeUp">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <Card3D className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-xs">
            <div className="flex items-center gap-2 text-[var(--color-primary)] mb-1">
              <Target className="w-4 h-4" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-sub)]">Course Progress</span>
            </div>
            <div className="flex items-baseline gap-1 font-mono">
              <span className="text-2xl sm:text-3xl font-black text-[var(--text-main)]">{coursePercent}%</span>
              <span className="text-xs text-[var(--text-sub)] font-medium">({completedSubsCount}/{totalSubsCount})</span>
            </div>
          </Card3D>

          <Card3D className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-xs">
            <div className="flex items-center gap-2 text-amber-400 mb-1">
              <Zap className="w-4 h-4" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-sub)]">Best Speed</span>
            </div>
            <div className="flex items-baseline gap-1 font-mono">
              <span className="text-2xl sm:text-3xl font-black text-[var(--color-primary)]">{bestWpm}</span>
              <span className="text-xs text-[var(--text-sub)] font-medium">WPM</span>
            </div>
          </Card3D>

          <Card3D className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-xs">
            <div className="flex items-center gap-2 text-emerald-400 mb-1">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-sub)]">Avg Accuracy</span>
            </div>
            <div className="flex items-baseline gap-1 font-mono">
              <span className="text-2xl sm:text-3xl font-black text-emerald-400">{bestAcc > 0 ? `${bestAcc}%` : '—'}</span>
            </div>
          </Card3D>

          <Card3D className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-xs">
            <div className="flex items-center gap-2 text-purple-400 mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-sub)]">Practice Time</span>
            </div>
            <div className="flex items-baseline gap-1 font-mono">
              <span className="text-2xl sm:text-3xl font-black text-[var(--text-main)]">
                {totalPracticeTime > 0 ? formatTime(totalPracticeTime) : '0m'}
              </span>
            </div>
          </Card3D>
        </div>
      </ScrollReveal>

      {/* Hero "Continue Learning" & Adaptive Mistakes Card */}
      <ScrollReveal animation="fadeScale" delayMs={100}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Continue Learning Card */}
          <Card3D
            glass
            className="lg:col-span-2 p-6 sm:p-7 rounded-3xl border border-[var(--border-color)] shadow-lg flex flex-col justify-between gap-5 relative overflow-hidden"
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[var(--color-primary)]/15 text-[var(--color-primary)] border border-[var(--color-primary)]/30">
                  Continue Where You Left Off
                </span>
                <span className="text-xs text-[var(--text-sub)] font-mono">
                  Lesson {currentContinue.lesson.order}
                </span>
              </div>

              <h2 className="text-2xl font-black text-[var(--text-main)] tracking-tight">
                {currentContinue.subLesson.title}
              </h2>
              <p className="text-xs sm:text-sm text-[var(--text-sub)]">
                {currentContinue.subLesson.description}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[var(--border-color)]">
              <div className="flex items-center gap-3 font-mono text-xs text-[var(--text-sub)]">
                <span>Goal: <strong className="text-[var(--text-main)]">{currentContinue.subLesson.minWpm} WPM</strong></span>
                <span>•</span>
                <span>Min Acc: <strong className="text-[var(--text-main)]">{currentContinue.subLesson.minAccuracy}%</strong></span>
                <span>•</span>
                <span>Target: <strong className="text-[var(--color-primary)]">{currentContinue.subLesson.targetFinger}</strong></span>
              </div>

              <Button3D
                variant="primary"
                size="md"
                icon={<Play className="w-4 h-4 fill-current" />}
                onClick={() => handleStartSubLesson(currentContinue.subLesson, currentContinue.lesson)}
              >
                Continue Sublesson
              </Button3D>
            </div>
          </Card3D>

          {/* Adaptive Practice & Weakest Keys Card */}
          <Card3D className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-md flex flex-col justify-between gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-[var(--text-sub)] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Adaptive Practice
                </span>
                {weakestKeys.length > 0 && (
                  <span className="text-[10px] font-mono text-rose-400 font-bold">
                    {weakestKeys.length} Weak Keys
                  </span>
                )}
              </div>

              <h3 className="text-base font-bold text-[var(--text-main)]">
                Practice My Weaknesses
              </h3>
              <p className="text-xs text-[var(--text-sub)]">
                {weakestKeys.length > 0
                  ? 'Target your real mistyped keys and high-error combinations from past sessions.'
                  : 'Complete lessons to automatically generate tailored exercises for your weakest keys.'}
              </p>
            </div>

            {/* Weakest keys badges */}
            {weakestKeys.length > 0 ? (
              <div className="flex flex-wrap items-center gap-1.5 py-1">
                {weakestKeys.map((w, idx) => (
                  <div
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 font-mono text-xs flex items-center gap-1.5"
                  >
                    <kbd className="font-bold">{w.key}</kbd>
                    <span className="text-[10px] opacity-80">{w.errorRate}% err</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-2 text-xs font-mono text-[var(--text-sub)]">
                No weak keys recorded yet
              </div>
            )}

            <Button3D
              variant="outline"
              size="sm"
              icon={<Target className="w-3.5 h-3.5 text-amber-400" />}
              onClick={() => handlePracticeMistakes(weakestKeys.map((k) => k.key), [])}
            >
              Practice Identified Mistakes
            </Button3D>
          </Card3D>
        </div>
      </ScrollReveal>

      {/* The 10 Major Structured Lessons Curriculum Grid */}
      <ScrollReveal animation="depthSettle" delayMs={150}>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
            <h2 className="text-lg font-bold text-[var(--text-main)] flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[var(--color-primary)]" />
              <span>Complete Course Curriculum (10 Major Lessons)</span>
            </h2>
            <span className="text-xs font-mono text-[var(--text-sub)]">
              {overviewStats?.completedLessonsCount || 0} of 10 Lessons Finished
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {DETAILED_LESSONS.map((lesson) => {
              const subs = lesson.subLessons;
              const completedCount = subs.filter((s) => subProgressMap[s.id]?.completed).length;
              const isCompleted = completedCount === subs.length && subs.length > 0;
              const lessonPercent = subs.length > 0 ? Math.round((completedCount / subs.length) * 100) : 0;

              // Highest WPM in this lesson
              let maxLessonWpm = 0;
              subs.forEach((s) => {
                const p = subProgressMap[s.id];
                if (p && p.bestWpm > maxLessonWpm) maxLessonWpm = p.bestWpm;
              });

              return (
                <Card3D
                  key={lesson.id}
                  onClick={() => handleOpenLesson(lesson)}
                  className={`group p-6 rounded-3xl border transition-all cursor-pointer select-none flex flex-col justify-between gap-5 ${
                    isCompleted
                      ? 'border-emerald-500/40 bg-[var(--bg-surface)] hover:border-emerald-500/70'
                      : 'border-[var(--border-color)] bg-[var(--bg-surface)] hover:border-[var(--color-primary)]'
                  }`}
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-[var(--color-primary)]">
                          Lesson {lesson.order}
                        </span>
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-[var(--bg-subtle)] text-[var(--text-sub)] border border-[var(--border-color)]">
                          {lesson.tier}
                        </span>
                      </div>

                      {isCompleted ? (
                        <span className="flex items-center gap-1 text-emerald-400 font-bold text-xs bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Completed
                        </span>
                      ) : (
                        <span className="text-xs font-mono text-[var(--text-sub)] font-medium">
                          {completedCount}/{subs.length} sublessons
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-[var(--text-main)] group-hover:text-[var(--color-primary)] transition-colors">
                      {lesson.title}
                    </h3>
                    <p className="text-xs text-[var(--text-sub)] line-clamp-2">
                      {lesson.description}
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 pt-3 border-t border-[var(--border-color)]">
                    {/* Progress bar */}
                    <div className="w-full h-1.5 rounded-full bg-[var(--bg-subtle)] overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 rounded-full ${
                          isCompleted ? 'bg-emerald-400' : 'bg-[var(--color-primary)]'
                        }`}
                        style={{ width: `${lessonPercent}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      {/* Keys tags */}
                      <div className="flex items-center gap-1">
                        {lesson.keysIntroduced.slice(0, 6).map((k, idx) => (
                          <kbd
                            key={idx}
                            className="px-2 py-0.5 rounded bg-[var(--bg-subtle)] text-[var(--text-main)] font-mono text-[11px] border border-[var(--border-color)]"
                          >
                            {k}
                          </kbd>
                        ))}
                        {lesson.keysIntroduced.length > 6 && (
                          <span className="text-[10px] text-[var(--text-sub)] font-mono">
                            +{lesson.keysIntroduced.length - 6} more
                          </span>
                        )}
                      </div>

                      <span className="font-semibold text-xs text-[var(--color-primary)] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        {isCompleted ? 'Review' : 'View Sublessons'} →
                      </span>
                    </div>
                  </div>
                </Card3D>
              );
            })}
          </div>
        </div>
      </ScrollReveal>

      {/* Confirmation Modal for Resetting Learn Progress Only */}
      {isResetModalOpen && (
        <div className="fixed inset-0 z-50 bg-[var(--bg-main)]/80 backdrop-blur-md flex items-center justify-center p-4">
          <Card3D className="w-full max-w-md p-6 rounded-3xl bg-[var(--bg-surface)] border-2 border-rose-500/40 shadow-2xl flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
                <ShieldAlert className="w-7 h-7" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-lg font-bold text-[var(--text-main)]">
                  Reset Course Progress?
                </h3>
                <span className="text-xs text-[var(--text-sub)]">
                  This action cannot be undone.
                </span>
              </div>
            </div>

            <p className="text-xs text-[var(--text-sub)] leading-relaxed">
              This will reset your completed sublessons, course percentage, and personal bests in the <strong>Learn Academy</strong>. Your general typing history, themes, and settings will remain completely intact.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button3D
                variant="ghost"
                size="sm"
                onClick={() => setIsResetModalOpen(false)}
              >
                Cancel
              </Button3D>

              <Button3D
                variant="danger"
                size="sm"
                onClick={handleConfirmReset}
              >
                Yes, Reset Learning Progress
              </Button3D>
            </div>
          </Card3D>
        </div>
      )}
    </div>
  );
};
