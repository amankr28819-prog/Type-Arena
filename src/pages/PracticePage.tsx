import React, { useState, useEffect, useCallback } from 'react';
import {
  Target,
  Sparkles,
  Zap,
  TrendingDown,
  RotateCcw,
  CheckCircle2,
  Play
} from 'lucide-react';
import { storage } from '../lib/storage';
import { generateTestText } from '../lib/generator';
import type { KeyAnalytics, BigramAnalytics, TestResult } from '../types';
import { useSettings } from '../context/SettingsContext';
import { useTypingEngine } from '../hooks/useTypingEngine';
import { useRestartShortcut } from '../hooks/useRestartShortcut';
import { TypingArea } from '../components/typing/TypingArea';
import { VirtualKeyboard } from '../components/typing/VirtualKeyboard';

interface PracticePageProps {
  initialMistakeKeys?: string[];
  initialMistakeWords?: string[];
}

export const PracticePage: React.FC<PracticePageProps> = ({
  initialMistakeKeys = [],
  initialMistakeWords = []
}) => {
  const { settings } = useSettings();
  const [history, setHistory] = useState<TestResult[]>([]);
  const [keyStats, setKeyStats] = useState<Record<string, KeyAnalytics>>({});
  const [bigramStats, setBigramStats] = useState<Record<string, BigramAnalytics>>({});

  // Active practice drill state
  const [activeDrillTitle, setActiveDrillTitle] = useState<string | null>(null);
  const [activeDrillText, setActiveDrillText] = useState<string>('');
  const [drillCompleted, setDrillCompleted] = useState<boolean>(false);
  const [drillResult, setDrillResult] = useState<{ wpm: number; accuracy: number } | null>(null);

  // Key tracking for keyboard
  const [currentKey, setCurrentKey] = useState('');
  const [nextKey, setNextKey] = useState('');
  const [isKeyError, setIsKeyError] = useState(false);
  const [isFocused, setIsFocused] = useState(true);

  useEffect(() => {
    storage.getHistory().then(setHistory);
    storage.getKeyStats().then(setKeyStats);
    storage.getBigramStats().then(setBigramStats);
  }, []);

  // Launch initial mistakes drill if navigated directly from ResultModal
  useEffect(() => {
    if (initialMistakeKeys.length > 0 || initialMistakeWords.length > 0) {
      launchMistakesDrill(initialMistakeKeys, initialMistakeWords);
    }
  }, [initialMistakeKeys, initialMistakeWords]);

  // Extract weak keys (error rate > 5% and at least 3 presses)
  const weakKeys = Object.values(keyStats)
    .filter((k) => k.totalPresses >= 3 && k.errorRate > 0)
    .sort((a, b) => b.errorRate - a.errorRate)
    .slice(0, 8);

  // Extract slow bigrams (longest latency)
  const slowBigrams = Object.values(bigramStats)
    .filter((b) => b.count >= 2)
    .sort((a, b) => b.avgLatencyMs - a.avgLatencyMs)
    .slice(0, 6);

  // Gather recent mistakes from last 5 tests
  const recentMistakeKeys = Array.from(
    new Set(history.slice(0, 5).flatMap((h) => h.mistakes || []))
  );
  const recentMistakeWords = Array.from(
    new Set(history.slice(0, 5).flatMap((h) => h.mistypedWords || []))
  );

  const launchMistakesDrill = (keys: string[], words: string[]) => {
    const drillText = generateTestText({
      mode: 'words',
      wordOption: 25,
      mistakeKeys: keys.length > 0 ? keys : ['e', 't', 'a', 'o'],
      mistakeWords: words
    });
    setActiveDrillTitle('Targeted Mistakes Drill');
    setActiveDrillText(drillText);
    setDrillCompleted(false);
    setDrillResult(null);
    engine.resetTest();
    setIsFocused(true);
  };

  const launchAdaptiveDrill = (title: string, options: any) => {
    const drillText = generateTestText(options);
    setActiveDrillTitle(title);
    setActiveDrillText(drillText);
    setDrillCompleted(false);
    setDrillResult(null);
    engine.resetTest();
    setIsFocused(true);
  };

  const handleDrillComplete = (result: TestResult) => {
    setDrillResult({ wpm: result.wpm, accuracy: result.accuracy });
    setDrillCompleted(true);
  };

  const engine = useTypingEngine({
    initialText: activeDrillText,
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
    onTestComplete: handleDrillComplete
  });

  const handleRestartDrill = useCallback(() => {
    setDrillCompleted(false);
    setDrillResult(null);
    engine.resetTest();
    setIsFocused(true);
  }, [engine]);

  useRestartShortcut({
    onRestart: handleRestartDrill,
    enabled: Boolean(activeDrillTitle && activeDrillText)
  });

  return (
    <div className="w-full max-w-5xl mx-auto py-6 sm:py-10 px-4">
      {/* If a practice drill is currently active */}
      {activeDrillTitle && activeDrillText ? (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between pb-4 border-b border-[var(--border-color)]">
            <button
              onClick={() => {
                setActiveDrillTitle(null);
                setActiveDrillText('');
              }}
              className="text-xs font-semibold text-[var(--color-primary)] hover:underline flex items-center gap-1"
            >
              ← Back to Practice Hub
            </button>
            <span className="text-xs font-mono text-[var(--text-sub)]">
              Drill Mode • Dynamic Generation
            </span>
          </div>

          <div className="p-5 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-[var(--text-main)] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[var(--color-primary)]" />
                {activeDrillTitle}
              </h2>
              <p className="text-xs text-[var(--text-sub)] mt-1">
                Targeting your specific weaknesses to eliminate micro-hesitations and build muscle reflex.
              </p>
            </div>
            <button
              onClick={() => {
                setDrillCompleted(false);
                engine.resetTest();
              }}
              className="p-2 rounded-xl bg-[var(--bg-subtle)] text-[var(--text-sub)] hover:text-[var(--text-main)] border border-[var(--border-color)]"
              title="Restart Drill"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {drillCompleted && drillResult && (
            <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-emerald-500/30 shadow-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                <div>
                  <h3 className="text-base font-bold text-[var(--text-main)]">
                    Drill Finished!
                  </h3>
                  <p className="text-xs text-[var(--text-sub)]">
                    Your key accuracy and cadence have been logged.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-6 font-mono">
                <div>
                  <span className="block text-[10px] text-[var(--text-sub)] uppercase">WPM</span>
                  <span className="text-2xl font-bold text-[var(--color-primary)]">
                    {drillResult.wpm}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] text-[var(--text-sub)] uppercase">Accuracy</span>
                  <span className="text-2xl font-bold text-[var(--color-correct)]">
                    {drillResult.accuracy}%
                  </span>
                </div>
              </div>
            </div>
          )}

          {!drillCompleted && (
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

          <VirtualKeyboard
            currentKey={currentKey}
            nextKey={nextKey}
            isError={isKeyError}
            showFingerGuides={true}
            onKeyPress={(key) => {
              engine.handleKeyDown({
                key,
                preventDefault: () => {},
                stopPropagation: () => {}
              } as unknown as React.KeyboardEvent);
            }}
          />
        </div>
      ) : (
        /* Practice Hub Overview */
        <div className="flex flex-col gap-8">
          <div>
            <div className="flex items-center gap-2 text-[var(--color-primary)] font-bold text-xs uppercase tracking-wider mb-2">
              <Target className="w-4 h-4" />
              <span>Personalized Adaptive Training</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-main)] tracking-tight">
              Target Weaknesses & Erase Mistakes
            </h1>
            <p className="text-sm text-[var(--text-sub)] max-w-2xl mt-1">
              Every keystroke you type is analyzed in real time. We automatically locate your slowest fingers, mistyped keys, and stumbling words to construct laser-focused practice drills.
            </p>
          </div>

          {/* Primary Action Card: Practice My Mistakes */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-xl relative overflow-hidden card-3d">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex flex-col gap-2 max-w-lg">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary)] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  Real Mistake Synthesizer
                </span>
                <h3 className="text-2xl font-bold text-[var(--text-main)]">
                  Practice My Recent Mistakes
                </h3>
                <p className="text-xs text-[var(--text-sub)] leading-relaxed">
                  Generates an exercise using the exact words and characters you mistyped during your recent tests.
                </p>

                {recentMistakeKeys.length > 0 ? (
                  <div className="flex flex-wrap items-center gap-1.5 mt-2">
                    <span className="text-xs text-[var(--text-sub)] mr-1">Detected Keys:</span>
                    {recentMistakeKeys.slice(0, 8).map((k, i) => (
                      <kbd
                        key={i}
                        className="px-2 py-0.5 rounded bg-[var(--color-error-bg)] text-[var(--color-error)] border border-[var(--color-error)]/30 font-mono text-xs font-bold"
                      >
                        {k === ' ' ? '␣' : k}
                      </kbd>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-emerald-400 mt-2 font-medium">
                    No recent mistakes logged! Complete typing tests to automatically detect weaknesses.
                  </p>
                )}
              </div>

              <button
                onClick={() => launchMistakesDrill(recentMistakeKeys, recentMistakeWords)}
                className="btn-3d btn-3d-primary flex items-center gap-2 px-6 py-3.5 rounded-2xl font-extrabold text-sm shadow-xl shrink-0 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Start Mistake Drill</span>
              </button>
            </div>
          </div>

          {/* Recommended Adaptive Drills Grid */}
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-bold text-[var(--text-main)]">
              Adaptive Practice Modules
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Weak Keys Drill */}
              <div
                onClick={() =>
                  launchAdaptiveDrill('Weak Keys Isolation Drill', {
                    mode: 'words',
                    wordOption: 25,
                    mistakeKeys: weakKeys.map((k) => k.key)
                  })
                }
                className="p-5 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] hover:border-[var(--color-primary)] transition-all cursor-pointer flex flex-col justify-between gap-4 group card-3d"
              >
                <div>
                  <div className="p-2.5 w-fit rounded-xl bg-rose-500/15 text-rose-400 mb-3">
                    <TrendingDown className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-base text-[var(--text-main)] group-hover:text-[var(--color-primary)] transition-colors">
                    Weak Keys Isolation
                  </h3>
                  <p className="text-xs text-[var(--text-sub)] mt-1">
                    {weakKeys.length > 0
                      ? `Focuses on your highest error keys (${weakKeys.slice(0, 4).map((k) => k.key.toUpperCase()).join(', ')}).`
                      : 'Drill targeting keys with highest error rates.'}
                  </p>
                </div>
                <span className="text-xs font-semibold text-[var(--color-primary)] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Launch Drill →
                </span>
              </div>

              {/* Slow Bigrams Drill */}
              <div
                onClick={() =>
                  launchAdaptiveDrill('Consecutive Bigram Flow', {
                    mode: 'words',
                    wordOption: 25,
                    mistakeKeys: slowBigrams.map((b) => b.bigram[0])
                  })
                }
                className="p-5 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] hover:border-[var(--color-primary)] transition-all cursor-pointer flex flex-col justify-between gap-4 group card-3d"
              >
                <div>
                  <div className="p-2.5 w-fit rounded-xl bg-indigo-500/15 text-indigo-400 mb-3">
                    <Zap className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-base text-[var(--text-main)] group-hover:text-[var(--color-primary)] transition-colors">
                    Slow Bigram Transitions
                  </h3>
                  <p className="text-xs text-[var(--text-sub)] mt-1">
                    {slowBigrams.length > 0
                      ? `Trains pairs with the longest delays (${slowBigrams.slice(0, 3).map((b) => b.bigram.toUpperCase()).join(', ')}).`
                      : 'Smooths out awkward two-letter reaches.'}
                  </p>
                </div>
                <span className="text-xs font-semibold text-[var(--color-primary)] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Launch Drill →
                </span>
              </div>

              {/* Accuracy Booster Drill */}
              <div
                onClick={() =>
                  launchAdaptiveDrill('98% Precision Accuracy Drill', {
                    mode: 'words',
                    wordOption: 25,
                    punctuation: false,
                    numbers: false
                  })
                }
                className="p-5 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] hover:border-[var(--color-primary)] transition-all cursor-pointer flex flex-col justify-between gap-4 group card-3d"
              >
                <div>
                  <div className="p-2.5 w-fit rounded-xl bg-emerald-500/15 text-emerald-400 mb-3">
                    <Target className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-base text-[var(--text-main)] group-hover:text-[var(--color-primary)] transition-colors">
                    Precision Accuracy Drill
                  </h3>
                  <p className="text-xs text-[var(--text-sub)] mt-1">
                    Paced rhythmic words designed to keep accuracy above 98% and eliminate rushes.
                  </p>
                </div>
                <span className="text-xs font-semibold text-[var(--color-primary)] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Launch Drill →
                </span>
              </div>

              {/* Speed Sprint Drill */}
              <div
                onClick={() =>
                  launchAdaptiveDrill('Speed Sprint Acceleration', {
                    mode: 'words',
                    wordOption: 20
                  })
                }
                className="p-5 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] hover:border-[var(--color-primary)] transition-all cursor-pointer flex flex-col justify-between gap-4 group card-3d"
              >
                <div>
                  <div className="p-2.5 w-fit rounded-xl bg-amber-500/15 text-amber-400 mb-3">
                    <Zap className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-base text-[var(--text-main)] group-hover:text-[var(--color-primary)] transition-colors">
                    Speed Burst Sprint
                  </h3>
                  <p className="text-xs text-[var(--text-sub)] mt-1">
                    20 short, balanced words designed to push top burst speed limits.
                  </p>
                </div>
                <span className="text-xs font-semibold text-[var(--color-primary)] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Launch Drill →
                </span>
              </div>

              {/* Number & Symbol Fluency */}
              <div
                onClick={() =>
                  launchAdaptiveDrill('Numbers & Top Row Fluency', {
                    mode: 'words',
                    wordOption: 25,
                    numbers: true,
                    punctuation: true
                  })
                }
                className="p-5 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] hover:border-[var(--color-primary)] transition-all cursor-pointer flex flex-col justify-between gap-4 group card-3d"
              >
                <div>
                  <div className="p-2.5 w-fit rounded-xl bg-cyan-500/15 text-cyan-400 mb-3">
                    <Target className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-base text-[var(--text-main)] group-hover:text-[var(--color-primary)] transition-colors">
                    Numbers & Symbols
                  </h3>
                  <p className="text-xs text-[var(--text-sub)] mt-1">
                    Intertwines digits and punctuation marks for comprehensive real-world fluency.
                  </p>
                </div>
                <span className="text-xs font-semibold text-[var(--color-primary)] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Launch Drill →
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
