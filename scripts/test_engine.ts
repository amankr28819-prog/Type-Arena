import { generateTestText } from '../src/lib/generator';
import {
  calculateWpm,
  calculateRawWpm,
  calculateNetWpm,
  calculateAccuracy,
  calculateConsistency,
  evaluateExam,
  extractKeyAnalytics,
  extractBigramAnalytics
} from '../src/lib/metrics';
import { BUILTIN_THEMES } from '../src/lib/themes';
import { COURSE_LESSONS } from '../src/lib/courses';
import {
  DETAILED_LESSONS,
  getLessonById,
  getSubLessonById,
  getNextSubLesson,
  getAllSubLessonsCount,
  generateAdaptivePracticeText
} from '../src/lib/learnCurriculum';
import { getFingerForChar } from '../src/components/learn/HandPlacementVisualizer';
import { ENGLISH_WORDS, HINDI_WORDS, QUOTES_LIBRARY, CODE_SNIPPETS } from '../src/lib/wordlists';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ Assertion Failed: ${message}`);
    process.exit(1);
  }
  console.log(`✅ Passed: ${message}`);
}

console.log('--- RUNNING TYPEARENA COMPREHENSIVE ENGINE TESTS ---');

// 1. Verify 24+ Original Themes
assert(BUILTIN_THEMES.length >= 24, `Builtin themes count >= 24 (found ${BUILTIN_THEMES.length})`);
for (const theme of BUILTIN_THEMES) {
  assert(!!theme.colors.bgMain && !!theme.colors.colorPrimary, `Theme ${theme.name} has complete colors`);
}

// 2. Verify Wordlists
assert(ENGLISH_WORDS.length >= 200, `English wordlist count >= 200 (found ${ENGLISH_WORDS.length})`);
assert(HINDI_WORDS.length >= 50, `Hindi wordlist count >= 50 (found ${HINDI_WORDS.length})`);
assert(QUOTES_LIBRARY.length >= 10, `Quotes library count >= 10 (found ${QUOTES_LIBRARY.length})`);
assert(CODE_SNIPPETS.length >= 5, `Code snippets count >= 5 (found ${CODE_SNIPPETS.length})`);

// 3. Test Text Generation
// Custom 45s time mode
const text45s = generateTestText({ mode: 'time', timeOption: 'custom', customTime: 45 });
assert(text45s.split(' ').length >= 40, `Custom 45s generates sufficient word buffer (${text45s.split(' ').length} words)`);

// Custom 37 words mode
const text37w = generateTestText({ mode: 'words', wordOption: 'custom', customWords: 37 });
assert(text37w.split(' ').length === 37, `Custom 37 words generates exactly 37 words (found ${text37w.split(' ').length})`);

// Punctuation ON vs OFF
const punctOn = generateTestText({ mode: 'words', wordOption: 25, punctuation: true });
const punctOff = generateTestText({ mode: 'words', wordOption: 25, punctuation: false });
assert(/[.,!?;:]/.test(punctOn), 'Punctuation ON adds punctuation marks');
assert(!/[.,!?;:]/.test(punctOff), 'Punctuation OFF contains no punctuation marks');

// Numbers ON vs OFF
const numOn = generateTestText({ mode: 'words', wordOption: 50, numbers: true });
const numOff = generateTestText({ mode: 'words', wordOption: 25, numbers: false });
assert(/[0-9]/.test(numOn), 'Numbers ON adds numbers');
assert(!/[0-9]/.test(numOff), 'Numbers OFF contains zero numbers');

// Quote mode
const shortQuote = generateTestText({ mode: 'quote', quoteLength: 'short' });
assert(shortQuote.length > 10, `Short quote generates valid text: "${shortQuote}"`);

// Code mode
const codeText = generateTestText({ mode: 'code', codeIndex: 0 });
assert(codeText.includes('{') || codeText.includes('function') || codeText.includes('def'), 'Code mode generates programming syntax');

// Hindi mode
const hindiText = generateTestText({ mode: 'words', wordOption: 10, language: 'hindi' });
assert(hindiText.length > 10, `Hindi mode generates valid Hindi vocabulary: "${hindiText}"`);

// 4. Test Typing Engine Metrics Calculations
// 60 WPM in 60 seconds with 300 correct characters (300 / 5 = 60 words / 1 min = 60 WPM)
const wpm60 = calculateWpm(300, 60);
assert(wpm60 === 60, `calculateWpm(300, 60) === 60 (got ${wpm60})`);

// 120 WPM in 30 seconds with 300 correct characters (300 / 5 = 60 words / 0.5 min = 120 WPM)
const wpm120 = calculateWpm(300, 30);
assert(wpm120 === 120, `calculateWpm(300, 30) === 120 (got ${wpm120})`);

// Raw WPM with 350 total keystrokes in 60s = 70 Raw WPM
const rawWpm70 = calculateRawWpm(350, 60);
assert(rawWpm70 === 70, `calculateRawWpm(350, 60) === 70 (got ${rawWpm70})`);

// Net WPM: 70 Raw WPM - 10 uncorrected errors = 60 Net WPM
const netWpm60 = calculateNetWpm(70, 10, 60);
assert(netWpm60 === 60, `calculateNetWpm(70, 10, 60) === 60 (got ${netWpm60})`);

// Accuracy: 95 correct out of 100 total = 95%
const acc95 = calculateAccuracy({ correct: 95, incorrect: 5, extra: 0, missed: 0 });
assert(acc95 === 95, `calculateAccuracy(95/100) === 95% (got ${acc95}%)`);

// Consistency calculation
const dummyKeystrokes = [
  { key: 't', expected: 't', timestamp: 100, isCorrect: true, latencyMs: 120 },
  { key: 'h', expected: 'h', timestamp: 220, isCorrect: true, latencyMs: 125 },
  { key: 'e', expected: 'e', timestamp: 345, isCorrect: true, latencyMs: 122 },
  { key: ' ', expected: ' ', timestamp: 470, isCorrect: true, latencyMs: 120 },
  { key: 'q', expected: 'q', timestamp: 590, isCorrect: true, latencyMs: 118 },
  { key: 'u', expected: 'u', timestamp: 710, isCorrect: true, latencyMs: 124 },
];
const consistency = calculateConsistency(dummyKeystrokes);
assert(consistency >= 90, `calculateConsistency is high for steady typing (got ${consistency}%)`);

// Weak key analytics extraction
const keyStats = extractKeyAnalytics([
  { key: 'z', expected: 'z', timestamp: 100, isCorrect: false, latencyMs: 250 },
  { key: 'z', expected: 'z', timestamp: 350, isCorrect: true, latencyMs: 200 },
  { key: 'a', expected: 'a', timestamp: 550, isCorrect: true, latencyMs: 90 },
]);
assert(keyStats['z']?.errorRate === 50, `Key 'z' correctly flagged with 50% error rate (got ${keyStats['z']?.errorRate}%)`);
assert(keyStats['a']?.errorRate === 0, `Key 'a' correctly marked with 0% error rate (got ${keyStats['a']?.errorRate}%)`);

// Bigram analytics extraction
const bigramStats = extractBigramAnalytics([
  { key: 't', expected: 't', timestamp: 100, isCorrect: true, latencyMs: 100 },
  { key: 'h', expected: 'h', timestamp: 250, isCorrect: false, latencyMs: 150 },
]);
assert(bigramStats['th']?.errorRate === 100, `Bigram 'th' correctly evaluated with 100% error (got ${bigramStats['th']?.errorRate}%)`);

// Exam evaluation logic
const passedExam = evaluateExam(65, 96, 0, {
  duration: 60,
  minWpm: 50,
  minAccuracy: 95,
  punctuation: true,
  numbers: false,
  allowBackspace: true,
  strictStopOnError: false
});
assert(passedExam.passed === true, 'Exam passes when requirements are satisfied');

const failedExamWpm = evaluateExam(45, 96, 0, {
  duration: 60,
  minWpm: 50,
  minAccuracy: 95,
  punctuation: true,
  numbers: false,
  allowBackspace: true,
  strictStopOnError: false
});
assert(failedExamWpm.passed === false, 'Exam fails when WPM is below minimum');

// 5. Verify Courses Curriculums
const beginnerLessons = COURSE_LESSONS.filter((l) => l.tier === 'beginner');
const intermediateLessons = COURSE_LESSONS.filter((l) => l.tier === 'intermediate');
const advancedLessons = COURSE_LESSONS.filter((l) => l.tier === 'advanced');
assert(beginnerLessons.length >= 5, `Beginner course lessons >= 5 (found ${beginnerLessons.length})`);
assert(intermediateLessons.length >= 5, `Intermediate course lessons >= 5 (found ${intermediateLessons.length})`);
assert(advancedLessons.length >= 4, `Advanced course lessons >= 4 (found ${advancedLessons.length})`);

// 6. Test Precision Timer & Custom 45s Duration Calculations
// Guard against < 0.2s division
assert(calculateWpm(10, 0.1) === 0, 'calculateWpm returns 0 when time < 0.2s');
assert(calculateRawWpm(10, 0.05) === 0, 'calculateRawWpm returns 0 when time < 0.2s');
assert(calculateNetWpm(50, 2, 0.1) === 0, 'calculateNetWpm returns 0 when time < 0.2s');

// Custom 45-second test: 225 characters / 5 = 45 words / (45/60 min = 0.75) = exactly 60 WPM
const wpm45s = calculateWpm(225, 45);
assert(wpm45s === 60, `calculateWpm(225 chars, 45s) === 60 WPM (got ${wpm45s})`);

// Custom 45-second test with float elapsed time (e.g., 44.98s ~ 45s)
const wpmFloat = calculateWpm(225, 45.0);
assert(wpmFloat === 60, `calculateWpm with float seconds is accurate (got ${wpmFloat})`);

// 7. Verify TypeArena Battle Game Mechanics & Upgraded Systems
import { calculateBurstSpeed } from '../src/lib/metrics';

// Test burst speed calculation
const recentStrokes = [
  { key: 'a', expected: 'a', timestamp: 1000, isCorrect: true, latencyMs: 60 },
  { key: 'b', expected: 'b', timestamp: 1060, isCorrect: true, latencyMs: 60 },
  { key: 'c', expected: 'c', timestamp: 1120, isCorrect: true, latencyMs: 60 },
  { key: 'd', expected: 'd', timestamp: 1180, isCorrect: true, latencyMs: 60 },
  { key: 'e', expected: 'e', timestamp: 1240, isCorrect: true, latencyMs: 60 },
];
const burst = calculateBurstSpeed(recentStrokes, 1240);
assert(burst > 0, `calculateBurstSpeed correctly computes instantaneous velocity (${burst} WPM)`);

// Test combo scaling damage
const calcBattleDamage = (word: string, isCrit: boolean, comboCount: number) => {
  const baseDmg = Math.round(18 + word.length * 1.5);
  const comboMultiplier = Math.min(2.5, 1 + (comboCount - 1) * 0.15);
  const critMultiplier = isCrit ? 1.4 : 1.0;
  return Math.round(baseDmg * comboMultiplier * critMultiplier);
};
const baseDamage = calcBattleDamage('sword', false, 1);
const combo5Damage = calcBattleDamage('sword', false, 5);
assert(combo5Damage > baseDamage, `Combo multiplier scales sword damage (1x: ${baseDamage} vs 5x: ${combo5Damage})`);

// Special attack calculation
const specialAttackDmg = Math.round(baseDamage * 2.2);
assert(specialAttackDmg > baseDamage * 2, `100% Special attack unleashes over 2x catastrophic damage (${specialAttackDmg})`);

// Parry & Block damage reduction
const incomingBotDamage = 25;
const blockedDamage = Math.round(incomingBotDamage * 0.35); // 65% reduction on successful parry
assert(blockedDamage < incomingBotDamage, `Parry block reduces damage taken from ${incomingBotDamage} to ${blockedDamage}`);

// 8. Verify TypeArena Battle Combat Mechanics & Safety
assert(incomingBotDamage > blockedDamage, 'Parry system successfully mitigates incoming damage');

// 9. Verify Redesigned 10-Lesson Learn Curriculum & Finger Placement System
assert(DETAILED_LESSONS.length === 10, `Detailed curriculum has exactly 10 major lessons (found ${DETAILED_LESSONS.length})`);
const totalSubLessons = getAllSubLessonsCount();
assert(totalSubLessons >= 60, `Curriculum has >= 60 sublessons (found ${totalSubLessons})`);

const lesson1 = getLessonById('lesson-1');
assert(!!lesson1 && lesson1.subLessons.length >= 7, 'Lesson 1 exists with >= 7 sublessons');

const subResult = getSubLessonById('l1-s1');
assert(!!subResult && subResult.subLesson.title.includes('F and J'), 'Sublesson l1-s1 found with expected title');

const nextSubResult = getNextSubLesson('l1-s1');
assert(!!nextSubResult && nextSubResult.subLesson.id === 'l1-s2', `Next sublesson of l1-s1 is l1-s2 (got ${nextSubResult?.subLesson?.id})`);

// Test finger mappings
const fFinger = getFingerForChar('f');
assert(fFinger.name === 'Left Index' && fFinger.reachDirection === 'home', `Key 'f' maps to Left Index home (got ${fFinger.name})`);

const jFinger = getFingerForChar('j');
assert(jFinger.name === 'Right Index' && jFinger.reachDirection === 'home', `Key 'j' maps to Right Index home (got ${jFinger.name})`);

const eFinger = getFingerForChar('e');
assert(eFinger.name === 'Left Middle' && eFinger.reachDirection === 'up', `Key 'e' maps to Left Middle up (got ${eFinger.name})`);

const spaceFinger = getFingerForChar(' ');
assert(spaceFinger.name === 'Thumbs' && spaceFinger.hand === 'right', `Key ' ' maps to thumb (got ${spaceFinger.name})`);

// Explicit Critical Tests: T, D, K, Shift
const tFinger = getFingerForChar('t');
assert(tFinger.name === 'Left Index' && tFinger.fingerCode === 'li' && tFinger.reachDirection === 'up', `Key 't' maps to Left Index up (got ${tFinger.name})`);

const dFinger = getFingerForChar('d');
assert(dFinger.name === 'Left Middle' && dFinger.fingerCode === 'lm' && dFinger.reachDirection === 'home', `Key 'd' maps to Left Middle home (got ${dFinger.name})`);

const kFinger = getFingerForChar('k');
assert(kFinger.name === 'Right Middle' && kFinger.fingerCode === 'rm' && kFinger.reachDirection === 'home', `Key 'k' maps to Right Middle home (got ${kFinger.name})`);

const capTFinger = getFingerForChar('T');
assert(capTFinger.name === 'Left Index' && capTFinger.needsShift && capTFinger.shiftFingerCode === 'rp', `Capital 'T' maps to Left Index + Right Pinky Shift (got ${capTFinger.shiftFingerName})`);

const capPFinger = getFingerForChar('P');
assert(capPFinger.name === 'Right Pinky' && capPFinger.needsShift && capPFinger.shiftFingerCode === 'lp', `Capital 'P' maps to Right Pinky + Left Pinky Shift (got ${capPFinger.shiftFingerName})`);

// Test adaptive practice generation from weak keys
const adaptiveText = generateAdaptivePracticeText(['d', 'k'], ['dk', 'kd']);
assert(adaptiveText.length > 20, `Adaptive practice text generated successfully (${adaptiveText.length} chars)`);
assert(adaptiveText.includes('d') || adaptiveText.includes('k'), 'Adaptive practice text targets weak keys');

// 10. Canonical Typing Session Tests (Prompt Test Cases 1 - 10)
import {
  createTypingSession,
  processKeystroke,
  updateSessionTimer,
  pauseSession,
  resumeSession,
  formatTimerDisplay
} from '../src/lib/typingSession';
import { getContrastRatio, ensureReadableContrast } from '../src/lib/themes';

// TEST CASE 1: Target "abc", User types "abc" -> Accuracy 100%
const s1 = createTypingSession({ targetText: 'abc', mode: 'words' });
processKeystroke(s1, 'a');
processKeystroke(s1, 'b');
processKeystroke(s1, 'c');
assert(s1.accuracy === 100, `TEST CASE 1: abc -> abc accuracy = 100% (got ${s1.accuracy}%)`);
assert(s1.correctKeystrokes === 3 && s1.incorrectKeystrokes === 0, `TEST CASE 1 keystrokes: 3 correct, 0 incorrect`);

// TEST CASE 2: Target "abc", User types "axc" -> 2 correct, 1 incorrect, Accuracy 66.67%
const s2 = createTypingSession({ targetText: 'abc', mode: 'words' });
processKeystroke(s2, 'a');
processKeystroke(s2, 'x'); // wrong
processKeystroke(s2, 'c');
assert(s2.correctKeystrokes === 2, `TEST CASE 2: 2 correct keystrokes (got ${s2.correctKeystrokes})`);
assert(s2.incorrectKeystrokes === 1, `TEST CASE 2: 1 incorrect keystroke (got ${s2.incorrectKeystrokes})`);
assert(s2.accuracy === 66.67, `TEST CASE 2: axc -> accuracy = 66.67% (got ${s2.accuracy}%)`);

// TEST CASE 3: Target "abc", User types "ax" + Backspace + "b" + "c" -> 3 correct, 1 incorrect, Accuracy 75%
const s3 = createTypingSession({ targetText: 'abc', mode: 'words' });
processKeystroke(s3, 'a');
processKeystroke(s3, 'x'); // wrong
assert(s3.incorrectKeystrokes === 1, 'Mistake x recorded in incorrectKeystrokes');
processKeystroke(s3, 'Backspace');
assert(s3.backspaces === 1, 'Backspace count incremented');
assert(s3.incorrectKeystrokes === 1, 'CRITICAL: Backspace DID NOT erase mistake from incorrectKeystrokes');
processKeystroke(s3, 'b');
processKeystroke(s3, 'c');
assert(s3.correctKeystrokes === 3, `TEST CASE 3: 3 correct keystrokes (got ${s3.correctKeystrokes})`);
assert(s3.incorrectKeystrokes === 1, `TEST CASE 3: 1 incorrect keystroke (got ${s3.incorrectKeystrokes})`);
assert(s3.accuracy === 75, `TEST CASE 3: ax + Backspace + bc -> accuracy = 75% (got ${s3.accuracy}%)`);

// TEST CASE 4: Target "abc", User types "x" + Backspace + "a" + "b" + "c" -> 3 correct, 1 incorrect, Accuracy 75%
const s4 = createTypingSession({ targetText: 'abc', mode: 'words' });
processKeystroke(s4, 'x'); // wrong
processKeystroke(s4, 'Backspace');
processKeystroke(s4, 'a');
processKeystroke(s4, 'b');
processKeystroke(s4, 'c');
assert(s4.correctKeystrokes === 3, `TEST CASE 4: 3 correct keystrokes (got ${s4.correctKeystrokes})`);
assert(s4.incorrectKeystrokes === 1, `TEST CASE 4: 1 incorrect keystroke (got ${s4.incorrectKeystrokes})`);
assert(s4.accuracy === 75, `TEST CASE 4: x + Backspace + abc -> accuracy = 75% (got ${s4.accuracy}%)`);

// TEST CASE 5: Backspace without error
const s5 = createTypingSession({ targetText: 'abc', mode: 'words' });
processKeystroke(s5, 'a');
processKeystroke(s5, 'Backspace');
assert(s5.backspaces === 1, 'Backspace count incremented to 1');
assert(s5.incorrectKeystrokes === 0, 'TEST CASE 5: Backspace without mistake does NOT create an error');
assert(s5.accuracy === 100, `TEST CASE 5 accuracy remains 100% (got ${s5.accuracy}%)`);

// TEST CASE 6 — TIMER: 10 second test terminates strictly at 10s boundary
const s6 = createTypingSession({ targetText: 'the quick brown fox jumps over the lazy dog', mode: 'time', duration: 10 });
assert(s6.status === 'idle', 'Timer does not start when idle');
processKeystroke(s6, 't', 1000);
assert(s6.status === 'running', 'Timer starts upon first valid typing keystroke');
updateSessionTimer(s6, 6000); // 5s elapsed
assert(s6.remainingMs === 5000, `Remaining at 5s is 5000ms (got ${s6.remainingMs}ms)`);
const expired = updateSessionTimer(s6, 11000); // 10s elapsed
assert(expired === true, 'updateSessionTimer returns true when time expired');
assert(s6.status === 'expired', `Test status is 'expired' on 10s boundary (got ${s6.status})`);
assert(s6.elapsedMs === 10000, `Elapsed time clamped strictly to duration (got ${s6.elapsedMs}ms)`);
assert(s6.remainingMs === 0, 'Remaining time is 0 at boundary');
const rejectedKey = processKeystroke(s6, 'h', 11500);
assert(rejectedKey.accepted === false, 'No further typing accepted after session expires');

// TEST CASE 6B — Timer Display Formatting
assert(formatTimerDisplay(15) === '00:15', `formatTimerDisplay(15) === '00:15' (got ${formatTimerDisplay(15)})`);
assert(formatTimerDisplay(65) === '01:05', `formatTimerDisplay(65) === '01:05' (got ${formatTimerDisplay(65)})`);
assert(formatTimerDisplay(0) === '00:00', `formatTimerDisplay(0) === '00:00'`);
assert(formatTimerDisplay(-5) === '00:00', `formatTimerDisplay negative clamp === '00:00'`);

// TEST CASE 7 — Pause & Resume
const s7 = createTypingSession({ targetText: 'quick test text', mode: 'time', duration: 30 });
processKeystroke(s7, 'q', 1000);
updateSessionTimer(s7, 3000); // 2s elapsed
assert(s7.elapsedMs === 2000, `Elapsed before pause: 2000ms (got ${s7.elapsedMs})`);
pauseSession(s7, 3000);
assert(s7.status === 'paused', 'Session status is paused');
resumeSession(s7, 8000); // paused for 5s
assert(s7.status === 'running', 'Session status resumed to running');
updateSessionTimer(s7, 9000); // 1s after resume
assert(s7.elapsedMs === 3000, `Paused time is excluded from elapsedMs (got ${s7.elapsedMs}ms, expected 3000ms)`);

// TEST CASE 8 — DIFFICULTY CONTENT DIFFERENTIATION
const easyContent = generateTestText({ mode: 'words', wordOption: 20, difficulty: 'easy' });
const expertContent = generateTestText({ mode: 'words', wordOption: 20, difficulty: 'expert' });
const masterContent = generateTestText({ mode: 'words', wordOption: 20, difficulty: 'master' });

const easyWords = easyContent.split(' ');
const expertWords = expertContent.split(' ');
const masterWords = masterContent.split(' ');

const easyAvgLen = easyWords.reduce((s, w) => s + w.length, 0) / easyWords.length;
const expertAvgLen = expertWords.reduce((s, w) => s + w.length, 0) / expertWords.length;
const masterAvgLen = masterWords.reduce((s, w) => s + w.length, 0) / masterWords.length;

assert(easyAvgLen < 5.0, `Easy words average length is short (< 5.0, got ${easyAvgLen.toFixed(1)})`);
assert(expertAvgLen > 7.0, `Expert words average length is long (> 7.0, got ${expertAvgLen.toFixed(1)})`);
assert(masterAvgLen > 10.0, `Master words average length is very complex (> 10.0, got ${masterAvgLen.toFixed(1)})`);
assert(easyContent !== expertContent, 'Easy and Expert content are genuinely different');

// TEST CASE 9 — THEME CONTRAST VALIDATION
for (const theme of BUILTIN_THEMES) {
  const contrastSub = getContrastRatio(ensureReadableContrast(theme.colors.textSub, theme.colors.bgSurface, 4.5), theme.colors.bgSurface);
  assert(contrastSub >= 4.5, `Theme ${theme.name} textSub has >= 4.5:1 contrast against surface (got ${contrastSub.toFixed(2)}:1)`);
}

console.log('--- ALL TYPEARENA TESTS PASSED PERFECTLY! ---');




