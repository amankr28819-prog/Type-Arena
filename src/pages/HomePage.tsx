import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type {
  TestMode,
  TimeOption,
  WordOption,
  QuoteLength,
  Difficulty,
  LanguageOption,
  TestResult
} from '../types';
import { generateTestText } from '../lib/generator';
import { useTypingEngine } from '../hooks/useTypingEngine';
import { useSettings } from '../context/SettingsContext';
import { storage } from '../lib/storage';
import { TestConfigBar } from '../components/typing/TestConfigBar';
import { LiveStatsBar } from '../components/typing/LiveStatsBar';
import { TypingArea } from '../components/typing/TypingArea';
import { VirtualKeyboard } from '../components/typing/VirtualKeyboard';
import { ResultModal } from '../components/typing/ResultModal';

interface HomePageProps {
  onNavigateToPractice?: (mistakeKeys: string[], mistakeWords: string[]) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigateToPractice }) => {
  const { settings, updateSettings } = useSettings();

  // Test configuration states
  const [mode, setMode] = useState<TestMode>('time');
  const [timeOption, setTimeOption] = useState<TimeOption>(30);
  const [customTime, setCustomTime] = useState<number>(45);
  const [wordOption, setWordOption] = useState<WordOption>(25);
  const [customWords, setCustomWords] = useState<number>(37);
  const [quoteLength, setQuoteLength] = useState<QuoteLength>('medium');
  const [punctuation, setPunctuation] = useState<boolean>(settings.punctuation);
  const [numbers, setNumbers] = useState<boolean>(settings.numbers);
  const [difficulty, setDifficulty] = useState<Difficulty>(settings.difficulty);
  const [language, setLanguage] = useState<LanguageOption>(settings.language);
  const [customText, setCustomText] = useState<string>('');
  const [codeIndex, setCodeIndex] = useState<number>(0);

  // Key tracking for virtual keyboard
  const [currentKey, setCurrentKey] = useState('');
  const [nextKey, setNextKey] = useState('');
  const [isKeyError, setIsKeyError] = useState(false);
  const [isFocused, setIsFocused] = useState(true);

  // Test completion state
  const [completedResult, setCompletedResult] = useState<TestResult | null>(null);
  const [isNewPB, setIsNewPB] = useState(false);
  const [pbType, setPbType] = useState<string | undefined>(undefined);

  // Aggregated key stats for heatmap
  const [keyStats, setKeyStats] = useState<Record<string, any>>({});

  useEffect(() => {
    storage.getKeyStats().then(setKeyStats);
  }, [completedResult]);

  // Generate test text based on current options
  const initialText = useMemo(() => {
    return generateTestText({
      mode,
      timeOption,
      customTime,
      wordOption,
      customWords,
      quoteLength,
      language,
      difficulty,
      punctuation,
      numbers,
      customText,
      codeIndex
    });
  }, [
    mode,
    timeOption,
    customTime,
    wordOption,
    customWords,
    quoteLength,
    language,
    difficulty,
    punctuation,
    numbers,
    customText,
    codeIndex
  ]);

  const handleTestComplete = useCallback(
    (result: TestResult) => {
      const pbUpdate = storage.updatePersonalBests(result);
      setIsNewPB(pbUpdate.isNewPB);
      setPbType(pbUpdate.pbType);
      setCompletedResult(result);
    },
    []
  );

  const engine = useTypingEngine({
    initialText,
    mode,
    timeOption,
    customTime,
    wordOption,
    customWords,
    settings: {
      ...settings,
      difficulty,
      language,
      punctuation,
      numbers
    },
    onTestComplete: handleTestComplete
  });

  const handleRestart = useCallback(() => {
    setCompletedResult(null);
    setIsNewPB(false);
    setPbType(undefined);
    engine.resetTest();
    setIsFocused(true);
  }, [engine]);

  const handleNextTest = useCallback(() => {
    // Regenerate new text by tweaking codeIndex or resetting
    if (mode === 'code') {
      setCodeIndex((prev) => (prev + 1) % 5);
    }
    handleRestart();
  }, [mode, handleRestart]);

  // Global restart shortcuts: Tab + Enter or Escape
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleRestart();
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [handleRestart]);

  const handlePracticeMistakes = (keys: string[], words: string[]) => {
    if (onNavigateToPractice) {
      onNavigateToPractice(keys, words);
    }
  };

  const layout = settings.layout || 'classic';

  return (
    <div className="w-full flex flex-col items-center gap-6 py-4 sm:py-8 px-4 relative">
      {/* Subtle 3D Ambient Floating Keycaps on Flanks */}
      <div
        className={`pointer-events-none fixed inset-0 z-0 overflow-hidden hidden xl:block transition-opacity duration-300 ${
          engine.isActive ? 'opacity-10' : 'opacity-35'
        }`}
      >
        <div className="absolute left-10 top-1/4 animate-float-gentle">
          <div className="w-12 h-12 rounded-2xl keycap-3d flex items-center justify-center font-mono font-bold text-sm text-[var(--color-primary)] border border-[var(--border-color)] shadow-xl">
            T
          </div>
        </div>
        <div className="absolute left-16 top-2/3 animate-float-delayed">
          <div className="w-12 h-12 rounded-2xl keycap-3d flex items-center justify-center font-mono font-bold text-sm text-[var(--text-sub)] border border-[var(--border-color)] shadow-lg">
            F
          </div>
        </div>
        <div className="absolute right-10 top-1/3 animate-float-delayed">
          <div className="w-12 h-12 rounded-2xl keycap-3d flex items-center justify-center font-mono font-bold text-sm text-[var(--color-primary)] border border-[var(--border-color)] shadow-xl">
            J
          </div>
        </div>
        <div className="absolute right-14 top-3/4 animate-float-gentle">
          <div className="w-16 h-10 rounded-2xl keycap-3d flex items-center justify-center font-mono text-xs text-[var(--text-sub)] border border-[var(--border-color)] shadow-lg">
            Space
          </div>
        </div>
      </div>

      {/* If test is completed, render Result Screen */}
      {completedResult ? (
        <ResultModal
          result={completedResult}
          settings={settings}
          isNewPB={isNewPB}
          pbType={pbType}
          onRestart={handleRestart}
          onNextTest={handleNextTest}
          onPracticeMistakes={handlePracticeMistakes}
        />
      ) : (
        <div className="w-full max-w-5xl flex flex-col items-center gap-6 animate-stagger-item">
          {/* Top Test Configuration Controls */}
          <div
            className={`w-full transition-opacity duration-200 ${
              layout === 'focus' && engine.isActive ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
          >
            <TestConfigBar
              mode={mode}
              onModeChange={(m) => {
                setMode(m);
                handleRestart();
              }}
              timeOption={timeOption}
              onTimeChange={(t) => {
                setTimeOption(t);
                handleRestart();
              }}
              customTime={customTime}
              onCustomTimeChange={setCustomTime}
              wordOption={wordOption}
              onWordChange={(w) => {
                setWordOption(w);
                handleRestart();
              }}
              customWords={customWords}
              onCustomWordsChange={setCustomWords}
              quoteLength={quoteLength}
              onQuoteLengthChange={(ql) => {
                setQuoteLength(ql);
                handleRestart();
              }}
              punctuation={punctuation}
              onPunctuationToggle={() => {
                setPunctuation((p) => !p);
                updateSettings({ punctuation: !punctuation });
                handleRestart();
              }}
              numbers={numbers}
              onNumbersToggle={() => {
                setNumbers((n) => !n);
                updateSettings({ numbers: !numbers });
                handleRestart();
              }}
              difficulty={difficulty}
              onDifficultyChange={(d) => {
                setDifficulty(d);
                updateSettings({ difficulty: d });
                handleRestart();
              }}
              language={language}
              onLanguageChange={(l) => {
                setLanguage(l);
                updateSettings({ language: l });
                handleRestart();
              }}
              customText={customText}
              onCustomTextSubmit={(t) => {
                setCustomText(t);
                setMode('custom');
                handleRestart();
              }}
              onRestart={handleRestart}
              disabled={engine.isActive}
            />
          </div>

          {/* Master Difficulty Failure Alert */}
          {engine.isFailed && (
            <div className="w-full max-w-4xl p-4 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-400 font-bold text-center animate-shake">
              <p>{engine.failReason}</p>
              <button
                onClick={handleRestart}
                className="mt-2 px-4 py-1.5 rounded-xl bg-rose-500 text-white text-xs font-semibold"
              >
                Try Again (Esc)
              </button>
            </div>
          )}

          {/* Live Statistics Bar */}
          <div className="w-full max-w-4xl">
            <LiveStatsBar
              wpm={engine.wpm}
              rawWpm={engine.rawWpm}
              accuracy={engine.accuracy}
              errors={engine.errors}
              elapsedSeconds={engine.elapsedSeconds}
              remainingSeconds={engine.remainingSeconds}
              mode={mode}
              currentWordIndex={engine.currentWordIndex}
              totalWords={engine.words.length}
              targetWpm={settings.targetWpm}
              blindMode={settings.blindMode}
            />
          </div>

          {/* Developer layout: Code editor line indicator wrapper */}
          {layout === 'developer' && (
            <div className="w-full max-w-4xl flex items-center justify-between px-4 py-1.5 rounded-t-xl bg-[var(--bg-subtle)] border-t border-x border-[var(--border-color)] text-xs font-mono text-[var(--text-sub)]">
              <span>typearena_session.ts</span>
              <span>UTF-8 • TypeScript</span>
            </div>
          )}

          {/* Interactive Typing Stream Area */}
          <TypingArea
            words={engine.words}
            currentWordIndex={engine.currentWordIndex}
            currentInput={engine.currentInput}
            wordHistory={engine.wordHistory}
            caretStyle={settings.caretStyle}
            smoothCaret={settings.smoothCaret}
            blindMode={settings.blindMode}
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

          {/* Interactive Virtual Keyboard (Toggleable) */}
          {settings.showVirtualKeyboard && layout !== 'minimal' && (
            <div
              className={`w-full transition-opacity duration-200 ${
                layout === 'focus' && engine.isActive ? 'opacity-20' : 'opacity-100'
              }`}
            >
              <VirtualKeyboard
                currentKey={currentKey}
                nextKey={nextKey}
                isError={isKeyError}
                showFingerGuides={true}
                showHeatmap={settings.keyboardHeatmap}
                keyStats={keyStats}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
