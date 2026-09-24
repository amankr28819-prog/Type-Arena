import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Trophy,
  Flame,
  Clock,
  Target,
  Trash2,
  AlertOctagon,
  Zap
} from 'lucide-react';
import { storage } from '../lib/storage';
import type { TestResult, PersonalBests, KeyAnalytics, BigramAnalytics } from '../types';
import { VirtualKeyboard } from '../components/typing/VirtualKeyboard';

import { TiltCard } from '../components/ui/TiltCard';

export const StatsPage: React.FC = () => {
  const [history, setHistory] = useState<TestResult[]>([]);
  const [pbs, setPbs] = useState<PersonalBests>(storage.getPersonalBests());
  const [keyStats, setKeyStats] = useState<Record<string, KeyAnalytics>>({});
  const [bigramStats, setBigramStats] = useState<Record<string, BigramAnalytics>>({});

  // Filter states
  const [timeFilter, setTimeFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [modeFilter, setModeFilter] = useState<string>('all');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const hist = await storage.getHistory();
    setHistory(hist);
    setPbs(storage.getPersonalBests());
    const ks = await storage.getKeyStats();
    setKeyStats(ks);
    const bs = await storage.getBigramStats();
    setBigramStats(bs);
  };

  const handleDeleteTest = async (id: string) => {
    await storage.deleteTestResult(id);
    await loadData();
  };

  const handleClearHistory = async () => {
    await storage.clearHistory();
    await loadData();
    setShowClearConfirm(false);
  };

  // Filter history based on time and mode
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;
  const filteredHistory = history.filter((r) => {
    if (modeFilter !== 'all' && r.mode !== modeFilter) return false;

    if (timeFilter === 'today') {
      return now - r.timestamp <= oneDay;
    } else if (timeFilter === 'week') {
      return now - r.timestamp <= 7 * oneDay;
    } else if (timeFilter === 'month') {
      return now - r.timestamp <= 30 * oneDay;
    }
    return true;
  });

  // Calculate aggregated metrics from filtered history
  const totalTests = filteredHistory.length;
  const avgWpm = totalTests > 0
    ? Math.round(filteredHistory.reduce((sum, r) => sum + r.wpm, 0) / totalTests)
    : 0;
  const maxWpm = totalTests > 0
    ? Math.max(...filteredHistory.map((r) => r.wpm))
    : 0;
  const avgAccuracy = totalTests > 0
    ? parseFloat(
        (filteredHistory.reduce((sum, r) => sum + r.accuracy, 0) / totalTests).toFixed(1)
      )
    : 0;
  const totalTimeSeconds = filteredHistory.reduce((sum, r) => sum + r.duration, 0);
  const totalCharacters = filteredHistory.reduce(
    (sum, r) => sum + r.characterStats.correct + r.characterStats.incorrect,
    0
  );

  // Ranked weak keys
  const weakKeys = Object.values(keyStats)
    .filter((k) => k.totalPresses >= 2)
    .sort((a, b) => b.errorRate - a.errorRate || b.avgLatencyMs - a.avgLatencyMs)
    .slice(0, 10);

  // Ranked slow bigrams
  const weakBigrams = Object.values(bigramStats)
    .filter((b) => b.count >= 2)
    .sort((a, b) => b.avgLatencyMs - a.avgLatencyMs)
    .slice(0, 8);

  return (
    <div className="w-full max-w-5xl mx-auto py-6 sm:py-10 px-4 flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[var(--color-primary)] font-bold text-xs uppercase tracking-wider mb-2">
            <BarChart3 className="w-4 h-4" />
            <span>Comprehensive Typing Analytics</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-main)] tracking-tight">
            Performance Statistics & History
          </h1>
          <p className="text-sm text-[var(--text-sub)] mt-1">
            Real typing data recorded exclusively from your completed tests on this device.
          </p>
        </div>

        {/* Time Period Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)]">
          {(['all', 'today', 'week', 'month'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setTimeFilter(filter)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                timeFilter === filter
                  ? 'bg-[var(--color-primary)] text-[var(--bg-main)] shadow-sm'
                  : 'text-[var(--text-sub)] hover:text-[var(--text-main)]'
              }`}
            >
              {filter === 'all' ? 'All-Time' : filter}
            </button>
          ))}
        </div>
      </div>

      {/* Aggregate Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <TiltCard maxTilt={8} className="p-5 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] flex flex-col gap-1 card-3d">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-sub)] flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-[var(--color-primary)]" />
            Avg WPM
          </span>
          <span className="text-4xl font-extrabold font-mono text-[var(--color-primary)]">
            {avgWpm}
          </span>
          <span className="text-[11px] text-[var(--text-sub)]">Peak: {maxWpm} WPM</span>
        </TiltCard>

        <TiltCard maxTilt={8} className="p-5 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] flex flex-col gap-1 card-3d">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-sub)] flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-[var(--color-correct)]" />
            Avg Accuracy
          </span>
          <span className="text-4xl font-extrabold font-mono text-[var(--color-correct)]">
            {avgAccuracy}%
          </span>
          <span className="text-[11px] text-[var(--text-sub)]">Precision index</span>
        </TiltCard>

        <TiltCard maxTilt={8} className="p-5 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] flex flex-col gap-1 card-3d">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-sub)] flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            Tests Completed
          </span>
          <span className="text-4xl font-extrabold font-mono text-[var(--text-main)]">
            {totalTests}
          </span>
          <span className="text-[11px] text-[var(--text-sub)]">
            {Math.round(totalCharacters / 5)} words typed
          </span>
        </TiltCard>

        <TiltCard maxTilt={8} className="p-5 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] flex flex-col gap-1 card-3d">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-sub)] flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            Typing Time
          </span>
          <span className="text-4xl font-extrabold font-mono text-[var(--text-main)]">
            {Math.round(totalTimeSeconds / 60)}m
          </span>
          <span className="text-[11px] text-[var(--text-sub)]">{totalTimeSeconds} seconds total</span>
        </TiltCard>
      </div>

      {/* Personal Bests Section */}
      <div className="card-3d card-3d-glass p-6 sm:p-8 rounded-3xl border border-[var(--border-color)] shadow-xl relative overflow-hidden">
        {/* Subtle Specular Top Highlight */}
        <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[var(--color-primary)]/40 to-transparent pointer-events-none" />
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="w-5 h-5 text-amber-400" />
          <h2 className="text-xl font-bold text-[var(--text-main)]">Local Personal Records</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center font-mono">
          <div className="card-3d p-3.5 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-color)] shadow-xs">
            <span className="text-[11px] text-[var(--text-sub)] uppercase block mb-1">15s Time</span>
            <span className="text-2xl font-bold text-[var(--color-primary)]">
              {pbs.time15 > 0 ? `${pbs.time15} WPM` : '—'}
            </span>
          </div>
          <div className="card-3d p-3.5 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-color)] shadow-xs">
            <span className="text-[11px] text-[var(--text-sub)] uppercase block mb-1">30s Time</span>
            <span className="text-2xl font-bold text-[var(--color-primary)]">
              {pbs.time30 > 0 ? `${pbs.time30} WPM` : '—'}
            </span>
          </div>
          <div className="card-3d p-3.5 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-color)] shadow-xs">
            <span className="text-[11px] text-[var(--text-sub)] uppercase block mb-1">60s Time</span>
            <span className="text-2xl font-bold text-[var(--color-primary)]">
              {pbs.time60 > 0 ? `${pbs.time60} WPM` : '—'}
            </span>
          </div>
          <div className="card-3d p-3.5 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-color)] shadow-xs">
            <span className="text-[11px] text-[var(--text-sub)] uppercase block mb-1">120s Time</span>
            <span className="text-2xl font-bold text-[var(--color-primary)]">
              {pbs.time120 > 0 ? `${pbs.time120} WPM` : '—'}
            </span>
          </div>

          <div className="card-3d p-3.5 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-color)] shadow-xs">
            <span className="text-[11px] text-[var(--text-sub)] uppercase block mb-1">10 Words</span>
            <span className="text-2xl font-bold text-[var(--color-primary)]">
              {pbs.words10 > 0 ? `${pbs.words10} WPM` : '—'}
            </span>
          </div>
          <div className="card-3d p-3.5 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-color)] shadow-xs">
            <span className="text-[11px] text-[var(--text-sub)] uppercase block mb-1">25 Words</span>
            <span className="text-2xl font-bold text-[var(--color-primary)]">
              {pbs.words25 > 0 ? `${pbs.words25} WPM` : '—'}
            </span>
          </div>
          <div className="card-3d p-3.5 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-color)] shadow-xs">
            <span className="text-[11px] text-[var(--text-sub)] uppercase block mb-1">50 Words</span>
            <span className="text-2xl font-bold text-[var(--color-primary)]">
              {pbs.words50 > 0 ? `${pbs.words50} WPM` : '—'}
            </span>
          </div>
          <div className="card-3d p-3.5 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-color)] shadow-xs">
            <span className="text-[11px] text-[var(--text-sub)] uppercase block mb-1">100 Words</span>
            <span className="text-2xl font-bold text-[var(--color-primary)]">
              {pbs.words100 > 0 ? `${pbs.words100} WPM` : '—'}
            </span>
          </div>
        </div>
      </div>

      {/* Weak Keys & Bigram Matrix Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Weak Keys List */}
        <div className="card-3d p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-md">
          <h3 className="text-base font-bold text-[var(--text-main)] mb-1 flex items-center gap-2">
            <AlertOctagon className="w-4 h-4 text-rose-400" />
            Weak Keys (Highest Error Rates)
          </h3>
          <p className="text-xs text-[var(--text-sub)] mb-4">
            Keys where you consistently make mistakes or experience slow strike latencies.
          </p>

          {weakKeys.length > 0 ? (
            <div className="flex flex-col gap-2">
              {weakKeys.map((k) => (
                <div
                  key={k.key}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] text-xs font-mono"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-[var(--bg-surface)] text-[var(--color-primary)] font-bold flex items-center justify-center border border-[var(--border-color)] uppercase">
                      {k.key}
                    </span>
                    <span className="text-[var(--text-sub)]">{k.totalPresses} presses</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[var(--text-sub)]">{k.avgLatencyMs}ms latency</span>
                    <span
                      className={`font-bold ${
                        k.errorRate > 10 ? 'text-[var(--color-error)]' : 'text-yellow-400'
                      }`}
                    >
                      {k.errorRate}% errors
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[var(--text-sub)]">
              Complete typing tests to gather keystroke accuracy data.
            </p>
          )}
        </div>

        {/* Weak Bigrams List */}
        <div className="card-3d p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-md">
          <h3 className="text-base font-bold text-[var(--text-main)] mb-1 flex items-center gap-2">
            <Zap className="w-4 h-4 text-indigo-400" />
            Slow Bigram Transitions
          </h3>
          <p className="text-xs text-[var(--text-sub)] mb-4">
            Two-letter sequences with longest transition delays between strokes.
          </p>

          {weakBigrams.length > 0 ? (
            <div className="flex flex-col gap-2">
              {weakBigrams.map((b) => (
                <div
                  key={b.bigram}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] text-xs font-mono"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="px-2 py-1 rounded-lg bg-[var(--bg-surface)] text-indigo-400 font-bold border border-[var(--border-color)] uppercase">
                      {b.bigram}
                    </span>
                    <span className="text-[var(--text-sub)]">{b.count} samples</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-[var(--text-main)]">{b.avgLatencyMs}ms delay</span>
                    <span
                      className={
                        b.errorRate > 0 ? 'text-[var(--color-error)] font-bold' : 'text-emerald-400'
                      }
                    >
                      {b.errorRate}% err
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[var(--text-sub)]">
              Bigram transition timings will populate as you type.
            </p>
          )}
        </div>
      </div>

      {/* Heatmap Visual Keyboard */}
      <div className="flex flex-col gap-3">
        <h3 className="text-base font-bold text-[var(--text-main)]">
          Keyboard Error Heatmap
        </h3>
        <VirtualKeyboard showFingerGuides={false} showHeatmap={true} keyStats={keyStats} />
      </div>

      {/* Test History Table */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-lg flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-[var(--color-primary)]" />
            <h2 className="text-lg font-bold text-[var(--text-main)]">
              Logged Test History ({filteredHistory.length})
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Mode Filter */}
            <select
              value={modeFilter}
              onChange={(e) => setModeFilter(e.target.value)}
              className="bg-[var(--bg-subtle)] text-[var(--text-main)] px-3 py-1.5 rounded-xl border border-[var(--border-color)] text-xs font-medium cursor-pointer"
            >
              <option value="all">All Modes</option>
              <option value="time">Time</option>
              <option value="words">Words</option>
              <option value="quote">Quote</option>
              <option value="code">Code</option>
              <option value="custom">Custom</option>
            </select>

            {history.length > 0 && (
              <button
                onClick={() => setShowClearConfirm(true)}
                className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear History</span>
              </button>
            )}
          </div>
        </div>

        {/* Confirmation Modal for Clearing History */}
        {showClearConfirm && (
          <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-between text-xs">
            <span className="text-rose-400 font-semibold">
              Permanently delete all stored test history and analytics?
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-3 py-1 rounded-lg bg-[var(--bg-subtle)] text-[var(--text-main)]"
              >
                Cancel
              </button>
              <button
                onClick={handleClearHistory}
                className="px-3 py-1 rounded-lg bg-rose-500 text-white font-bold"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        )}

        {/* Table */}
        {filteredHistory.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-[var(--border-color)] text-[var(--text-sub)] uppercase">
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Mode</th>
                  <th className="py-3 px-3">WPM</th>
                  <th className="py-3 px-3">Raw</th>
                  <th className="py-3 px-3">Accuracy</th>
                  <th className="py-3 px-3">Consistency</th>
                  <th className="py-3 px-3">Duration</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                {filteredHistory.slice(0, 50).map((item) => (
                  <tr key={item.id} className="hover:bg-[var(--bg-subtle)] transition-colors">
                    <td className="py-3 px-3 text-[var(--text-sub)]">
                      {new Date(item.timestamp).toLocaleDateString()} {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3 px-3 capitalize font-bold text-[var(--text-main)]">
                      {item.mode}
                    </td>
                    <td className="py-3 px-3 font-extrabold text-[var(--color-primary)]">
                      {item.wpm}
                    </td>
                    <td className="py-3 px-3 text-[var(--text-sub)]">{item.rawWpm}</td>
                    <td
                      className={`py-3 px-3 font-bold ${
                        item.accuracy >= 95 ? 'text-[var(--color-correct)]' : 'text-yellow-400'
                      }`}
                    >
                      {item.accuracy}%
                    </td>
                    <td className="py-3 px-3 text-[var(--text-main)]">{item.consistency}%</td>
                    <td className="py-3 px-3 text-[var(--text-sub)]">{item.duration}s</td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => handleDeleteTest(item.id)}
                        className="p-1 rounded text-[var(--text-sub)] hover:text-rose-400 transition-colors"
                        title="Delete this test record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center py-8 text-xs text-[var(--text-sub)]">
            No tests match the selected filter. Complete a test on the Type tab!
          </p>
        )}
      </div>
    </div>
  );
};
