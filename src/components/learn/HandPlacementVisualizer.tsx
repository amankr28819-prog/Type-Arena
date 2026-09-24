import React from 'react';
import {
  getFingerForKey,
  getFingerForChar,
  type FingerId,
  type ReachDirection,
  type HandSide
} from '../../lib/fingerMapping';

export { getFingerForKey, getFingerForChar };

export interface HandPlacementVisualizerProps {
  /** The active expected character the user must press right now */
  targetChar?: string;
  /** Legacy alias for targetChar */
  nextChar?: string;
  /** The upcoming character after the active target */
  upcomingChar?: string;
  /** The most recently typed character */
  currentChar?: string;
  /** Whether the user just made a mistake */
  isError?: boolean;
  /** The mistyped key if an error occurred */
  wrongChar?: string;
  className?: string;
  compact?: boolean;
}

interface FingerVisualConfig {
  id: FingerId;
  name: string;
  code: string;
  homeKey: string;
  color: string;
  hand: HandSide;
  height: number;
  width: number;
  isAnchor?: boolean;
}

const LEFT_FINGERS: FingerVisualConfig[] = [
  { id: 'left-pinky', name: 'Pinky', code: 'lp', homeKey: 'A', color: '#ec4899', hand: 'left', height: 72, width: 22 },
  { id: 'left-ring', name: 'Ring', code: 'lr', homeKey: 'S', color: '#a855f7', hand: 'left', height: 86, width: 23 },
  { id: 'left-middle', name: 'Middle', code: 'lm', homeKey: 'D', color: '#3b82f6', hand: 'left', height: 96, width: 24 },
  { id: 'left-index', name: 'Index', code: 'li', homeKey: 'F', color: '#10b981', hand: 'left', height: 88, width: 25, isAnchor: true },
  { id: 'left-thumb', name: 'Thumb', code: 'th', homeKey: 'Space', color: '#f59e0b', hand: 'left', height: 56, width: 26 }
];

const RIGHT_FINGERS: FingerVisualConfig[] = [
  { id: 'right-thumb', name: 'Thumb', code: 'th', homeKey: 'Space', color: '#f59e0b', hand: 'right', height: 56, width: 26 },
  { id: 'right-index', name: 'Index', code: 'ri', homeKey: 'J', color: '#14b8a6', hand: 'right', height: 88, width: 25, isAnchor: true },
  { id: 'right-middle', name: 'Middle', code: 'rm', homeKey: 'K', color: '#3b82f6', hand: 'right', height: 96, width: 24 },
  { id: 'right-ring', name: 'Ring', code: 'rr', homeKey: 'L', color: '#a855f7', hand: 'right', height: 86, width: 23 },
  { id: 'right-pinky', name: 'Pinky', code: 'rp', homeKey: ';', color: '#ec4899', hand: 'right', height: 72, width: 22 }
];

