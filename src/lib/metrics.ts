import type {
  KeystrokeEvent,
  CharacterStats,
  KeyAnalytics,
  BigramAnalytics,
  ExamConfig
} from '../types';

export function calculateWpm(correctChars: number, timeSeconds: number): number {
  if (timeSeconds < 0.2) return 0;
  const minutes = timeSeconds / 60;
  // Standard metric: 5 characters = 1 word
  const wpm = (correctChars / 5) / minutes;
  return Math.max(0, Math.round(wpm));
}

export function calculateRawWpm(totalKeystrokes: number, timeSeconds: number): number {
  if (timeSeconds < 0.2) return 0;
  const minutes = timeSeconds / 60;
  const raw = (totalKeystrokes / 5) / minutes;
  return Math.max(0, Math.round(raw));
}

export function calculateNetWpm(rawWpm: number, uncorrectedErrors: number, timeSeconds: number): number {
  if (timeSeconds < 0.2) return 0;
  const minutes = timeSeconds / 60;
  const errorPenalty = uncorrectedErrors / minutes;
  return Math.max(0, Math.round(rawWpm - errorPenalty));
}

export function calculateAccuracy(stats: CharacterStats): number {
  const total = stats.correct + stats.incorrect + stats.extra;
  if (total <= 0) return 100;
  const acc = (stats.correct / total) * 100;
  return Math.min(100, Math.max(0, parseFloat(acc.toFixed(1))));
}

export function calculateConsistency(keystrokes: KeystrokeEvent[]): number {
  if (keystrokes.length < 5) return 100;

  const latencies = keystrokes.map((k) => k.latencyMs).filter((l) => l > 0 && l < 2000);
  if (latencies.length < 5) return 100;

  const mean = latencies.reduce((a, b) => a + b, 0) / latencies.length;
  if (mean === 0) return 100;

  const variance = latencies.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / latencies.length;
  const stdDev = Math.sqrt(variance);

  // Coefficient of Variation = stdDev / mean
  // Lower CV = higher consistency
  const cv = stdDev / mean;
  const score = Math.max(0, Math.min(100, Math.round(100 * (1 - cv * 0.5))));
  return score;
}

export function extractKeyAnalytics(keystrokes: KeystrokeEvent[]): Record<string, KeyAnalytics> {
  const map: Record<string, { total: number; errors: number; totalLatency: number }> = {};

  for (const k of keystrokes) {
    const key = k.expected.toLowerCase();
    if (!key || key === ' ' || key.length > 1) continue;

    if (!map[key]) {
      map[key] = { total: 0, errors: 0, totalLatency: 0 };
    }
    map[key].total += 1;
    if (!k.isCorrect) {
      map[key].errors += 1;
    }
    map[key].totalLatency += k.latencyMs;
  }

  const result: Record<string, KeyAnalytics> = {};
  for (const [key, data] of Object.entries(map)) {
    result[key] = {
      key,
      totalPresses: data.total,
      errorCount: data.errors,
      errorRate: data.total > 0 ? parseFloat(((data.errors / data.total) * 100).toFixed(1)) : 0,
      avgLatencyMs: data.total > 0 ? Math.round(data.totalLatency / data.total) : 0
    };
  }

  return result;
}

export function extractBigramAnalytics(keystrokes: KeystrokeEvent[]): Record<string, BigramAnalytics> {
  const map: Record<string, { count: number; errors: number; totalLatency: number }> = {};

  for (let i = 1; i < keystrokes.length; i++) {
    const prev = keystrokes[i - 1].expected.toLowerCase();
    const curr = keystrokes[i].expected.toLowerCase();

    // Check only alphanumeric bigrams
    if (!/^[a-z0-9]$/.test(prev) || !/^[a-z0-9]$/.test(curr)) continue;

    const bigram = `${prev}${curr}`;
    if (!map[bigram]) {
      map[bigram] = { count: 0, errors: 0, totalLatency: 0 };
    }

    map[bigram].count += 1;
    if (!keystrokes[i].isCorrect) {
      map[bigram].errors += 1;
    }
    map[bigram].totalLatency += keystrokes[i].latencyMs;
  }

  const result: Record<string, BigramAnalytics> = {};
  for (const [bigram, data] of Object.entries(map)) {
    result[bigram] = {
      bigram,
      count: data.count,
      errorCount: data.errors,
      errorRate: data.count > 0 ? parseFloat(((data.errors / data.count) * 100).toFixed(1)) : 0,
      avgLatencyMs: data.count > 0 ? Math.round(data.totalLatency / data.count) : 0
    };
  }

  return result;
}

export function evaluateExam(
  wpm: number,
  accuracy: number,
  errors: number,
  config: ExamConfig
): { passed: boolean; reasons: string[] } {
  const reasons: string[] = [];
  let passed = true;

  if (wpm < config.minWpm) {
    passed = false;
    reasons.push(`WPM of ${wpm} is below the required ${config.minWpm} WPM.`);
  }

  if (accuracy < config.minAccuracy) {
    passed = false;
    reasons.push(`Accuracy of ${accuracy}% is below the required ${config.minAccuracy}%.`);
  }

  if (config.strictStopOnError && errors > 0) {
    passed = false;
    reasons.push(`Strict error tolerance exceeded (${errors} errors encountered).`);
  }

  return { passed, reasons };
}

export function calculateBurstSpeed(keystrokes: KeystrokeEvent[]): number {
  if (keystrokes.length < 5) return 0;
  let maxBurst = 0;
  const windowSize = Math.min(15, keystrokes.length);

  for (let i = windowSize - 1; i < keystrokes.length; i++) {
    const win = keystrokes.slice(i - windowSize + 1, i + 1);
    const correctCount = win.filter((k) => k.isCorrect).length;
    const windowDurationMs = win.reduce((sum, k) => sum + Math.max(15, k.latencyMs), 0);
    if (windowDurationMs > 100) {
      const durationMin = windowDurationMs / 1000 / 60;
      const burstWpm = (correctCount / 5) / durationMin;
      if (burstWpm > maxBurst && isFinite(burstWpm)) {
        maxBurst = Math.round(burstWpm);
      }
    }
  }

  return Math.min(300, maxBurst);
}
