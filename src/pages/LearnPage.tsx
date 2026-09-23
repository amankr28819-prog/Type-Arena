import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Star,
  Award,
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import { COURSE_LESSONS } from '../lib/courses';
import type { CourseLesson, CourseProgress } from '../types';
import { storage } from '../lib/storage';
import { useSettings } from '../context/SettingsContext';
import { useTypingEngine } from '../hooks/useTypingEngine';
import { TypingArea } from '../components/typing/TypingArea';
import { VirtualKeyboard } from '../components/typing/VirtualKeyboard';
import { TiltCard } from '../components/ui/TiltCard';

export const LearnPage: React.FC = () => {
  const { settings } = useSettings();
  const [selectedLesson, setSelectedLesson] = useState<CourseLesson | null>(null);
  const [progressMap, setProgressMap] = useState<Record<string, CourseProgress>>({});
  const [activeTier, setActiveTier] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');

  // Key tracking for virtual keyboard in lesson
  const [currentKey, setCurrentKey] = useState('');
  const [nextKey, setNextKey] = useState('');
  const [isKeyError, setIsKeyError] = useState(false);
  const [isFocused, setIsFocused] = useState(true);

  // Lesson results state
  const [lessonFinished, setLessonFinished] = useState(false);
  const [lastStats, setLastStats] = useState<{ wpm: number; accuracy: number; passed: boolean } | null>(null);

  useEffect(() => {
    storage.getCourseProgress().then(setProgressMap);
  }, [lessonFinished]);

  const handleLessonComplete = (result: any) => {
    if (!selectedLesson) return;

    const passed =
      result.wpm >= selectedLesson.minWpm &&
      result.accuracy >= selectedLesson.minAccuracy;

    // Calculate stars: 1 star = passed, 2 stars = +10 WPM, 3 stars = +20 WPM & 98% Acc
    let stars = 0;
    if (passed) {
      stars = 1;
      if (result.wpm >= selectedLesson.minWpm + 8 && result.accuracy >= 95) stars = 2;
      if (result.wpm >= selectedLesson.minWpm + 15 && result.accuracy >= 98) stars = 3;

      const progress: CourseProgress = {
        lessonId: selectedLesson.id,
        completed: true,
        stars,
        bestWpm: Math.max(result.wpm, progressMap[selectedLesson.id]?.bestWpm || 0),
        bestAccuracy: Math.max(result.accuracy, progressMap[selectedLesson.id]?.bestAccuracy || 0),
        timestamp: Date.now()
      };

      storage.saveCourseProgress(progress);
    }

    setLastStats({ wpm: result.wpm, accuracy: result.accuracy, passed });
    setLessonFinished(true);
  };

  const engine = useTypingEngine({
    initialText: selectedLesson ? selectedLesson.exerciseText : '',
    mode: 'custom',
    timeOption: 30,
    customTime: 30,
    wordOption: 25,
    customWords: 25,
    settings: {
      ...settings,
      difficulty: 'normal',
      disableBackspace: false
    },
    onTestComplete: handleLessonComplete
  });

  const handleSelectLesson = (lesson: CourseLesson) => {
    setSelectedLesson(lesson);
    setLessonFinished(false);
    setLastStats(null);
    engine.resetTest();
    setIsFocused(true);
  };

  const handleNextLesson = () => {
    if (!selectedLesson) return;
    const currentIndex = COURSE_LESSONS.findIndex((l) => l.id === selectedLesson.id);
    if (currentIndex >= 0 && currentIndex < COURSE_LESSONS.length - 1) {
      const next = COURSE_LESSONS[currentIndex + 1];
      setActiveTier(next.tier);
      handleSelectLesson(next);
    } else {
      setSelectedLesson(null);
    }
  };

  const filteredLessons = COURSE_LESSONS.filter((l) => l.tier === activeTier);

  return (
    <div className="w-full max-w-5xl mx-auto py-6 sm:py-10 px-4">
      {/* If a lesson is actively open */}
      {selectedLesson ? (
        <div className="flex flex-col gap-6">
          {/* Lesson Header Navigation */}
          <div className="flex items-center justify-between pb-4 border-b border-[var(--border-color)]">
            <button
              onClick={() => setSelectedLesson(null)}
              className="text-xs font-semibold text-[var(--color-primary)] hover:underline flex items-center gap-1"
            >
              ← Back to Course Curriculum
            </button>
            <div className="flex items-center gap-4 text-xs font-mono text-[var(--text-sub)]">
              <span>Goal: {selectedLesson.minWpm} WPM</span>
              <span>Min Accuracy: {selectedLesson.minAccuracy}%</span>
            </div>
          </div>

          {/* Lesson Title & Finger Guidance Card */}
          <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-md">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
              <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-main)] flex items-center gap-2">
                <span>{selectedLesson.title}</span>
                <span className="text-xs font-normal uppercase tracking-wider px-2 py-0.5 rounded-full bg-[var(--color-primary)]/15 text-[var(--color-primary)]">
                  {selectedLesson.tier}
                </span>
              </h2>
              {progressMap[selectedLesson.id]?.completed && (
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: progressMap[selectedLesson.id].stars }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
              )}
            </div>
            <p className="text-sm text-[var(--text-sub)] mb-4">{selectedLesson.description}</p>

            {/* Target Keys & Finger Placement Recommendation */}
            <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-[var(--border-color)] text-xs">
              <span className="font-semibold text-[var(--text-main)]">Target Keys:</span>
              <div className="flex flex-wrap items-center gap-1.5">
                {selectedLesson.targetKeys.map((k, idx) => (
                  <kbd
                    key={idx}
                    className="px-2 py-1 rounded-md bg-[var(--bg-subtle)] border border-[var(--border-color)] text-[var(--color-primary)] font-mono font-bold"
                  >
                    {k}
                  </kbd>
                ))}
              </div>
            </div>
          </div>

          {/* Lesson Completion Modal / Status */}
          {lessonFinished && lastStats && (
            <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-xl animate-in fade-in zoom-in-95">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      lastStats.passed
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-rose-500/20 text-rose-400'
                    }`}
                  >
                    {lastStats.passed ? (
                      <Award className="w-7 h-7" />
                    ) : (
                      <RotateCcw className="w-7 h-7" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[var(--text-main)]">
                      {lastStats.passed
                        ? 'Lesson Completed Successfully!'
                        : 'Lesson Incomplete — Keep Practicing!'}
                    </h3>
                    <p className="text-xs text-[var(--text-sub)]">
                      {lastStats.passed
                        ? 'Your muscle memory is locking in. Proceed to the next exercise!'
                        : `Target requirement: ${selectedLesson.minWpm} WPM and ${selectedLesson.minAccuracy}% accuracy.`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-center font-mono">
                  <div>
                    <span className="block text-[10px] text-[var(--text-sub)] uppercase">WPM</span>
                    <span className="text-2xl font-extrabold text-[var(--color-primary)]">
                      {lastStats.wpm}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-[var(--text-sub)] uppercase">Accuracy</span>
                    <span className="text-2xl font-extrabold text-[var(--color-correct)]">
                      {lastStats.accuracy}%
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setLessonFinished(false);
                      engine.resetTest();
                    }}
                    className="px-4 py-2 rounded-xl bg-[var(--bg-subtle)] text-[var(--text-main)] text-xs font-semibold hover:bg-[var(--bg-surface)] border border-[var(--border-color)]"
                  >
                    Retry Lesson
                  </button>
                  {lastStats.passed && (
                    <button
                      onClick={handleNextLesson}
                      className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[var(--color-primary)] text-[var(--bg-main)] text-xs font-bold shadow-md shadow-[var(--color-primary)]/20"
                    >
                      <span>Next Lesson</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Typing Area for the Lesson */}
          {!lessonFinished && (
            <TypingArea
              words={engine.words}
              currentWordIndex={engine.currentWordIndex}
              currentInput={engine.currentInput}
              wordHistory={engine.wordHistory}
              caretStyle={settings.caretStyle}
              smoothCaret={settings.smoothCaret}
              fontSize={settings.fontSize}
              fontFamily={settings.fontFamily}
              isFocused={isFocused}
              onFocus={() => setIsFocused(true)}
              onKeyDown={engine.handleKeyDown}
              onKeyAnalysis={(curr, nxt, isErr) => {
                setCurrentKey(curr);
                setNextKey(nxt);
                setIsKeyError(isErr);
              }}
            />
          )}

          {/* Interactive Keyboard with Visual Finger Guidance */}
          <VirtualKeyboard
            currentKey={currentKey}
            nextKey={nextKey}
            isError={isKeyError}
            showFingerGuides={true}
          />
        </div>
      ) : (
        /* Course Curriculum Overview Screen */
        <div className="flex flex-col gap-8">
          {/* Header */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-[var(--color-primary)] font-bold text-xs uppercase tracking-wider">
              <BookOpen className="w-4 h-4" />
              <span>Structured Touch-Typing Curriculum</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-main)] tracking-tight">
              Master the Keyboard from Scratch
            </h1>
            <p className="text-sm text-[var(--text-sub)] max-w-2xl">
              Follow systematic lessons designed to build finger independence, optimal posture, and instantaneous muscle memory without glancing at the keys.
            </p>
          </div>

          {/* Tier Selection Tabs */}
          <div className="flex items-center gap-2 border-b border-[var(--border-color)] pb-3">
            {[
              { id: 'beginner', title: 'Beginner', desc: 'Home row & basic finger reach' },
              { id: 'intermediate', title: 'Intermediate', desc: 'Bigrams, vocabulary & speed' },
              { id: 'advanced', title: 'Advanced', desc: 'Code syntax & marathon pacing' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTier(t.id as any)}
                className={`flex flex-col text-left px-4 py-2.5 rounded-2xl transition-all ${
                  activeTier === t.id
                    ? 'bg-[var(--color-primary)] text-[var(--bg-main)] font-bold shadow-md'
                    : 'text-[var(--text-sub)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface)]'
                }`}
              >
                <span className="text-sm font-bold">{t.title}</span>
                <span className={`text-[10px] ${activeTier === t.id ? 'opacity-90' : 'text-[var(--text-sub)]'}`}>
                  {t.desc}
                </span>
              </button>
            ))}
          </div>

          {/* Lessons List Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredLessons.map((lesson) => {
              const prog = progressMap[lesson.id];
              const isCompleted = prog?.completed;

              return (
                <TiltCard
                  key={lesson.id}
                  maxTilt={6}
                  onClick={() => handleSelectLesson(lesson)}
                  className={`
                    group p-5 border transition-all cursor-pointer select-none flex flex-col justify-between gap-4 card-3d
                    ${
                      isCompleted
                        ? 'bg-[var(--bg-surface)] border-[var(--border-color)] hover:border-[var(--color-primary)]/60'
                        : 'bg-[var(--bg-surface)] border-[var(--border-color)] hover:border-[var(--color-primary)]'
                    }
                  `}
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-mono font-bold text-[var(--color-primary)]">
                        Lesson {lesson.order}
                      </span>
                      {isCompleted ? (
                        <div className="flex items-center gap-1 text-amber-400">
                          {Array.from({ length: prog.stars || 1 }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                          ))}
                        </div>
                      ) : (
                        <span className="text-[11px] text-[var(--text-sub)] font-medium">
                          {lesson.minWpm} WPM goal
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-[var(--text-main)] group-hover:text-[var(--color-primary)] transition-colors">
                      {lesson.title}
                    </h3>
                    <p className="text-xs text-[var(--text-sub)] line-clamp-2">
                      {lesson.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[var(--border-color)] text-xs">
                    <div className="flex items-center gap-1">
                      {lesson.targetKeys.slice(0, 5).map((k, i) => (
                        <span
                          key={i}
                          className="px-1.5 py-0.5 rounded bg-[var(--bg-subtle)] text-[var(--text-main)] font-mono text-[11px]"
                        >
                          {k}
                        </span>
                      ))}
                      {lesson.targetKeys.length > 5 && (
                        <span className="text-[10px] text-[var(--text-sub)]">+more</span>
                      )}
                    </div>

                    <span className="text-xs font-semibold text-[var(--color-primary)] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      {isCompleted ? 'Practice Again' : 'Start Lesson'} →
                    </span>
                  </div>
                </TiltCard>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
