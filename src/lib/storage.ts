import type {
  TestResult,
  PersonalBests,
  UserSettings,
  CourseProgress,
  SubLessonProgress,
  LearnStats,
  KeyAnalytics,
  BigramAnalytics
} from '../types';
import { extractKeyAnalytics, extractBigramAnalytics } from './metrics';
import { DETAILED_LESSONS, getAllSubLessonsCount } from './learnCurriculum';

const DB_NAME = 'TypeArenaDB';
const DB_VERSION = 2;
const STORE_HISTORY = 'history';
const STORE_KEY_STATS = 'key_stats';
const STORE_BIGRAM_STATS = 'bigram_stats';
const STORE_COURSE_PROGRESS = 'course_progress';
const STORE_SUBLESSON_PROGRESS = 'sublesson_progress';

const STORAGE_KEY_SETTINGS = 'typearena_settings';
const STORAGE_KEY_PBS = 'typearena_pbs';
const STORAGE_KEY_SUBLESSON_FALLBACK = 'typearena_sublessons_fallback';

export const DEFAULT_SETTINGS: UserSettings = {
  themeId: 'paper-clean',
  customThemes: [],
  layout: 'classic',
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: 24,
  caretStyle: 'line',
  smoothCaret: true,
  soundProfile: 'clicky',
  soundVolume: 0.6,
  playErrorSound: true,
  blindMode: false,
  stopOnError: false,
  disableBackspace: false,
  difficulty: 'normal',
  minWpm: 0,
  minAccuracy: 0,
  targetWpm: 0,
  showLiveWpm: true,
  showLiveAccuracy: true,
  showLiveTimer: true,
  showVirtualKeyboard: true,
  keyboardHeatmap: false,
  reducedMotion: false,
  highContrast: false,
  language: 'english',
  punctuation: false,
  numbers: false,
  animationIntensity: 'medium',
  uiDepth: 'medium',
  backgroundAtmosphere: 'dynamic',
  glassmorphism: true,
  cardTilt: true,
  cursorGlow: true,
  themePreset: 'balanced',
};

export const DEFAULT_PBS: PersonalBests = {
  time15: 0,
  time30: 0,
  time60: 0,
  time120: 0,
  words10: 0,
  words25: 0,
  words50: 0,
  words100: 0,
  bestAccuracy: 0,
  bestConsistency: 0,
};

class StorageManager {
  private dbPromise: Promise<IDBDatabase | null> | null = null;

  constructor() {
    this.initDB();
  }

  private initDB(): Promise<IDBDatabase | null> {
    if (this.dbPromise) return this.dbPromise;

    if (typeof window === 'undefined' || !window.indexedDB) {
      this.dbPromise = Promise.resolve(null);
      return this.dbPromise;
    }

    this.dbPromise = new Promise((resolve) => {
      try {
        const request = window.indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains(STORE_HISTORY)) {
            const store = db.createObjectStore(STORE_HISTORY, { keyPath: 'id' });
            store.createIndex('timestamp', 'timestamp', { unique: false });
          }
          if (!db.objectStoreNames.contains(STORE_KEY_STATS)) {
            db.createObjectStore(STORE_KEY_STATS, { keyPath: 'key' });
          }
          if (!db.objectStoreNames.contains(STORE_BIGRAM_STATS)) {
            db.createObjectStore(STORE_BIGRAM_STATS, { keyPath: 'bigram' });
          }
          if (!db.objectStoreNames.contains(STORE_COURSE_PROGRESS)) {
            db.createObjectStore(STORE_COURSE_PROGRESS, { keyPath: 'lessonId' });
          }
          if (!db.objectStoreNames.contains(STORE_SUBLESSON_PROGRESS)) {
            db.createObjectStore(STORE_SUBLESSON_PROGRESS, { keyPath: 'subLessonId' });
          }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => {
          console.warn('IndexedDB unavailable, falling back to localStorage');
          resolve(null);
        };
      } catch {
        resolve(null);
      }
    });

