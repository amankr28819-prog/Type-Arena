import React from 'react';
import type { KeyAnalytics } from '../../types';
import { FINGER_COLORS, getFingerForKey, type FingerCode } from '../../lib/fingerMapping';

interface VirtualKeyboardProps {
  currentKey?: string;
  nextKey?: string;
  wrongKey?: string;
  isError?: boolean;
  showFingerGuides?: boolean;
  showHeatmap?: boolean;
  keyStats?: Record<string, KeyAnalytics>;
}

interface KeyDef {
  key: string;
  display: string;
  width?: string;
  finger: FingerCode;
}

const KEYBOARD_ROWS: KeyDef[][] = [
  // Number row
  [
    { key: '`', display: '`', finger: 'lp' },
    { key: '1', display: '1', finger: 'lp' },
    { key: '2', display: '2', finger: 'lr' },
    { key: '3', display: '3', finger: 'lm' },
    { key: '4', display: '4', finger: 'li' },
    { key: '5', display: '5', finger: 'li' },
    { key: '6', display: '6', finger: 'ri' },
    { key: '7', display: '7', finger: 'ri' },
    { key: '8', display: '8', finger: 'rm' },
    { key: '9', display: '9', finger: 'rr' },
    { key: '0', display: '0', finger: 'rp' },
    { key: '-', display: '-', finger: 'rp' },
    { key: '=', display: '=', finger: 'rp' },
    { key: 'Backspace', display: '⌫', width: 'w-16 sm:w-20', finger: 'rp' },
  ],
  // Top row (Q W E R T Y U I O P)
  [
    { key: 'Tab', display: 'Tab', width: 'w-12 sm:w-16', finger: 'lp' },
    { key: 'q', display: 'Q', finger: 'lp' },
    { key: 'w', display: 'W', finger: 'lr' },
    { key: 'e', display: 'E', finger: 'lm' },
    { key: 'r', display: 'R', finger: 'li' },
    { key: 't', display: 'T', finger: 'li' }, // CANONICAL: Left Index
    { key: 'y', display: 'Y', finger: 'ri' }, // CANONICAL: Right Index
    { key: 'u', display: 'U', finger: 'ri' },
    { key: 'i', display: 'I', finger: 'rm' },
    { key: 'o', display: 'O', finger: 'rr' },
    { key: 'p', display: 'P', finger: 'rp' },
    { key: '[', display: '[', finger: 'rp' },
    { key: ']', display: ']', finger: 'rp' },
    { key: '\\', display: '\\', width: 'w-10 sm:w-14', finger: 'rp' },
  ],
  // Home row (A S D F G H J K L ;)
  [
    { key: 'CapsLock', display: 'Caps', width: 'w-14 sm:w-18', finger: 'lp' },
    { key: 'a', display: 'A', finger: 'lp' },
    { key: 's', display: 'S', finger: 'lr' },
    { key: 'd', display: 'D', finger: 'lm' },
    { key: 'f', display: 'F', finger: 'li' }, // Tactile anchor bump
    { key: 'g', display: 'G', finger: 'li' },
    { key: 'h', display: 'H', finger: 'ri' },
    { key: 'j', display: 'J', finger: 'ri' }, // Tactile anchor bump
    { key: 'k', display: 'K', finger: 'rm' },
    { key: 'l', display: 'L', finger: 'rr' },
    { key: ';', display: ';', finger: 'rp' },
    { key: "'", display: "'", finger: 'rp' },
    { key: 'Enter', display: 'Enter ↵', width: 'w-16 sm:w-22', finger: 'rp' },
  ],
  // Bottom row (Z X C V B N M , . /)
  [
    { key: 'ShiftLeft', display: 'Shift', width: 'w-16 sm:w-22', finger: 'lp' },
    { key: 'z', display: 'Z', finger: 'lp' },
    { key: 'x', display: 'X', finger: 'lr' },
    { key: 'c', display: 'C', finger: 'lm' },
    { key: 'v', display: 'V', finger: 'li' },
    { key: 'b', display: 'B', finger: 'li' },
    { key: 'n', display: 'N', finger: 'ri' },
    { key: 'm', display: 'M', finger: 'ri' },
    { key: ',', display: ',', finger: 'rm' },
    { key: '.', display: '.', finger: 'rr' },
    { key: '/', display: '/', finger: 'rp' },
    { key: 'ShiftRight', display: 'Shift', width: 'w-16 sm:w-22', finger: 'rp' },
  ],
  // Space row
  [
    { key: 'ControlLeft', display: 'Ctrl', width: 'w-12 sm:w-14', finger: 'lp' },
    { key: 'AltLeft', display: 'Alt', width: 'w-12 sm:w-14', finger: 'th' },
    { key: ' ', display: 'Space', width: 'flex-1 max-w-sm sm:max-w-md', finger: 'th' },
    { key: 'AltRight', display: 'Alt', width: 'w-12 sm:w-14', finger: 'th' },
    { key: 'ControlRight', display: 'Ctrl', width: 'w-12 sm:w-14', finger: 'rp' },
  ]
];

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  currentKey = '',
  nextKey = '',
  wrongKey = '',
  isError = false,
  showFingerGuides = true,
  showHeatmap = false,
  keyStats = {}
}) => {
  const normCurrent = currentKey.toLowerCase();
  const normNext = nextKey.toLowerCase();
  const normWrong = wrongKey.toLowerCase();

  const currentAssignment = getFingerForKey(currentKey);

  const getHeatmapColor = (keyChar: string) => {
    if (!showHeatmap || !keyStats[keyChar]) return null;
    const stat = keyStats[keyChar];
    if (stat.totalPresses === 0) return null;
    const rate = Math.min(stat.errorRate, 30);
    const ratio = rate / 30;
    return `rgba(239, 68, 68, ${0.15 + ratio * 0.7})`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-5 rounded-3xl card-3d border border-[var(--border-color)] shadow-2xl transition-all">
      {/* Keyboard Header / Finger Indicators */}
      {showFingerGuides && (
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2.5 border-b border-[var(--border-color)] text-xs text-[var(--text-sub)]">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-[var(--text-main)]">Touch Map:</span>
            <div className="flex items-center gap-1 font-medium">
              <span className="px-2 py-0.5 rounded text-[10px]" style={{ background: FINGER_COLORS.lp.bg, color: FINGER_COLORS.lp.text }}>Pinky</span>
              <span className="px-2 py-0.5 rounded text-[10px]" style={{ background: FINGER_COLORS.lr.bg, color: FINGER_COLORS.lr.text }}>Ring</span>
              <span className="px-2 py-0.5 rounded text-[10px]" style={{ background: FINGER_COLORS.lm.bg, color: FINGER_COLORS.lm.text }}>Middle</span>
              <span className="px-2 py-0.5 rounded text-[10px]" style={{ background: FINGER_COLORS.li.bg, color: FINGER_COLORS.li.text }}>Index</span>
              <span className="px-2 py-0.5 rounded text-[10px]" style={{ background: FINGER_COLORS.th.bg, color: FINGER_COLORS.th.text }}>Thumbs</span>
            </div>
          </div>

          {currentKey && (
            <div className="flex items-center gap-2">
              <span className="text-[var(--text-sub)] text-[11px] uppercase tracking-wider font-medium">Target:</span>
              <span
                className="font-bold text-xs px-2.5 py-1 rounded-md border flex items-center gap-1.5 shadow-xs"
                style={{
                  backgroundColor: currentAssignment.color + '22',
                  borderColor: currentAssignment.color,
                  color: currentAssignment.color
                }}
              >
                <span>{currentKey === ' ' ? '␣ Space' : currentKey}</span>
                <span className="text-[10px] opacity-80">({currentAssignment.fingerName})</span>
              </span>

              {currentAssignment.needsShift && currentAssignment.shiftFingerName && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  + {currentAssignment.shiftFingerName}
                </span>
              )}

              {nextKey && (
                <>
                  <span className="text-[var(--text-sub)] text-[11px] ml-1">Next:</span>
                  <span className="font-mono text-xs px-1.5 py-0.5 rounded bg-[var(--bg-subtle)] text-[var(--text-sub)] border border-[var(--border-color)]">
                    {nextKey === ' ' ? '␣' : nextKey}
                  </span>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* Keyboard Matrix */}
      <div className="flex flex-col gap-1.5 sm:gap-2">
        {KEYBOARD_ROWS.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-1 sm:gap-1.5">
            {row.map((item, keyIndex) => {
              const isMatchCurrent =
                (item.key === ' ' && normCurrent === ' ') ||
                item.key.toLowerCase() === normCurrent;

              const isMatchWrong =
                normWrong &&
                ((item.key === ' ' && normWrong === ' ') ||
                  item.key.toLowerCase() === normWrong);

              const isMatchNext =
                !isMatchCurrent &&
                !isMatchWrong &&
                ((item.key === ' ' && normNext === ' ') ||
                  item.key.toLowerCase() === normNext);

              // Highlight Shift key if opposite shift is needed
              const isShiftActive =
                currentAssignment.needsShift &&
                ((currentAssignment.shiftHand === 'right' && item.key === 'ShiftRight') ||
                  (currentAssignment.shiftHand === 'left' && item.key === 'ShiftLeft'));

              const fingerStyle = showFingerGuides && FINGER_COLORS[item.finger];
              const heatBg = getHeatmapColor(item.key.toLowerCase());

              // State-dependent classes (NEVER fractional scale to prevent blurry text)
              let stateClasses = 'bg-[var(--key-bg)] text-[var(--key-text)] border border-[var(--border-color)] hover:border-[var(--text-sub)] keycap-3d';

              if (isMatchWrong) {
                // Wrong key briefly alerted in rose/red
                stateClasses = 'bg-rose-600 text-white shadow-lg shadow-rose-600/40 border-rose-400 animate-pulse keycap-3d-active';
              } else if (isMatchCurrent) {
                if (isError) {
                  stateClasses = 'bg-[var(--color-error)] text-white shadow-md shadow-[var(--color-error)]/40 border-transparent keycap-3d-active ring-2 ring-rose-400';
                } else {
                  stateClasses = 'bg-[var(--key-active)] text-white shadow-md shadow-[var(--color-primary)]/40 font-bold border-transparent ring-2 ring-[var(--color-primary)] keycap-3d-active';
                }
              } else if (isShiftActive) {
                stateClasses = 'bg-amber-500/25 text-amber-300 border-amber-500/60 ring-2 ring-amber-400/50 animate-pulse keycap-3d';
              } else if (isMatchNext) {
                stateClasses = 'bg-[var(--bg-subtle)] text-[var(--text-main)] border-[var(--color-primary)]/60 ring-1 ring-[var(--color-primary)]/40 keycap-3d';
              }

              return (
                <div
                  key={keyIndex}
                  style={heatBg ? { backgroundColor: heatBg } : undefined}
                  className={`
                    relative flex items-center justify-center
                    h-8 sm:h-11 px-1.5 sm:px-2 rounded-lg text-xs sm:text-sm font-mono
                    select-none transition-all duration-75 cursor-default
                    ${item.width || 'w-7 sm:w-10'}
                    ${stateClasses}
                  `}
                >
                  {/* Key label - crisp rendering */}
                  <span className="font-semibold">{item.display}</span>

                  {/* Tactile bumps for F and J anchors */}
                  {(item.key === 'f' || item.key === 'j') && (
                    <span className="absolute bottom-1 w-2.5 h-0.5 bg-[var(--text-sub)] rounded-full opacity-70" />
                  )}

                  {/* Finger color dot indicator on key corner */}
                  {showFingerGuides && fingerStyle && !isMatchCurrent && !isMatchWrong && !isShiftActive && (
                    <span
                      className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full opacity-65"
                      style={{ backgroundColor: fingerStyle.text }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
