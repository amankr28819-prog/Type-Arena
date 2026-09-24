import React from 'react';

export type FingerId =
  | 'left-pinky'
  | 'left-ring'
  | 'left-middle'
  | 'left-index'
  | 'left-thumb'
  | 'right-thumb'
  | 'right-index'
  | 'right-middle'
  | 'right-ring'
  | 'right-pinky';

export interface FingerAssignment {
  id: FingerId;
  hand: 'left' | 'right';
  name: string;
  homeKey: string;
  color: string;
  reachDirection: 'home' | 'up' | 'down' | 'inner' | 'outer';
}

export function getFingerForChar(char: string): FingerAssignment {
  const c = char ? char.toLowerCase() : '';

  // Thumbs
  if (c === ' ' || c === 'space') {
    return {
      id: 'right-thumb',
      hand: 'right',
      name: 'Thumbs',
      homeKey: 'Space',
      color: '#f59e0b',
      reachDirection: 'home'
    };
  }

  // Left Pinky
  if (['a', 'q', 'z', '1', '`', '~', '!', 'tab', 'capslock'].includes(c)) {
    let reach: FingerAssignment['reachDirection'] = 'home';
    if (['q', '1', '`', '~', '!'].includes(c)) reach = 'up';
    else if (c === 'z') reach = 'down';
    return {
      id: 'left-pinky',
      hand: 'left',
      name: 'Left Pinky',
      homeKey: 'A',
      color: '#ec4899',
      reachDirection: reach
    };
  }

  // Left Ring
  if (['s', 'w', 'x', '2', '@'].includes(c)) {
    let reach: FingerAssignment['reachDirection'] = 'home';
    if (['w', '2', '@'].includes(c)) reach = 'up';
    else if (c === 'x') reach = 'down';
    return {
      id: 'left-ring',
      hand: 'left',
      name: 'Left Ring',
      homeKey: 'S',
      color: '#a855f7',
      reachDirection: reach
    };
  }

  // Left Middle
  if (['d', 'e', 'c', '3', '#'].includes(c)) {
    let reach: FingerAssignment['reachDirection'] = 'home';
    if (['e', '3', '#'].includes(c)) reach = 'up';
    else if (c === 'c') reach = 'down';
    return {
      id: 'left-middle',
      hand: 'left',
      name: 'Left Middle',
      homeKey: 'D',
      color: '#3b82f6',
      reachDirection: reach
    };
  }

  // Left Index
  if (['f', 'r', 'v', '4', '$', 'g', 't', 'b', '5', '%'].includes(c)) {
    let reach: FingerAssignment['reachDirection'] = 'home';
    if (['r', 't', '4', '5', '$', '%'].includes(c)) reach = 'up';
    else if (['v', 'b'].includes(c)) reach = 'down';
    else if (['g'].includes(c)) reach = 'inner';
    return {
      id: 'left-index',
      hand: 'left',
      name: 'Left Index',
      homeKey: 'F',
      color: '#10b981',
      reachDirection: reach
    };
  }

  // Right Index
  if (['j', 'u', 'm', '7', '&', 'h', 'y', 'n', '6', '^'].includes(c)) {
    let reach: FingerAssignment['reachDirection'] = 'home';
    if (['u', 'y', '6', '7', '^', '&'].includes(c)) reach = 'up';
    else if (['m', 'n'].includes(c)) reach = 'down';
    else if (['h'].includes(c)) reach = 'inner';
    return {
      id: 'right-index',
      hand: 'right',
      name: 'Right Index',
      homeKey: 'J',
      color: '#14b8a6',
      reachDirection: reach
    };
  }

  // Right Middle
  if (['k', 'i', ',', '<', '8', '*'].includes(c)) {
    let reach: FingerAssignment['reachDirection'] = 'home';
    if (['i', '8', '*'].includes(c)) reach = 'up';
    else if ([',', '<'].includes(c)) reach = 'down';
    return {
      id: 'right-middle',
      hand: 'right',
      name: 'Right Middle',
      homeKey: 'K',
      color: '#3b82f6',
      reachDirection: reach
    };
  }

  // Right Ring
  if (['l', 'o', '.', '>', '9', '('].includes(c)) {
    let reach: FingerAssignment['reachDirection'] = 'home';
    if (['o', '9', '('].includes(c)) reach = 'up';
    else if (['.', '>'].includes(c)) reach = 'down';
    return {
      id: 'right-ring',
      hand: 'right',
      name: 'Right Ring',
      homeKey: 'L',
      color: '#a855f7',
      reachDirection: reach
    };
  }

  // Right Pinky (default fallback for punctuation / right side)
  let reach: FingerAssignment['reachDirection'] = 'home';
  if (['p', '0', '-', '=', '[', ']', '_', '+', '{', '}'].includes(c)) reach = 'up';
  else if (['/', '?'].includes(c)) reach = 'down';

  return {
    id: 'right-pinky',
    hand: 'right',
    name: 'Right Pinky',
    homeKey: ';',
    color: '#ec4899',
    reachDirection: reach
  };
}