    return this.dbPromise;
  }

  // --- Settings ---
  public getSettings(): UserSettings {
    if (typeof window === 'undefined') return DEFAULT_SETTINGS;
    try {
      const data = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (data) {
        const parsed = JSON.parse(data);
        return {
          ...DEFAULT_SETTINGS,
          ...parsed,
          uiDepth: parsed.uiDepth ?? DEFAULT_SETTINGS.uiDepth,
          animationIntensity: parsed.animationIntensity ?? DEFAULT_SETTINGS.animationIntensity,
          backgroundAtmosphere: parsed.backgroundAtmosphere ?? DEFAULT_SETTINGS.backgroundAtmosphere,
          cardTilt: parsed.cardTilt ?? DEFAULT_SETTINGS.cardTilt,
          glassmorphism: parsed.glassmorphism ?? DEFAULT_SETTINGS.glassmorphism,
          cursorGlow: parsed.cursorGlow ?? DEFAULT_SETTINGS.cursorGlow,
          themePreset: parsed.themePreset ?? DEFAULT_SETTINGS.themePreset,
        };
      }
    } catch (e) {
      console.warn('Failed to parse settings, using defaults', e);
    }
    return DEFAULT_SETTINGS;
  }

  public saveSettings(settings: UserSettings): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings to localStorage', e);
    }
  }

  // --- Personal Bests ---
  public getPersonalBests(): PersonalBests {
    if (typeof window === 'undefined') return DEFAULT_PBS;
    try {
      const data = localStorage.getItem(STORAGE_KEY_PBS);
      if (data) {
        return { ...DEFAULT_PBS, ...JSON.parse(data) };
      }
    } catch (e) {
      console.warn('Failed to parse PBs, using defaults', e);
    }
    return DEFAULT_PBS;
  }

  public updatePersonalBests(result: TestResult): { isNewPB: boolean; pbType?: string } {
    const pbs = this.getPersonalBests();
    let isNewPB = false;
    let pbType: string | undefined = undefined;

    if (result.mode === 'time') {
      if (result.duration === 15 && result.wpm > pbs.time15) {
        pbs.time15 = result.wpm;
        isNewPB = true;
        pbType = '15s Time';
      } else if (result.duration === 30 && result.wpm > pbs.time30) {
        pbs.time30 = result.wpm;
        isNewPB = true;
        pbType = '30s Time';
      } else if (result.duration === 60 && result.wpm > pbs.time60) {
        pbs.time60 = result.wpm;
        isNewPB = true;
        pbType = '60s Time';
      } else if (result.duration === 120 && result.wpm > pbs.time120) {
        pbs.time120 = result.wpm;
        isNewPB = true;
        pbType = '120s Time';
      }
    } else if (result.mode === 'words') {
      if (result.wordCount === 10 && result.wpm > pbs.words10) {
        pbs.words10 = result.wpm;
        isNewPB = true;
        pbType = '10 Words';
      } else if (result.wordCount === 25 && result.wpm > pbs.words25) {
        pbs.words25 = result.wpm;
        isNewPB = true;
        pbType = '25 Words';
      } else if (result.wordCount === 50 && result.wpm > pbs.words50) {
        pbs.words50 = result.wpm;
        isNewPB = true;
        pbType = '50 Words';
      } else if (result.wordCount === 100 && result.wpm > pbs.words100) {
        pbs.words100 = result.wpm;
        isNewPB = true;
        pbType = '100 Words';
      }
    }

    if (result.accuracy > pbs.bestAccuracy && result.wpm > 20) {
      pbs.bestAccuracy = result.accuracy;
    }
    if (result.consistency > pbs.bestConsistency && result.wpm > 20) {
      pbs.bestConsistency = result.consistency;
    }

    try {
      localStorage.setItem(STORAGE_KEY_PBS, JSON.stringify(pbs));
    } catch {}

    return { isNewPB, pbType };
  }

  // --- Test History (IndexedDB + localStorage fallback) ---
  public async saveTestResult(result: TestResult): Promise<void> {
    this.updatePersonalBests(result);

    const db = await this.initDB();
    if (db) {
      try {
        const tx = db.transaction(
          [STORE_HISTORY, STORE_KEY_STATS, STORE_BIGRAM_STATS],
          'readwrite'
        );
        const historyStore = tx.objectStore(STORE_HISTORY);
        historyStore.put(result);

        // Update key analytics
        const keyStats = extractKeyAnalytics(result.keystrokes);
        const keyStore = tx.objectStore(STORE_KEY_STATS);
        for (const [key, fresh] of Object.entries(keyStats)) {
          const req = keyStore.get(key);
          req.onsuccess = () => {
            const existing = req.result as KeyAnalytics | undefined;
            if (existing) {
              const totalPresses = existing.totalPresses + fresh.totalPresses;
              const errorCount = existing.errorCount + fresh.errorCount;
              const avgLatencyMs = Math.round(
                (existing.avgLatencyMs * existing.totalPresses + fresh.avgLatencyMs * fresh.totalPresses) /
                  totalPresses
              );
              keyStore.put({
                key,
                totalPresses,
                errorCount,
                errorRate: parseFloat(((errorCount / totalPresses) * 100).toFixed(1)),
                avgLatencyMs
              });
            } else {
              keyStore.put(fresh);
            }
          };
        }

        // Update bigram analytics
        const bigramStats = extractBigramAnalytics(result.keystrokes);
        const bigramStore = tx.objectStore(STORE_BIGRAM_STATS);
        for (const [bigram, fresh] of Object.entries(bigramStats)) {
          const req = bigramStore.get(bigram);
          req.onsuccess = () => {
            const existing = req.result as BigramAnalytics | undefined;
            if (existing) {
              const count = existing.count + fresh.count;
              const errorCount = existing.errorCount + fresh.errorCount;
              const avgLatencyMs = Math.round(
                (existing.avgLatencyMs * existing.count + fresh.avgLatencyMs * fresh.count) / count
              );
              bigramStore.put({
                bigram,
                count,
                errorCount,
                errorRate: parseFloat(((errorCount / count) * 100).toFixed(1)),
                avgLatencyMs
              });
            } else {
              bigramStore.put(fresh);
            }
          };
        }
        return;
      } catch (e) {
        console.warn('IDB write failed, storing in localStorage', e);
      }
    }

    // LocalStorage fallback for history
    try {
      const existing = localStorage.getItem('typearena_history_fallback') || '[]';
      const parsed: TestResult[] = JSON.parse(existing);
      parsed.unshift(result);
      // Keep last 100 in fallback
      localStorage.setItem('typearena_history_fallback', JSON.stringify(parsed.slice(0, 100)));
    } catch (e) {
      console.error('LocalStorage write failed', e);
    }
  }

  public async getHistory(): Promise<TestResult[]> {
    const db = await this.initDB();
    if (db) {
      try {
        return new Promise((resolve) => {
          const tx = db.transaction(STORE_HISTORY, 'readonly');
          const store = tx.objectStore(STORE_HISTORY);
          const req = store.getAll();
          req.onsuccess = () => {
            const results = (req.result || []) as TestResult[];
            // Sort newest first
            results.sort((a, b) => b.timestamp - a.timestamp);
            resolve(results);
          };
          req.onerror = () => resolve([]);
        });
      } catch {
        // Fall back below
      }
    }

    try {
      const fallback = localStorage.getItem('typearena_history_fallback') || '[]';
      return JSON.parse(fallback);
    } catch {
      return [];
    }
  }

  public async deleteTestResult(id: string): Promise<void> {
    const db = await this.initDB();
    if (db) {
      try {
        const tx = db.transaction(STORE_HISTORY, 'readwrite');
        tx.objectStore(STORE_HISTORY).delete(id);
      } catch {}
    }
    try {
      const fallback = localStorage.getItem('typearena_history_fallback');
      if (fallback) {
        const parsed: TestResult[] = JSON.parse(fallback);
        const filtered = parsed.filter((r) => r.id !== id);
        localStorage.setItem('typearena_history_fallback', JSON.stringify(filtered));
      }
    } catch {}
  }

  public async clearHistory(): Promise<void> {
    const db = await this.initDB();
    if (db) {
      try {
        const tx = db.transaction(
          [STORE_HISTORY, STORE_KEY_STATS, STORE_BIGRAM_STATS],
          'readwrite'
        );
        tx.objectStore(STORE_HISTORY).clear();
        tx.objectStore(STORE_KEY_STATS).clear();
        tx.objectStore(STORE_BIGRAM_STATS).clear();
      } catch {}
    }
    try {
      localStorage.removeItem('typearena_history_fallback');
    } catch {}
  }

  // --- Aggregated Key & Bigram Stats ---
  public async getKeyStats(): Promise<Record<string, KeyAnalytics>> {
    const db = await this.initDB();
    if (db) {
      try {
        return new Promise((resolve) => {
          const tx = db.transaction(STORE_KEY_STATS, 'readonly');
          const store = tx.objectStore(STORE_KEY_STATS);
          const req = store.getAll();
          req.onsuccess = () => {
            const list = (req.result || []) as KeyAnalytics[];
            const map: Record<string, KeyAnalytics> = {};
            list.forEach((item) => (map[item.key] = item));
            resolve(map);
          };
          req.onerror = () => resolve({});
        });
      } catch {}
    }
    return {};
  }

  public async getBigramStats(): Promise<Record<string, BigramAnalytics>> {
    const db = await this.initDB();
    if (db) {
      try {
        return new Promise((resolve) => {
          const tx = db.transaction(STORE_BIGRAM_STATS, 'readonly');
          const store = tx.objectStore(STORE_BIGRAM_STATS);
          const req = store.getAll();
          req.onsuccess = () => {
            const list = (req.result || []) as BigramAnalytics[];
            const map: Record<string, BigramAnalytics> = {};
            list.forEach((item) => (map[item.bigram] = item));
            resolve(map);
          };
          req.onerror = () => resolve({});
        });
      } catch {}
    }
    return {};
  }

  // --- Course Progress ---
  public async getCourseProgress(): Promise<Record<string, CourseProgress>> {
    const db = await this.initDB();
    if (db) {
      try {
        return new Promise((resolve) => {
          const tx = db.transaction(STORE_COURSE_PROGRESS, 'readonly');
          const store = tx.objectStore(STORE_COURSE_PROGRESS);
          const req = store.getAll();
          req.onsuccess = () => {
            const list = (req.result || []) as CourseProgress[];
            const map: Record<string, CourseProgress> = {};
            list.forEach((item) => (map[item.lessonId] = item));
            resolve(map);
          };
          req.onerror = () => resolve({});
        });
      } catch {}
    }

    try {
      const data = localStorage.getItem('typearena_courses_fallback') || '{}';
      return JSON.parse(data);
    } catch {
      return {};
    }
  }

  public async saveCourseProgress(progress: CourseProgress): Promise<void> {
    const db = await this.initDB();
    if (db) {
      try {
        const tx = db.transaction(STORE_COURSE_PROGRESS, 'readwrite');
        tx.objectStore(STORE_COURSE_PROGRESS).put(progress);
        return;
      } catch {}
    }

    try {
      const data = localStorage.getItem('typearena_courses_fallback') || '{}';
      const parsed = JSON.parse(data);
      parsed[progress.lessonId] = progress;
      localStorage.setItem('typearena_courses_fallback', JSON.stringify(parsed));
    } catch {}
  }

  // --- SubLesson Progress ---
  public async getSubLessonProgress(): Promise<Record<string, SubLessonProgress>> {
    const db = await this.initDB();
    if (db) {
      try {
        return new Promise((resolve) => {
          const tx = db.transaction(STORE_SUBLESSON_PROGRESS, 'readonly');
          const store = tx.objectStore(STORE_SUBLESSON_PROGRESS);
          const req = store.getAll();
          req.onsuccess = () => {
            const list = (req.result || []) as SubLessonProgress[];
            const map: Record<string, SubLessonProgress> = {};
            list.forEach((item) => (map[item.subLessonId] = item));
            resolve(map);
          };
          req.onerror = () => resolve({});
        });
      } catch {}
    }

    try {
      const data = localStorage.getItem(STORAGE_KEY_SUBLESSON_FALLBACK) || '{}';
      return JSON.parse(data);
    } catch {
      return {};
    }
  }

  public async saveSubLessonProgress(progress: SubLessonProgress): Promise<void> {
    const db = await this.initDB();
    if (db) {
      try {
        const tx = db.transaction(STORE_SUBLESSON_PROGRESS, 'readwrite');
        tx.objectStore(STORE_SUBLESSON_PROGRESS).put(progress);
      } catch {}
    }

    try {
      const data = localStorage.getItem(STORAGE_KEY_SUBLESSON_FALLBACK) || '{}';
      const parsed = JSON.parse(data);
      parsed[progress.subLessonId] = progress;
      localStorage.setItem(STORAGE_KEY_SUBLESSON_FALLBACK, JSON.stringify(parsed));
    } catch {}
  }

  public async getLearnOverviewStats(): Promise<LearnStats> {
    const subProgMap = await this.getSubLessonProgress();
    const subList = Object.values(subProgMap);
    const completedSubs = subList.filter((s) => s.completed);
    const totalSubCount = getAllSubLessonsCount();

    // Completed Lessons calculation: a lesson is completed when ALL of its sublessons are completed!
    let completedLessonsCount = 0;
    for (const lesson of DETAILED_LESSONS) {
      const allCompleted = lesson.subLessons.every((s) => subProgMap[s.id]?.completed);
      if (allCompleted && lesson.subLessons.length > 0) {
        completedLessonsCount++;
      }
    }

    const courseProgressPercent = totalSubCount > 0
      ? Math.min(100, Math.round((completedSubs.length / totalSubCount) * 100))
      : 0;

    let totalTime = 0;
    let maxWpm = 0;
    let sumAcc = 0;
    let accCount = 0;

    // Per-key error tracking aggregation across all completed sublessons
    const keyMistakesMap: Record<string, { errors: number; total: number }> = {};

    subList.forEach((s) => {
      totalTime += s.totalTimeSpent || 0;
      if (s.bestWpm > maxWpm) maxWpm = s.bestWpm;
      if (s.bestAccuracy > 0) {
        sumAcc += s.bestAccuracy;
        accCount++;
      }
      if (s.keyStats) {
        for (const [key, val] of Object.entries(s.keyStats)) {
          if (!keyMistakesMap[key]) {
            keyMistakesMap[key] = { errors: 0, total: 0 };
          }
          keyMistakesMap[key].errors += val.incorrect;
          keyMistakesMap[key].total += val.correct + val.incorrect;
        }
      }
    });

    const bestOverallAccuracy = accCount > 0 ? Math.round(sumAcc / accCount) : 0;

    // Extract weakest keys
    const weakestKeys = Object.entries(keyMistakesMap)
      .filter(([_, stats]) => stats.total >= 4 && stats.errors > 0)
      .map(([key, stats]) => ({
        key,
        errorRate: Math.round((stats.errors / stats.total) * 100),
        attempts: stats.total
      }))
      .sort((a, b) => b.errorRate - a.errorRate)
      .slice(0, 6);

    // Calculate real learning streak
    let currentStreakDays = 0;
    if (completedSubs.length > 0) {
      const dates = Array.from(
        new Set(
          completedSubs
            .filter((s) => s.timestamp > 0)
            .map((s) => new Date(s.timestamp).toDateString())
        )
      );
      currentStreakDays = dates.length;
    }

    return {
      completedLessonsCount,
      completedSubLessonsCount: completedSubs.length,
      totalSubLessonsCount: totalSubCount,
      courseProgressPercent,
      totalLearningTimeSeconds: totalTime,
      bestOverallWpm: maxWpm,
      bestOverallAccuracy,
      weakestKeys,
      currentStreakDays
    };
  }

  public async resetLearnProgress(): Promise<void> {
    const db = await this.initDB();
    if (db) {
      try {
        const tx = db.transaction([STORE_COURSE_PROGRESS, STORE_SUBLESSON_PROGRESS], 'readwrite');
        tx.objectStore(STORE_COURSE_PROGRESS).clear();
        tx.objectStore(STORE_SUBLESSON_PROGRESS).clear();
      } catch {}
    }
    localStorage.removeItem('typearena_courses_fallback');
    localStorage.removeItem(STORAGE_KEY_SUBLESSON_FALLBACK);
  }

  // --- Export, Import & Reset ---
  public async exportAllData(): Promise<string> {
    const settings = this.getSettings();
    const pbs = this.getPersonalBests();
    const history = await this.getHistory();
    const courseProgress = await this.getCourseProgress();
    const keyStats = await this.getKeyStats();
    const bigramStats = await this.getBigramStats();

    const backup = {
      app: 'TypeArena',
      version: 1,
      exportedAt: new Date().toISOString(),
      data: {
        settings,
        personalBests: pbs,
        history,
        courseProgress,
        keyStats,
        bigramStats
      }
    };

    return JSON.stringify(backup, null, 2);
  }

  public async importAllData(jsonStr: string): Promise<{ success: boolean; error?: string }> {
    try {
      const parsed = JSON.parse(jsonStr);

      if (!parsed || typeof parsed !== 'object') {
        return { success: false, error: 'Invalid file format: not a valid JSON object.' };
      }
      if (parsed.app !== 'TypeArena' || !parsed.data) {
        return { success: false, error: 'Unrecognized backup format: TypeArena signature missing.' };
      }

      const { data } = parsed;

      // Validate & restore settings
      if (data.settings && typeof data.settings === 'object') {
        this.saveSettings({ ...DEFAULT_SETTINGS, ...data.settings });
      }

      // Validate & restore personal bests
      if (data.personalBests && typeof data.personalBests === 'object') {
        localStorage.setItem(STORAGE_KEY_PBS, JSON.stringify({ ...DEFAULT_PBS, ...data.personalBests }));
      }

      // Validate & restore history in IndexedDB
      if (Array.isArray(data.history)) {
        const db = await this.initDB();
        if (db) {
          const tx = db.transaction(
            [STORE_HISTORY, STORE_KEY_STATS, STORE_BIGRAM_STATS, STORE_COURSE_PROGRESS],
            'readwrite'
          );
          const historyStore = tx.objectStore(STORE_HISTORY);
          for (const item of data.history) {
            if (item && item.id) {
              historyStore.put(item);
            }
          }

          if (data.courseProgress && typeof data.courseProgress === 'object') {
            const courseStore = tx.objectStore(STORE_COURSE_PROGRESS);
            for (const prog of Object.values(data.courseProgress) as CourseProgress[]) {
              if (prog && prog.lessonId) {
                courseStore.put(prog);
              }
            }
          }

          if (data.keyStats && typeof data.keyStats === 'object') {
            const kStore = tx.objectStore(STORE_KEY_STATS);
            for (const ks of Object.values(data.keyStats) as KeyAnalytics[]) {
              if (ks && ks.key) kStore.put(ks);
            }
          }

          if (data.bigramStats && typeof data.bigramStats === 'object') {
            const bStore = tx.objectStore(STORE_BIGRAM_STATS);
            for (const bs of Object.values(data.bigramStats) as BigramAnalytics[]) {
              if (bs && bs.bigram) bStore.put(bs);
            }
          }
        }
      }

      return { success: true };
    } catch (e) {
      return { success: false, error: `JSON parsing error: ${(e as Error).message}` };
    }
  }

  public async resetAllData(scope: 'all' | 'history' | 'progress' | 'settings'): Promise<void> {
    if (scope === 'all' || scope === 'history') {
      await this.clearHistory();
      localStorage.removeItem(STORAGE_KEY_PBS);
    }
    if (scope === 'all' || scope === 'settings') {
      localStorage.removeItem(STORAGE_KEY_SETTINGS);
    }
    if (scope === 'all' || scope === 'progress') {
      const db = await this.initDB();
      if (db) {
        try {
          const tx = db.transaction([STORE_COURSE_PROGRESS, STORE_SUBLESSON_PROGRESS], 'readwrite');
          tx.objectStore(STORE_COURSE_PROGRESS).clear();
          tx.objectStore(STORE_SUBLESSON_PROGRESS).clear();
        } catch {}
      }
      localStorage.removeItem('typearena_courses_fallback');
      localStorage.removeItem(STORAGE_KEY_SUBLESSON_FALLBACK);
    }
  }
}

/**
 * One-time idempotent cleanup to completely purge any legacy Character Studio
 * data, state, or keys from browser storage while preserving all typing history,
 * personal records, courses, themes, and settings.
 */
export function cleanupCharacterStudioData(): void {
  try {
    const legacyKeys = [
      'typearena_studio_age_verified',
      'typearena_studio_disclaimer_accepted',
      'typearena_character_studio_state',
      'characterStudioData',
      'characterHistory',
      'savedCharacters',
      'selectedCharacter',
      'characterCustomization',
      'characterStudioSettings',
      'typearena_studio_temp',
    ];

    legacyKeys.forEach((key) => {
      try {
        localStorage.removeItem(key);
      } catch {}
      try {
        sessionStorage.removeItem(key);
      } catch {}
    });

    // Also scan localStorage for any keys starting with 'typearena_studio' or 'characterStudio'
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (
        key &&
        (key.startsWith('typearena_studio') ||
          key.startsWith('characterStudio') ||
          key.startsWith('savedCharacter'))
      ) {
        localStorage.removeItem(key);
      }
    }
  } catch {}
}

export const storage = new StorageManager();

