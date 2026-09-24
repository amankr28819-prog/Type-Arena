import React, { useState } from 'react';
import {
  Clock,
  FileText,
  Quote,
  Code2,
  Feather,
  Edit3,
  SlidersHorizontal,
  RotateCcw,
  Check,
  Globe
} from 'lucide-react';
import type {
  TestMode,
  TimeOption,
  WordOption,
  QuoteLength,
  Difficulty,
  LanguageOption
} from '../../types';

interface TestConfigBarProps {
  mode: TestMode;
  onModeChange: (mode: TestMode) => void;
  timeOption: TimeOption;
  onTimeChange: (time: TimeOption) => void;
  customTime: number;
  onCustomTimeChange: (seconds: number) => void;
  wordOption: WordOption;
  onWordChange: (words: WordOption) => void;
  customWords: number;
  onCustomWordsChange: (count: number) => void;
  quoteLength: QuoteLength;
  onQuoteLengthChange: (length: QuoteLength) => void;
  punctuation: boolean;
  onPunctuationToggle: () => void;
  numbers: boolean;
  onNumbersToggle: () => void;
  difficulty: Difficulty;
  onDifficultyChange: (diff: Difficulty) => void;
  language: LanguageOption;
  onLanguageChange: (lang: LanguageOption) => void;
  customText: string;
  onCustomTextSubmit: (text: string) => void;
  onRestart: () => void;
  disabled?: boolean;
}

