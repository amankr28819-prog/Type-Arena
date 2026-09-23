import React from 'react';

interface TimelinePoint {
  time: number;
  wpm: number;
  rawWpm: number;
  errors: number;
}

interface LiveWpmChartProps {
  timeline: TimelinePoint[];
  height?: number;
  showLabels?: boolean;
}

export const LiveWpmChart: React.FC<LiveWpmChartProps> = ({
  timeline,
  height = 140,
  showLabels = true
}) => {
  if (timeline.length < 2) {
    return (
      <div
        className="w-full flex items-center justify-center text-xs text-[var(--text-sub)] rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)]"
        style={{ height }}
      >
        Waiting for keystrokes to draw live graph...
      </div>
    );
  }

  const maxWpm = Math.max(...timeline.map((p) => Math.max(p.wpm, p.rawWpm)), 60);
  const minTime = timeline[0].time;
  const maxTime = Math.max(timeline[timeline.length - 1].time, minTime + 1);

  const padding = { top: 12, right: 20, bottom: 24, left: 32 };
  const width = 600; // SVG viewBox coordinates
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  const getX = (t: number) => padding.left + ((t - minTime) / (maxTime - minTime)) * plotWidth;
  const getY = (val: number) => padding.top + plotHeight - (val / maxWpm) * plotHeight;

  // Build SVG path strings
  const wpmPoints = timeline.map((p) => `${getX(p.time)},${getY(p.wpm)}`).join(' ');
  const rawPoints = timeline.map((p) => `${getX(p.time)},${getY(p.rawWpm)}`).join(' ');

  // Gradient area path for WPM
  const firstX = getX(timeline[0].time);
  const lastX = getX(timeline[timeline.length - 1].time);
  const bottomY = padding.top + plotHeight;
  const areaPath = `M ${firstX},${bottomY} L ${wpmPoints} L ${lastX},${bottomY} Z`;

  return (
    <div className="w-full rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] p-3">
      {showLabels && (
        <div className="flex items-center justify-between text-xs mb-1 px-1">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 font-medium text-[var(--color-primary)]">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-primary)]" />
              Net WPM
            </span>
            <span className="flex items-center gap-1.5 font-medium text-[var(--text-sub)]">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--text-sub)]" />
              Raw WPM
            </span>
            <span className="flex items-center gap-1.5 font-medium text-[var(--color-error)]">
              <span className="w-2 h-2 rotate-45 bg-[var(--color-error)]" />
              Errors
            </span>
          </div>
          <span className="text-[var(--text-sub)] font-mono">Max: {maxWpm} WPM</span>
        </div>
      )}

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto overflow-visible select-none"
      >
        <defs>
          <linearGradient id="wpmGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.28" />
            <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Horizontal grid lines */}
        {[0, 0.33, 0.66, 1].map((ratio, idx) => {
          const y = padding.top + plotHeight * (1 - ratio);
          const val = Math.round(maxWpm * ratio);
          return (
            <g key={idx}>
              <line
                x1={padding.left}
                y1={y}
                x2={width - padding.right}
                y2={y}
                stroke="var(--border-color)"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
              <text
                x={padding.left - 6}
                y={y + 3}
                fill="var(--text-muted)"
                fontSize="9"
                textAnchor="end"
                fontFamily="monospace"
              >
                {val}
              </text>
            </g>
          );
        })}

        {/* Shaded Area for WPM */}
        <path d={areaPath} fill="url(#wpmGradient)" />

        {/* Raw WPM line (dashed) */}
        <polyline
          fill="none"
          stroke="var(--text-sub)"
          strokeWidth="1.5"
          strokeDasharray="3 3"
          points={rawPoints}
        />

        {/* Net WPM line */}
        <polyline
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={wpmPoints}
        />

        {/* Error markers */}
        {timeline.map((p, idx) => {
          if (p.errors <= 0) return null;
          return (
            <rect
              key={idx}
              x={getX(p.time) - 3}
              y={getY(p.wpm) - 3}
              width="6"
              height="6"
              fill="var(--color-error)"
              transform={`rotate(45 ${getX(p.time)} ${getY(p.wpm)})`}
            />
          );
        })}
      </svg>
    </div>
  );
};
