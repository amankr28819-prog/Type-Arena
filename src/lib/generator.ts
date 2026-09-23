import {
  ENGLISH_WORDS,
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
  LanguageOption
} from '../types';

export interface GeneratorOptions {
  mode: TestMode;
  timeOption?: TimeOption;
  customTime?: number;
  wordOption?: WordOption;
  customWords?: number;
  quoteLength?: QuoteLength;
  language?: LanguageOption;
  punctuation?: boolean;
  numbers?: boolean;
  customText?: string;
  codeIndex?: number;
  mistakeKeys?: string[];
  mistakeWords?: string[];
}

export function getWordlistByLanguage(lang: LanguageOption = 'english'): string[] {
  switch (lang) {
    case 'hindi':
      return HINDI_WORDS;
    case 'spanish':
      return SPANISH_WORDS;
    case 'french':
      return FRENCH_WORDS;
    case 'german':
      return GERMAN_WORDS;
    case 'english':
    default:
      return ENGLISH_WORDS;
  }
}

export function generateTestText(options: GeneratorOptions): string {
  const {
    mode,
    wordOption = 25,
    customWords = 25,
    quoteLength = 'medium',
    language = 'english',
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
    const baseList = getWordlistByLanguage(language);
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
      // Shuffle drillList
      const shuffled = [...drillList].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, 30).join(' ');
    }
  }

  // 5. Standard Word & Time mode generation
  const wordsPool = getWordlistByLanguage(language);
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
    // At ~120 WPM, user types 2 words/sec. Provide 3x safety margin:
    count = Math.max(40, Math.ceil(seconds * 3.5));
  } else if (mode === 'zen') {
    // Zen mode provides initial large buffer, can replenish
    count = 150;
  }

  const generatedWords: string[] = [];
  const punctuationMarks = ['.', ',', '!', '?', ';', ':'];

  for (let i = 0; i < count; i++) {
    // Pick word
    let word = wordsPool[Math.floor(Math.random() * wordsPool.length)];

    // Numbers inclusion
    if (numbers && Math.random() < 0.18) {
      // Either inject a pure number or attach a number
      if (Math.random() < 0.6) {
        word = String(Math.floor(Math.random() * 990) + 10);
      } else {
        word = `${word}${Math.floor(Math.random() * 9) + 1}`;
      }
    }

    // Punctuation & Capitalization inclusion
    if (punctuation) {
      // Capitalize first letter occasionally (or beginning of sentence)
      if (i === 0 || generatedWords[i - 1]?.endsWith('.')) {
        word = word.charAt(0).toUpperCase() + word.slice(1);
      } else if (Math.random() < 0.15) {
        word = word.charAt(0).toUpperCase() + word.slice(1);
      }

      // Add punctuation mark occasionally
      if (i < count - 1 && Math.random() < 0.22) {
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