export const TestConfigBar: React.FC<TestConfigBarProps> = ({
  mode,
  onModeChange,
  timeOption,
  onTimeChange,
  customTime,
  onCustomTimeChange,
  wordOption,
  onWordChange,
  customWords,
  onCustomWordsChange,
  quoteLength,
  onQuoteLengthChange,
  punctuation,
  onPunctuationToggle,
  numbers,
  onNumbersToggle,
  difficulty,
  onDifficultyChange,
  language,
  onLanguageChange,
  customText,
  onCustomTextSubmit,
  onRestart,
  disabled = false
}) => {
  const [showCustomTimeModal, setShowCustomTimeModal] = useState(false);
  const [customTimeInput, setCustomTimeInput] = useState(String(customTime || 45));

  const [showCustomWordModal, setShowCustomWordModal] = useState(false);
  const [customWordInput, setCustomWordInput] = useState(String(customWords || 37));

  const [showCustomTextModal, setShowCustomTextModal] = useState(false);
  const [customTextInput, setCustomTextInput] = useState(customText);

  const handleCustomTimeSave = () => {
    const parsed = parseInt(customTimeInput, 10);
    if (!isNaN(parsed) && parsed >= 5 && parsed <= 600) {
      onCustomTimeChange(parsed);
      onTimeChange('custom');
      setShowCustomTimeModal(false);
      onRestart();
    }
  };

  const handleCustomWordSave = () => {
    const parsed = parseInt(customWordInput, 10);
    if (!isNaN(parsed) && parsed >= 5 && parsed <= 500) {
      onCustomWordsChange(parsed);
      onWordChange('custom');
      setShowCustomWordModal(false);
      onRestart();
    }
  };

  const handleCustomTextSave = () => {
    if (customTextInput.trim().length > 0) {
      onCustomTextSubmit(customTextInput.trim());
      onModeChange('custom');
      setShowCustomTextModal(false);
      onRestart();
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-3">
      {/* Primary 3D Config Bar */}
      <div className="card-3d card-3d-glass flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 px-3 sm:px-4 py-2.5 rounded-2xl border border-[var(--border-color)] shadow-lg text-xs sm:text-sm">
        {/* Modes with 3D Tactile Buttons */}
        <div className="flex items-center gap-1 bg-[var(--bg-subtle)]/85 p-1 rounded-xl border border-[var(--border-color)]/60 shadow-inner">
          <button
            onClick={() => onModeChange('time')}
            disabled={disabled}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer select-none ${
              mode === 'time'
                ? 'btn-3d btn-3d-primary font-bold shadow-md'
                : 'text-[var(--text-sub)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface)] active:scale-95 font-medium'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Time</span>
          </button>

          <button
            onClick={() => onModeChange('words')}
            disabled={disabled}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer select-none ${
              mode === 'words'
                ? 'btn-3d btn-3d-primary font-bold shadow-md'
                : 'text-[var(--text-sub)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface)] active:scale-95 font-medium'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Words</span>
          </button>

          <button
            onClick={() => onModeChange('quote')}
            disabled={disabled}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer select-none ${
              mode === 'quote'
                ? 'btn-3d btn-3d-primary font-bold shadow-md'
                : 'text-[var(--text-sub)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface)] active:scale-95 font-medium'
            }`}
          >
            <Quote className="w-3.5 h-3.5" />
            <span>Quote</span>
          </button>

          <button
            onClick={() => onModeChange('code')}
            disabled={disabled}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer select-none ${
              mode === 'code'
                ? 'btn-3d btn-3d-primary font-bold shadow-md'
                : 'text-[var(--text-sub)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface)] active:scale-95 font-medium'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Code</span>
          </button>

          <button
            onClick={() => onModeChange('zen')}
            disabled={disabled}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer select-none ${
              mode === 'zen'
                ? 'btn-3d btn-3d-primary font-bold shadow-md'
                : 'text-[var(--text-sub)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface)] active:scale-95 font-medium'
            }`}
          >
            <Feather className="w-3.5 h-3.5" />
            <span>Zen</span>
          </button>

          <button
            onClick={() => setShowCustomTextModal(true)}
            disabled={disabled}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer select-none ${
              mode === 'custom'
                ? 'btn-3d btn-3d-primary font-bold shadow-md'
                : 'text-[var(--text-sub)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface)] active:scale-95 font-medium'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Custom</span>
          </button>
        </div>

        <div className="h-5 w-[1px] bg-[var(--border-color)] hidden sm:block" />

        {/* Sub-options based on mode */}
        {mode === 'time' && (
          <div className="flex items-center gap-1">
            {[15, 30, 60, 120].map((t) => (
              <button
                key={t}
                onClick={() => onTimeChange(t as TimeOption)}
                disabled={disabled}
                className={`px-2.5 py-1 rounded-md font-mono transition-all ${
                  timeOption === t
                    ? 'text-[var(--color-primary)] font-bold bg-[var(--bg-subtle)]'
                    : 'text-[var(--text-sub)] hover:text-[var(--text-main)]'
                }`}
              >
                {t}
              </button>
            ))}
            <button
              onClick={() => setShowCustomTimeModal(true)}
              disabled={disabled}
              className={`px-2.5 py-1 rounded-md font-mono flex items-center gap-1 transition-all ${
                timeOption === 'custom'
                  ? 'text-[var(--color-primary)] font-bold bg-[var(--bg-subtle)] border border-[var(--color-primary)]/40'
                  : 'text-[var(--text-sub)] hover:text-[var(--text-main)]'
              }`}
            >
              <span>{timeOption === 'custom' ? `${customTime}s` : 'custom'}</span>
            </button>
          </div>
        )}

        {mode === 'words' && (
          <div className="flex items-center gap-1">
            {[10, 25, 50, 100].map((w) => (
              <button
                key={w}
                onClick={() => onWordChange(w as WordOption)}
                disabled={disabled}
                className={`px-2.5 py-1 rounded-md font-mono transition-all ${
                  wordOption === w
                    ? 'text-[var(--color-primary)] font-bold bg-[var(--bg-subtle)]'
                    : 'text-[var(--text-sub)] hover:text-[var(--text-main)]'
                }`}
              >
                {w}
              </button>
            ))}
            <button
              onClick={() => setShowCustomWordModal(true)}
              disabled={disabled}
              className={`px-2.5 py-1 rounded-md font-mono flex items-center gap-1 transition-all ${
                wordOption === 'custom'
                  ? 'text-[var(--color-primary)] font-bold bg-[var(--bg-subtle)] border border-[var(--color-primary)]/40'
                  : 'text-[var(--text-sub)] hover:text-[var(--text-main)]'
              }`}
            >
              <span>{wordOption === 'custom' ? `${customWords}w` : 'custom'}</span>
            </button>
          </div>
        )}

        {mode === 'quote' && (
          <div className="flex items-center gap-1">
            {(['short', 'medium', 'long'] as QuoteLength[]).map((ql) => (
              <button
                key={ql}
                onClick={() => onQuoteLengthChange(ql)}
                disabled={disabled}
                className={`px-2.5 py-1 rounded-md capitalize transition-all ${
                  quoteLength === ql
                    ? 'text-[var(--color-primary)] font-bold bg-[var(--bg-subtle)]'
                    : 'text-[var(--text-sub)] hover:text-[var(--text-main)]'
                }`}
              >
                {ql}
              </button>
            ))}
          </div>
        )}

        <div className="h-5 w-[1px] bg-[var(--border-color)] hidden sm:block" />

        {/* Toggles: Punctuation & Numbers */}
        <div className="flex items-center gap-1">
          <button
            onClick={onPunctuationToggle}
            disabled={disabled}
            className={`px-2.5 py-1 rounded-md font-medium transition-all ${
              punctuation
                ? 'bg-[var(--color-primary)]/15 text-[var(--color-primary)] font-semibold border border-[var(--color-primary)]/30'
                : 'text-[var(--text-sub)] hover:text-[var(--text-main)]'
            }`}
          >
            @ punctuation
          </button>

          <button
            onClick={onNumbersToggle}
            disabled={disabled}
            className={`px-2.5 py-1 rounded-md font-medium transition-all ${
              numbers
                ? 'bg-[var(--color-primary)]/15 text-[var(--color-primary)] font-semibold border border-[var(--color-primary)]/30'
                : 'text-[var(--text-sub)] hover:text-[var(--text-main)]'
            }`}
          >
            # numbers
          </button>
        </div>

        <div className="h-5 w-[1px] bg-[var(--border-color)] hidden sm:block" />

        {/* Language selector */}
        <div className="flex items-center gap-1">
          <Globe className="w-3.5 h-3.5 text-[var(--text-sub)]" />
          <select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value as LanguageOption)}
            disabled={disabled}
            className="bg-[var(--bg-subtle)] text-[var(--text-main)] px-2 py-1 rounded-md border border-[var(--border-color)] text-xs cursor-pointer focus:outline-none"
          >
            <option value="english">English</option>
            <option value="hindi">Hindi</option>
            <option value="spanish">Español</option>
            <option value="french">Français</option>
            <option value="german">Deutsch</option>
          </select>
        </div>

        {/* Difficulty selector */}
        <div className="flex items-center gap-1">
          <SlidersHorizontal className="w-3.5 h-3.5 text-[var(--text-sub)]" />
          <select
            value={difficulty}
            onChange={(e) => onDifficultyChange(e.target.value as Difficulty)}
            disabled={disabled}
            className="bg-[var(--bg-subtle)] text-[var(--text-main)] px-2 py-1 rounded-md border border-[var(--border-color)] text-xs cursor-pointer focus:outline-none"
          >
            <option value="normal">Normal</option>
            <option value="advanced">Advanced</option>
            <option value="expert">Expert (Stop on Error)</option>
            <option value="master">Master (Zero Error Tolerance)</option>
          </select>
        </div>

        {/* Restart test button */}
        <button
          onClick={onRestart}
          title="Restart Test (or press Tab + Enter / Esc)"
          className="btn-3d btn-3d-secondary p-2 rounded-xl text-[var(--text-sub)] hover:text-[var(--text-main)] shadow-xs cursor-pointer select-none"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Custom Time Modal */}
      {showCustomTimeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-[var(--text-main)] mb-2">Custom Time Duration</h3>
            <p className="text-xs text-[var(--text-sub)] mb-4">
              Enter test duration in seconds (between 5 and 600 seconds). The timer and result will be precisely calculated for this duration.
            </p>
            <div className="flex items-center gap-2 mb-4">
              <input
                type="number"
                min="5"
                max="600"
                value={customTimeInput}
                onChange={(e) => setCustomTimeInput(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] text-[var(--text-main)] font-mono text-lg focus:outline-none focus:border-[var(--color-primary)]"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCustomTimeSave();
                  if (e.key === 'Escape') setShowCustomTimeModal(false);
                }}
              />
              <span className="text-sm font-mono text-[var(--text-sub)]">sec</span>
            </div>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setShowCustomTimeModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-[var(--text-sub)] hover:bg-[var(--bg-subtle)]"
              >
                Cancel
              </button>
              <button
                onClick={handleCustomTimeSave}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[var(--color-primary)] text-[var(--bg-main)] hover:opacity-90"
              >
                <Check className="w-3.5 h-3.5" />
                Apply Duration
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Words Modal */}
      {showCustomWordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-[var(--text-main)] mb-2">Custom Word Count</h3>
            <p className="text-xs text-[var(--text-sub)] mb-4">
              Enter exactly how many words you want to type (between 5 and 500 words). The test will require and verify this exact word count.
            </p>
            <div className="flex items-center gap-2 mb-4">
              <input
                type="number"
                min="5"
                max="500"
                value={customWordInput}
                onChange={(e) => setCustomWordInput(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] text-[var(--text-main)] font-mono text-lg focus:outline-none focus:border-[var(--color-primary)]"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCustomWordSave();
                  if (e.key === 'Escape') setShowCustomWordModal(false);
                }}
              />
              <span className="text-sm font-mono text-[var(--text-sub)]">words</span>
            </div>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setShowCustomWordModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-[var(--text-sub)] hover:bg-[var(--bg-subtle)]"
              >
                Cancel
              </button>
              <button
                onClick={handleCustomWordSave}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[var(--color-primary)] text-[var(--bg-main)] hover:opacity-90"
              >
                <Check className="w-3.5 h-3.5" />
                Apply Word Count
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Text Modal */}
      {showCustomTextModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-xl rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-[var(--text-main)] mb-2">Custom Text Input</h3>
            <p className="text-xs text-[var(--text-sub)] mb-4">
              Paste or write your own text below. The typing engine will load this exact text without placeholders.
            </p>
            <textarea
              rows={6}
              value={customTextInput}
              onChange={(e) => setCustomTextInput(e.target.value)}
              placeholder="Paste or write your custom text here..."
              className="w-full p-4 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] text-[var(--text-main)] font-mono text-sm focus:outline-none focus:border-[var(--color-primary)] resize-none mb-4"
              autoFocus
            />
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setShowCustomTextModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-[var(--text-sub)] hover:bg-[var(--bg-subtle)]"
              >
                Cancel
              </button>
              <button
                onClick={handleCustomTextSave}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[var(--color-primary)] text-[var(--bg-main)] hover:opacity-90"
              >
                <Check className="w-3.5 h-3.5" />
                Load Custom Text
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