export const HandPlacementVisualizer: React.FC<HandPlacementVisualizerProps> = ({
  targetChar,
  nextChar,
  upcomingChar,
  isError = false,
  wrongChar = '',
  className = '',
  compact = false
}) => {
  // Canonical target: targetChar takes precedence; fall back to nextChar for backwards compatibility
  const activeChar = targetChar !== undefined ? targetChar : (nextChar || '');
  const targetAssignment = getFingerForKey(activeChar);
  const activeFingerId = targetAssignment.fingerId;

  // Wrong key analysis (does NOT change active target finger)
  const wrongAssignment = wrongChar ? getFingerForKey(wrongChar) : null;
  const wrongFingerId = wrongAssignment ? wrongAssignment.fingerId : null;

  // Upcoming key preview
  const upcomingAssignment = upcomingChar ? getFingerForKey(upcomingChar) : null;

  /**
   * Anatomically natural finger reach translation & rotation
   * Only the target finger moves; other fingers stay anchored at home row.
   */
  const getFingerTransform = (finger: FingerVisualConfig): string => {
    if (finger.id === activeFingerId) {
      const reach: ReachDirection = targetAssignment.reachDirection;
      const lower = activeChar.toLowerCase();

      // Specific reach nuances for QWERTY rows
      if (reach === 'up') {
        if (lower === 't') {
          // Left index reaching up and slightly right for T
          return 'translate(5px, -15px) rotate(4deg)';
        }
        if (lower === 'y') {
          // Right index reaching up and slightly left for Y
          return 'translate(-5px, -15px) rotate(-4deg)';
        }
        if (lower === 'r' || lower === 'e' || lower === 'w' || lower === 'q') {
          return 'translate(0px, -14px)';
        }
        if (lower === 'u' || lower === 'i' || lower === 'o' || lower === 'p') {
          return 'translate(0px, -14px)';
        }
        return 'translateY(-14px)';
      }

      if (reach === 'inner') {
        // G or H inner reach
        return finger.hand === 'left'
          ? 'translate(10px, -4px) rotate(5deg)'
          : 'translate(-10px, -4px) rotate(-5deg)';
      }

      if (reach === 'down') {
        if (lower === 'b') {
          return 'translate(6px, 12px) rotate(4deg)';
        }
        if (lower === 'n') {
          return 'translate(-6px, 12px) rotate(-4deg)';
        }
        return 'translateY(11px)';
      }

      // Home key tap
      return 'translateY(2px)';
    }

    // Passive fingers remain in resting home position
    if (finger.id === 'left-thumb') {
      return 'rotate(-20deg) translateY(4px)';
    }
    if (finger.id === 'right-thumb') {
      return 'rotate(20deg) translateY(4px)';
    }

    return 'translateY(0)';
  };

  const renderHand = (side: HandSide, fingers: FingerVisualConfig[]) => {
    const isHandActive = targetAssignment.hand === side;
    const isShiftHand = targetAssignment.needsShift && targetAssignment.shiftHand === side;

    return (
      <div className="relative flex flex-col items-center">
        {/* Active Hand Label */}
        <div className="flex items-center gap-1.5 mb-2">
          <span
            className={`text-[11px] font-bold uppercase tracking-wider transition-colors ${
              isHandActive
                ? 'text-[var(--color-primary)]'
                : 'text-[var(--text-sub)] opacity-70'
            }`}
          >
            {side === 'left' ? 'Left Hand' : 'Right Hand'}
          </span>
          {isShiftHand && (
            <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse">
              Hold Shift
            </span>
          )}
        </div>

        {/* 3D Anatomical Hand Contour Container */}
        <div
          className={`relative p-3 sm:p-4 rounded-3xl border transition-all duration-200 card-3d ${
            isHandActive
              ? 'border-[var(--color-primary)]/50 bg-[var(--bg-surface)] shadow-lg shadow-[var(--color-primary)]/10'
              : 'border-[var(--border-color)]/60 bg-[var(--bg-surface)]/80'
          }`}
          style={{
            minWidth: compact ? '160px' : '205px'
          }}
        >
          {/* Palm Base Contour SVG (Subtle anatomy backing) */}
          <div className="absolute inset-x-2 bottom-2 h-20 pointer-events-none opacity-30 rounded-2xl bg-gradient-to-t from-[var(--border-color)] to-transparent" />

          {/* Fingers Row */}
          <div className="relative z-10 flex items-end justify-center gap-1.5 sm:gap-2 h-28 sm:h-32 pb-4">
            {fingers.map((finger) => {
              const isActive = finger.id === activeFingerId;
              const isWrong = isError && finger.id === wrongFingerId;
              const isShift = isShiftHand && finger.code === targetAssignment.shiftFingerCode;
              const transform = getFingerTransform(finger);

              // Height scaling for compact mode
              const h = compact ? Math.round(finger.height * 0.85) : finger.height;
              const w = compact ? Math.max(18, finger.width - 3) : finger.width;

              return (
                <div
                  key={finger.id}
                  style={{
                    width: `${w}px`,
                    height: `${h}px`,
                    transform,
                    transition: 'transform 0.14s cubic-bezier(0.2, 0.9, 0.3, 1), box-shadow 0.15s ease, border-color 0.15s ease, background 0.15s ease'
                  }}
                  className={`relative flex flex-col items-center justify-between py-1.5 sm:py-2 rounded-2xl border select-none cursor-default ${
                    isWrong
                      ? 'z-30 border-rose-500 bg-rose-500/25 shadow-[0_0_16px_rgba(244,63,94,0.7)] animate-pulse'
                      : isActive
                      ? 'z-20 border-[var(--color-primary)] bg-[var(--color-primary)]/15 shadow-[0_0_18px_var(--theme-glow)]'
                      : isShift
                      ? 'z-20 border-amber-400 bg-amber-400/20 shadow-[0_0_14px_rgba(251,191,36,0.6)] animate-pulse'
                      : 'border-[var(--border-color)]/70 bg-[var(--bg-subtle)]/75 opacity-75 hover:opacity-100'
                  }`}
                >
                  {/* Fingertip Light Indicator Pad */}
                  <div
                    className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center transition-all ${
                      isActive || isShift
                        ? 'ring-2 ring-[var(--color-primary)] shadow-sm'
                        : 'opacity-40'
                    }`}
                    style={{
                      backgroundColor: isWrong ? '#f43f5e' : isShift ? '#f59e0b' : finger.color
                    }}
                  >
                    {isActive && (
                      <div className="w-1.5 h-1.5 rounded-full bg-white animate-ping opacity-75" />
                    )}
                  </div>

                  {/* Phalanx Joint Creases (Anatomical realism) */}
                  <div className="w-full flex flex-col items-center gap-1.5 opacity-35">
                    <div className="w-2.5 h-[1px] bg-[var(--text-sub)] rounded-full" />
                    <div className="w-3.5 h-[1px] bg-[var(--text-sub)] rounded-full" />
                  </div>

                  {/* Home Key Label & Anchor Bump */}
                  <div className="flex flex-col items-center">
                    <span
                      className={`text-[9px] sm:text-[10px] font-mono font-bold leading-none ${
                        isActive
                          ? 'text-[var(--color-primary)]'
                          : isWrong
                          ? 'text-rose-400'
                          : 'text-[var(--text-sub)]'
                      }`}
                    >
                      {finger.homeKey}
                    </span>

                    {/* Physical anchor bump on F and J */}
                    {finger.isAnchor && (
                      <span className="w-2 h-0.5 mt-0.5 bg-[var(--color-primary)] rounded-full opacity-80" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Knuckle Arch Accent */}
          <div className="w-full h-1 bg-[var(--border-color)]/50 rounded-full" />
        </div>
      </div>
    );
  };

  return (
    <div
      className={`w-full max-w-4xl mx-auto rounded-3xl p-4 sm:p-5 card-3d border border-[var(--border-color)] shadow-xl ${className}`}
    >
      {/* Header Guidance Banner: Single Source of Truth */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-[var(--border-color)]">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-primary)] animate-pulse" />
          <span className="text-xs font-semibold text-[var(--text-sub)] uppercase tracking-wider">
            Touch-Typing Finger Guidance:
          </span>
          <div
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl font-bold text-xs border shadow-xs"
            style={{
              backgroundColor: targetAssignment.color + '20',
              borderColor: targetAssignment.color,
              color: targetAssignment.color
            }}
          >
            <span>Target:</span>
            <span className="font-mono text-sm px-1.5 py-0.2 bg-[var(--bg-main)] rounded">
              {activeChar === ' ' ? 'Space' : activeChar.toUpperCase()}
            </span>
            <span>({targetAssignment.fingerName})</span>
          </div>

          {targetAssignment.needsShift && targetAssignment.shiftFingerName && (
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Hold {targetAssignment.shiftFingerName}
            </span>
          )}
        </div>

        {/* Upcoming Key or Reach Description */}
        <div className="flex items-center gap-3 text-xs text-[var(--text-sub)] font-medium">
          {upcomingAssignment && (
            <div className="flex items-center gap-1">
              <span>Next up:</span>
              <strong className="font-mono text-[var(--text-main)] px-1.5 py-0.5 rounded bg-[var(--bg-subtle)] border border-[var(--border-color)]">
                {upcomingChar === ' ' ? '␣' : upcomingChar?.toUpperCase()}
              </strong>
              <span className="text-[11px] opacity-75">({upcomingAssignment.fingerName})</span>
            </div>
          )}

          <div className="hidden md:flex items-center gap-1 text-[11px]">
            <span>Reach:</span>
            <strong className="text-[var(--text-main)] capitalize">
              {targetAssignment.reachDirection === 'home'
                ? 'Home Row'
                : `${targetAssignment.reachDirection} reach`}
            </strong>
          </div>
        </div>
      </div>

      {/* Hands Container */}
      <div className="flex flex-col sm:flex-row items-center justify-around gap-6 sm:gap-8">
        {renderHand('left', LEFT_FINGERS)}
        {renderHand('right', RIGHT_FINGERS)}
      </div>

      {/* Touch-Typing Posture Tip */}
      <div className="mt-3.5 pt-2.5 border-t border-[var(--border-color)]/60 text-center text-[11px] text-[var(--text-sub)]">
        Keep wrists elevated and gently hovering above the desk. Keep index fingers anchored on the{' '}
        <strong className="text-[var(--color-primary)]">F</strong> and{' '}
        <strong className="text-[var(--color-primary)]">J</strong> tactile bumps.
      </div>
    </div>
  );
};