interface HandPlacementVisualizerProps {
  nextChar: string;
  currentChar?: string;
  isError?: boolean;
  className?: string;
  compact?: boolean;
}

export const HandPlacementVisualizer: React.FC<HandPlacementVisualizerProps> = ({
  nextChar,
  isError = false,
  className = '',
  compact = false
}) => {
  const activeAssignment = getFingerForChar(nextChar);
  const activeId = activeAssignment.id;

  // Compute CSS transform animation based on reach direction
  const getFingerTransform = (fingerId: FingerId) => {
    if (fingerId !== activeId) return '';

    switch (activeAssignment.reachDirection) {
      case 'up':
        return 'translateY(-10px) scale(1.06)';
      case 'down':
        return 'translateY(8px) scale(0.95)';
      case 'inner':
        return activeAssignment.hand === 'left'
          ? 'translate(8px, -4px) rotate(4deg)'
          : 'translate(-8px, -4px) rotate(-4deg)';
      case 'home':
      default:
        return 'translateY(3px) scale(0.98)';
    }
  };

  const renderFinger = (
    id: FingerId,
    _name: string,
    homeKey: string,
    color: string,
    width: number,
    height: number,
    radius: number,
    hasNub: boolean = false
  ) => {
    const isActive = id === activeId;
    const transform = getFingerTransform(id);

    return (
      <div
        key={id}
        style={{
          width: `${width}px`,
          height: `${height}px`,
          borderRadius: `${radius}px`,
          transform,
          backgroundColor: isActive
            ? 'color-mix(in srgb, var(--color-primary) 22%, var(--bg-surface))'
            : undefined,
          transition: 'transform 0.12s cubic-bezier(0.2, 0.9, 0.3, 1), box-shadow 0.15s ease, background 0.15s ease'
        }}
        className={`relative flex flex-col items-center justify-between py-2 border transition-all select-none ${
          isActive
            ? 'z-20 border-[var(--color-primary)] shadow-[0_0_18px_var(--theme-glow)] brightness-115'
            : 'border-[var(--border-color)]/70 bg-[var(--bg-subtle)]/70 opacity-80 hover:opacity-100'
        } ${isError && isActive ? '!border-rose-500 !shadow-[0_0_16px_rgba(244,63,94,0.6)]' : ''}`}
      >
        {/* Fingertip Highlight Glow Pad */}
        <div
          className={`w-3.5 h-3.5 rounded-full flex items-center justify-center transition-all ${
            isActive
              ? 'scale-110 ring-2 ring-[var(--color-primary)] shadow-sm'
              : 'opacity-40'
          }`}
          style={{ backgroundColor: color }}
        >
          {isActive && (
            <div className="w-1.5 h-1.5 rounded-full bg-white animate-ping opacity-75" />
          )}
        </div>

        {/* Tactile Nub for F and J */}
        {hasNub && (
          <div
            className="w-1.5 h-0.5 rounded-full bg-[var(--text-sub)] shadow-inner my-1 opacity-70"
            title="Tactile Nub Home Row Guide"
          />
        )}

        {/* Home Key resting guide */}
        <span
          className={`text-[10px] font-mono font-bold uppercase transition-colors ${
            isActive ? 'text-[var(--color-primary)]' : 'text-[var(--text-sub)]'
          }`}
        >
          {homeKey}
        </span>
      </div>
    );
  };

  return (
    <div
      className={`card-3d p-4 sm:p-5 rounded-2xl bg-[var(--bg-surface)]/90 border border-[var(--border-color)] shadow-md flex flex-col items-center justify-between gap-4 ${className}`}
    >
      {/* Live Finger Guidance Header */}
      <div className="w-full flex items-center justify-between border-b border-[var(--border-color)] pb-3 px-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[var(--text-sub)] uppercase tracking-wider">
            Hand Placement & Finger Reach
          </span>
          <span
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: activeAssignment.color }}
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--text-sub)]">Next:</span>
          <kbd className="px-2.5 py-1 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-color)] text-[var(--color-primary)] font-mono font-bold text-xs shadow-xs">
            {nextChar === ' ' ? 'Space ␣' : nextChar || '—'}
          </kbd>
          <span className="hidden sm:inline text-xs font-semibold text-[var(--text-main)]">
            {activeAssignment.name}
          </span>
        </div>
      </div>

      {/* Visual Anatomical Dual-Hand Deck */}
      <div className="w-full flex items-end justify-center gap-6 sm:gap-14 py-2 overflow-x-auto">
        {/* LEFT HAND */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-[11px] font-bold uppercase text-[var(--text-sub)] tracking-wider">
            Left Hand
          </span>

          <div className="flex items-end gap-1.5 sm:gap-2 bg-[var(--bg-subtle)]/40 p-2.5 rounded-2xl border border-[var(--border-color)]/60">
            {/* Left Pinky */}
            {renderFinger('left-pinky', 'Pinky', 'A', '#ec4899', compact ? 26 : 30, compact ? 68 : 80, 10)}
            {/* Left Ring */}
            {renderFinger('left-ring', 'Ring', 'S', '#a855f7', compact ? 26 : 30, compact ? 82 : 95, 10)}
            {/* Left Middle */}
            {renderFinger('left-middle', 'Middle', 'D', '#3b82f6', compact ? 28 : 32, compact ? 92 : 108, 10)}
            {/* Left Index (with F nub) */}
            {renderFinger('left-index', 'Index', 'F', '#10b981', compact ? 28 : 32, compact ? 82 : 96, 10, true)}
            {/* Left Thumb */}
            {renderFinger('left-thumb', 'Thumb', '␣', '#f59e0b', compact ? 26 : 30, compact ? 54 : 64, 8)}
          </div>
        </div>

        {/* RIGHT HAND */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-[11px] font-bold uppercase text-[var(--text-sub)] tracking-wider">
            Right Hand
          </span>

          <div className="flex items-end gap-1.5 sm:gap-2 bg-[var(--bg-subtle)]/40 p-2.5 rounded-2xl border border-[var(--border-color)]/60">
            {/* Right Thumb */}
            {renderFinger('right-thumb', 'Thumb', '␣', '#f59e0b', compact ? 26 : 30, compact ? 54 : 64, 8)}
            {/* Right Index (with J nub) */}
            {renderFinger('right-index', 'Index', 'J', '#14b8a6', compact ? 28 : 32, compact ? 82 : 96, 10, true)}
            {/* Right Middle */}
            {renderFinger('right-middle', 'Middle', 'K', '#3b82f6', compact ? 28 : 32, compact ? 92 : 108, 10)}
            {/* Right Ring */}
            {renderFinger('right-ring', 'Ring', 'L', '#a855f7', compact ? 26 : 30, compact ? 82 : 95, 10)}
            {/* Right Pinky */}
            {renderFinger('right-pinky', 'Pinky', ';', '#ec4899', compact ? 26 : 30, compact ? 68 : 80, 10)}
          </div>
        </div>
      </div>

      {/* Tactile Feedback Footer */}
      <div className="w-full flex items-center justify-between text-[11px] text-[var(--text-sub)] border-t border-[var(--border-color)]/60 pt-2 px-1 font-mono">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />
          <span>Rest fingers on ASDF &amp; JKL; anchors</span>
        </div>
        <div>
          <span>Target Finger: <strong className="text-[var(--text-main)] font-bold">{activeAssignment.name}</strong></span>
        </div>
      </div>
    </div>
  );
};
