import React, { useRef, useEffect } from 'react';
import type { CaretStyle } from '../../types';

interface TypingAreaProps {
  words: string[];
  currentWordIndex: number;
  currentInput: string;
  wordHistory: string[];
  caretStyle?: CaretStyle;
  smoothCaret?: boolean;
  blindMode?: boolean;
  fontSize?: number;
  fontFamily?: string;
  isFocused: boolean;
  onFocus: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onKeyAnalysis?: (currentKey: string, nextKey: string, isError: boolean) => void;
}

export const TypingArea: React.FC<TypingAreaProps> = ({
  words,
  currentWordIndex,
  currentInput,
  wordHistory,
  caretStyle = 'line',
  smoothCaret = true,
  blindMode = false,
  fontSize = 24,
  fontFamily = "'JetBrains Mono', monospace",
  isFocused,
  onFocus,
  onKeyDown,
  onKeyAnalysis
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeWordRef = useRef<HTMLSpanElement>(null);
  const caretRef = useRef<HTMLSpanElement>(null);
  const hiddenInputRef = useRef<HTMLInputElement>(null);

  // Compute active target key and next key for the virtual keyboard
  useEffect(() => {
    if (!onKeyAnalysis) return;
    const activeExpected = words[currentWordIndex] || '';
    let currentKey = '';
    let nextKey = '';
    let isError = false;

    if (currentInput.length < activeExpected.length) {
      currentKey = activeExpected[currentInput.length];
      nextKey = activeExpected[currentInput.length + 1] || ' ';
      // Check if current typed input has mistake at last character
      const lastTypedIdx = currentInput.length - 1;
      if (lastTypedIdx >= 0 && currentInput[lastTypedIdx] !== activeExpected[lastTypedIdx]) {
        isError = true;
      }
    } else {
      // User typed full word or extra characters; space is expected next
      currentKey = ' ';
      const nextWord = words[currentWordIndex + 1];
      nextKey = nextWord ? nextWord[0] : '';
    }

    onKeyAnalysis(currentKey, nextKey, isError);
  }, [currentWordIndex, currentInput, words, onKeyAnalysis]);

  // Keep focus on hidden input
  useEffect(() => {
    if (isFocused && hiddenInputRef.current) {
      hiddenInputRef.current.focus();
    }
  }, [isFocused]);

  // Autoscroll line when advancing words
  useEffect(() => {
    if (activeWordRef.current && containerRef.current) {
      const container = containerRef.current;
      const element = activeWordRef.current;
      const offsetTop = element.offsetTop - container.offsetTop;

      // Keep active line roughly in middle/second row
      if (offsetTop > 70) {
        container.scrollTo({
          top: offsetTop - 60,
          behavior: 'smooth'
        });
      } else {
        container.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [currentWordIndex]);

  return (
    <div
      onClick={() => {
        onFocus();
        if (hiddenInputRef.current) hiddenInputRef.current.focus();
      }}
      className={`
        relative w-full max-w-4xl mx-auto rounded-3xl p-6 sm:p-8
        typing-deck-3d cursor-text select-none
        ${isFocused ? 'ring-2 ring-[var(--color-primary)]/40 border-[var(--color-primary)]' : 'border-[var(--border-color)] opacity-95'}
      `}
    >
      {/* Hidden input to capture keystrokes smoothly across mobile and desktop */}
      <input
        ref={hiddenInputRef}
        type="text"
        data-typing-input="true"
        className="absolute opacity-0 pointer-events-none w-0 h-0"
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off"
        spellCheck="false"
        onKeyDown={onKeyDown}
        onBlur={onFocus}
      />

      {/* Focus indicator overlay if unfocused */}
      {!isFocused && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-[2px] rounded-3xl cursor-pointer">
          <span className="px-4 py-2 rounded-xl bg-[var(--bg-subtle)] text-[var(--color-primary)] font-bold text-sm border border-[var(--border-color)] shadow-lg animate-pulse">
            Click or press any key to focus
          </span>
        </div>
      )}

      {/* Word stream display */}
      <div
        ref={containerRef}
        style={{
          fontFamily,
          fontSize: `${fontSize}px`,
          lineHeight: '1.8',
          maxHeight: '180px'
        }}
        className={`
          flex flex-wrap items-baseline gap-x-3 gap-y-1 overflow-hidden transition-all
          ${blindMode ? 'blind-mode' : ''}
        `}
      >
        {words.map((word, wordIdx) => {
          const isPast = wordIdx < currentWordIndex;
          const isCurrent = wordIdx === currentWordIndex;

          if (isPast) {
            const typedWord = wordHistory[wordIdx] || '';
            const isMatch = typedWord === word;

            return (
              <span
                key={wordIdx}
                className={`relative inline-flex items-center transition-colors ${
                  isMatch ? 'text-[var(--color-correct)]' : 'text-[var(--color-error)]'
                }`}
              >
                {word.split('').map((char, charIdx) => {
                  const typedChar = typedWord[charIdx];
                  const isCharMatch = typedChar === char;
                  return (
                    <span
                      key={charIdx}
                      className={isCharMatch ? 'typing-char-correct' : 'typing-char-incorrect'}
                    >
                      {char}
                    </span>
                  );
                })}
                {/* Extra characters typed beyond word length */}
                {typedWord.length > word.length &&
                  typedWord.slice(word.length).split('').map((char, extraIdx) => (
                    <span key={`extra-${extraIdx}`} className="typing-char-extra">
                      {char}
                    </span>
                  ))}
              </span>
            );
          }

          if (isCurrent) {
            return (
              <span
                key={wordIdx}
                ref={activeWordRef}
                className="relative inline-flex items-center bg-[var(--bg-subtle)] px-1 rounded-md"
              >
                {word.split('').map((expectedChar, charIdx) => {
                  const typedChar = currentInput[charIdx];
                  const isTyped = charIdx < currentInput.length;
                  const isCorrect = typedChar === expectedChar;

                  const isCaretHere = charIdx === currentInput.length;

                  return (
                    <span key={charIdx} className="relative inline-block">
                      {/* Active Caret */}
                      {isCaretHere && (
                        <span
                          ref={caretRef}
                          className={`
                            absolute left-0 top-1 bottom-1 z-10
                            ${caretStyle === 'line' ? 'caret-line' : ''}
                            ${caretStyle === 'block' ? 'caret-block w-full inset-0' : ''}
                            ${caretStyle === 'underline' ? 'caret-underline w-full' : ''}
                            ${caretStyle === 'box' ? 'caret-box w-full inset-0' : ''}
                            ${smoothCaret ? 'caret-smooth' : 'caret-blink'}
                          `}
                        />
                      )}
                      <span
                        className={
                          !isTyped
                            ? isCaretHere
                              ? 'typing-char-current underline decoration-[var(--color-primary)] decoration-2 underline-offset-4'
                              : 'typing-char-pending'
                            : isCorrect
                            ? 'typing-char-correct font-semibold'
                            : 'typing-char-incorrect font-semibold'
                        }
                      >
                        {expectedChar}
                      </span>
                    </span>
                  );
                })}

                {/* Extra typed characters beyond word length */}
                {currentInput.length > word.length &&
                  currentInput.slice(word.length).split('').map((extraChar, extraIdx) => (
                    <span
                      key={`extra-${extraIdx}`}
                      className="relative inline-block typing-char-extra"
                    >
                      {extraChar}
                    </span>
                  ))}

                {/* Caret if positioned past all characters */}
                {currentInput.length >= word.length && (
                  <span
                    className={`
                      inline-block h-6 ml-0.5
                      ${caretStyle === 'line' ? 'caret-line' : ''}
                      ${caretStyle === 'block' ? 'caret-block w-3' : ''}
                      ${caretStyle === 'underline' ? 'caret-underline w-3' : ''}
                      ${caretStyle === 'box' ? 'caret-box w-3' : ''}
                      ${smoothCaret ? 'caret-smooth' : 'caret-blink'}
                    `}
                  />
                )}
              </span>
            );
          }

          // Future pending words
          return (
            <span key={wordIdx} className="inline-flex text-[var(--typing-target)] opacity-90 font-normal">
              {word}
            </span>
          );
        })}
      </div>
    </div>
  );
};
