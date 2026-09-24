import {
  EASY_WORDS,
  NORMAL_WORDS,
  ADVANCED_WORDS,
  EXPERT_WORDS,
  MASTER_WORDS,
  HINDI_WORDS,
  SPANISH_WORDS,
  FRENCH_WORDS,
  GERMAN_WORDS,
  QUOTES_LIBRARY,
  CODE_SNIPPETS
} from './wordlists';
import type {
  TestMode,
  TimeOption,
  WordOption,
  QuoteLength,
  LanguageOption,
  Difficulty
} from '../types';

export interface GeneratorOptions {
  mode: TestMode;
  timeOption?: TimeOption;
  customTime?: number;
  wordOption?: WordOption;
  customWords?: number;
  quoteLength?: QuoteLength;
  language?: LanguageOption;
  difficulty?: Difficulty;
  punctuation?: boolean;
  numbers?: boolean;
  customText?: string;
  codeIndex?: number;
  mistakeKeys?: string[];
  mistakeWords?: string[];
}

export function getWordlistByLanguage(
  lang: LanguageOption = 'english',
  difficulty: Difficulty = 'normal'
): string[] {
  if (lang === 'hindi') return HINDI_WORDS;
  if (lang === 'spanish') return SPANISH_WORDS;
  if (lang === 'french') return FRENCH_WORDS;
  if (lang === 'german') return GERMAN_WORDS;

  // English difficulty-segregated wordlists
  switch (difficulty) {
    case 'easy':
      return EASY_WORDS;
    case 'advanced':
      return ADVANCED_WORDS;
    case 'expert':
      return EXPERT_WORDS;
    case 'master':
      return MASTER_WORDS;
    case 'normal':
    default:
      return NORMAL_WORDS;
  }
}

export function generateTestText(options: GeneratorOptions): string {
  const {
    mode,
    wordOption = 25,
    customWords = 25,
    quoteLength = 'medium',
    language = 'english',
    difficulty = 'normal',
    punctuation = false,
    numbers = false,
    customText = '',
    codeIndex = 0,
    mistakeKeys = [],
    mistakeWords = []
  } = options;

  // 1. Custom Text mode
  if (mode === 'custom') {
    const cleaned = customText.trim();
    return cleaned.length > 0 ? cleaned : 'The quick brown fox jumps over the lazy dog.';
  }

  // 2. Code mode
  if (mode === 'code') {
    const idx = Math.min(Math.max(0, codeIndex), CODE_SNIPPETS.length - 1);
    return CODE_SNIPPETS[idx].code;
  }

  // 3. Quote mode
  if (mode === 'quote') {
    const matchingQuotes = QUOTES_LIBRARY.filter((q) => q.length === quoteLength);
    const pool = matchingQuotes.length > 0 ? matchingQuotes : QUOTES_LIBRARY;
    const randomQuote = pool[Math.floor(Math.random() * pool.length)];
    return randomQuote.text;
  }

  // 4. Mistake-focused drill generation
  if (mistakeKeys.length > 0 || mistakeWords.length > 0) {
    const baseList = getWordlistByLanguage(language, difficulty);
    const drillList: string[] = [];

    // Add actual mistyped words first
    if (mistakeWords.length > 0) {
      drillList.push(...mistakeWords);
    }

    // Filter words containing mistake keys
    if (mistakeKeys.length > 0) {
      const lowerMistakes = mistakeKeys.map((k) => k.toLowerCase());
      const wordsWithMistakes = baseList.filter((w) =>
        lowerMistakes.some((mk) => w.includes(mk))
      );

      // Pick 20 words containing the weak keys
      for (let i = 0; i < 20; i++) {
        if (wordsWithMistakes.length > 0) {
          const rand = wordsWithMistakes[Math.floor(Math.random() * wordsWithMistakes.length)];
          drillList.push(rand);
        }
      }
    }

    if (drillList.length >= 10) {
      const shuffled = [...drillList].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, 30).join(' ');
    }
  }

  // 5. Standard Word & Time mode generation
  const wordsPool = getWordlistByLanguage(language, difficulty);
  let count = 30; // default for time mode

  if (mode === 'words') {
    if (wordOption === 'custom') {
      count = Math.max(5, Math.min(500, customWords));
    } else {
      count = wordOption;
    }
  } else if (mode === 'time') {
    // Generate ample words so user never runs out during the timer
    const seconds = options.timeOption === 'custom' ? (options.customTime || 60) : (options.timeOption || 30);
    // Provide generous word count safety buffer for high speed typists
    count = Math.max(40, Math.ceil(seconds * 3.5));
  } else if (mode === 'zen') {
    count = 150;
  }

  const generatedWords: string[] = [];
  const punctuationMarks = difficulty === 'master'
    ? ['.', ',', '!', '?', ';', ':', '-', '—']
    : ['.', ',', '!', '?', ';', ':'];

  for (let i = 0; i < count; i++) {
    let word = wordsPool[Math.floor(Math.random() * wordsPool.length)];

    // Numbers inclusion
    if (numbers && Math.random() < 0.18) {
      if (Math.random() < 0.6) {
        word = String(Math.floor(Math.random() * 990) + 10);
      } else {
        word = `${word}${Math.floor(Math.random() * 9) + 1}`;
      }
    }

    // Punctuation & Capitalization inclusion
    if (punctuation) {
      if (i === 0 || generatedWords[i - 1]?.endsWith('.')) {
        word = word.charAt(0).toUpperCase() + word.slice(1);
      } else if (Math.random() < (difficulty === 'expert' || difficulty === 'master' ? 0.25 : 0.15)) {
        word = word.charAt(0).toUpperCase() + word.slice(1);
      }

      if (i < count - 1 && Math.random() < (difficulty === 'master' ? 0.3 : 0.22)) {
        const mark = punctuationMarks[Math.floor(Math.random() * punctuationMarks.length)];
        word = `${word}${mark}`;
      }
    }

    generatedWords.push(word);
  }

  // If punctuation is ON, end the last word with a period
  if (punctuation && generatedWords.length > 0) {
    const last = generatedWords[generatedWords.length - 1];
    if (!last.endsWith('.')) {
      generatedWords[generatedWords.length - 1] = `${last}.`;
    }
  }

  return generatedWords.join(' ');
}
