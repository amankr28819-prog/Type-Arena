import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Swords,
  RotateCcw,
  Trophy,
  Skull,
  ArrowLeft,
  Volume2,
  VolumeX,
  Zap,
  Sparkles
} from 'lucide-react';
import { soundEngine } from '../../lib/audio';

type BattleDifficulty = 'easy' | 'normal' | 'hard' | 'master';

interface FloatingDamage {
  id: number;
  target: 'bot' | 'player';
  text: string;
  isCrit: boolean;
  isBlock?: boolean;
}

const ROUND_WORDS: Record<number, string[]> = {
  1: [
    'blade', 'swift', 'strike', 'clash', 'spark', 'steel', 'slash', 'guard',
    'fury', 'dodge', 'flame', 'wrath', 'shield', 'parry', 'force', 'brave',
    'quick', 'bleed', 'storm', 'power'
  ],
  2: [
    'warrior', 'fortress', 'champion', 'vanquish', 'assault', 'tempest',
    'relentless', 'vengeance', 'crusher', 'defender', 'berserk', 'warlord',
    'gladiator', 'dominion', 'overcome', 'retribution', 'conquer'
  ],
  3: [
    'catastrophic', 'annihilate', 'impenetrable', 'unstoppable', 'obliterate',
    'destruction', 'juggernaut', 'invincible', 'devastating', 'overwhelming',
    'resurrection', 'masterpiece', 'executioner', 'infallible'
  ]
};

const BOT_ROUNDS: Record<number, { name: string; title: string; avatar: string; color: string }> = {
  1: {
    name: 'Iron Sentinel',
    title: 'Automaton Vanguard',
    avatar: '🤖',
    color: 'from-blue-600 to-cyan-500'
  },
  2: {
    name: 'Shadowblade',
    title: 'Stealth Infiltrator',
    avatar: '🥷',
    color: 'from-purple-600 to-indigo-500'
  },
  3: {
    name: 'Dragon Sovereign',
    title: 'Arena Supreme Overlord',
    avatar: '🐲',
    color: 'from-rose-600 to-amber-500'
  }
};

const DIFFICULTY_CONFIG: Record<
  BattleDifficulty,
  { label: string; botAttackIntervalSec: number; botBaseDamage: number; badgeColor: string }
> = {
  easy: {
    label: 'Novice (6.0s Bot Pace)',
    botAttackIntervalSec: 6.0,
    botBaseDamage: 12,
    badgeColor: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30'
  },
  normal: {
    label: 'Gladiator (4.2s Bot Pace)',
    botAttackIntervalSec: 4.2,
    botBaseDamage: 16,
    badgeColor: 'text-amber-400 bg-amber-500/15 border-amber-500/30'
  },
  hard: {
    label: 'Veteran (3.0s Bot Pace)',
    botAttackIntervalSec: 3.0,
    botBaseDamage: 22,
    badgeColor: 'text-rose-400 bg-rose-500/15 border-rose-500/30'
  },
  master: {
    label: 'Overlord (2.2s Bot Pace)',
    botAttackIntervalSec: 2.2,
    botBaseDamage: 28,
    badgeColor: 'text-purple-400 bg-purple-500/15 border-purple-500/30'
  }
};

export const TypeArenaBattle: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [difficulty, setDifficulty] = useState<BattleDifficulty>('normal');
  const [round, setRound] = useState<1 | 2 | 3>(1);
  const [roundScores, setRoundScores] = useState<{ player: number; bot: number }>({
    player: 0,
    bot: 0
  });

  // Combatant Health & Energy
  const [playerHp, setPlayerHp] = useState(100);
  const [botHp, setBotHp] = useState(100);
  const [specialEnergy, setSpecialEnergy] = useState(0); // 0 to 100%
  const [screenShake, setScreenShake] = useState(false);

  // Typing & Target Word State
  const [wordList, setWordList] = useState<string[]>([]);
  const [wordIndex, setWordIndex] = useState(0);
  const [input, setInput] = useState('');
  const [isInputLocked, setIsInputLocked] = useState(false);
  const wordStartTimeRef = useRef<number>(performance.now());
  const inputRef = useRef<HTMLInputElement>(null);

  // Combat Flow & Combos
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [floatingDamage, setFloatingDamage] = useState<FloatingDamage[]>([]);
  const [isBotTelegraphing, setIsBotTelegraphing] = useState(false);

  // Match Outcome & Analytics
  const [gameState, setGameState] = useState<'playing' | 'roundOver' | 'matchOver'>('playing');
  const [roundWinner, setRoundWinner] = useState<'player' | 'bot' | null>(null);
  const [totalWordsTyped, setTotalWordsTyped] = useState(0);
  const [totalKeystrokes, setTotalKeystrokes] = useState(0);
  const [correctKeystrokes, setCorrectKeystrokes] = useState(0);
  const [totalDamageDealt, setTotalDamageDealt] = useState(0);
  const [totalDamageTaken, setTotalDamageTaken] = useState(0);
  const [matchStartTime, setMatchStartTime] = useState<number>(performance.now());
  const [isMuted, setIsMuted] = useState(false);

  // Audio helper
  const playSfx = (type: 'slash' | 'hit' | 'special' | 'victory' | 'defeat' | 'click' | 'block') => {
    if (isMuted) return;
    try {
      if (type === 'slash') soundEngine.playSwordSlash();
      else if (type === 'hit') soundEngine.playSwordHit();
      else if (type === 'special') soundEngine.playSpecialAttack();
      else if (type === 'victory') soundEngine.playVictory();
      else if (type === 'defeat') soundEngine.playDefeat();
      else if (type === 'block') soundEngine.playSwordBlock();
      else if (type === 'click') soundEngine.playKeystroke('clicky');
    } catch {}
  };

  // Trigger floating damage number
  const spawnFloatingDamage = (
    target: 'bot' | 'player',
    text: string,
    isCrit: boolean = false,
    isBlock: boolean = false
  ) => {
    const id = Date.now() + Math.random();
    setFloatingDamage((prev) => [...prev, { id, target, text, isCrit, isBlock }]);
    setTimeout(() => {
      setFloatingDamage((prev) => prev.filter((d) => d.id !== id));
    }, 900);
  };

  // Initialize round word sequence
  const initRoundWords = useCallback((roundNum: 1 | 2 | 3) => {
    const source = ROUND_WORDS[roundNum] || ROUND_WORDS[1];
    const shuffled = [...source].sort(() => Math.random() - 0.5);
    setWordList(shuffled);
    setWordIndex(0);
    setInput('');
    wordStartTimeRef.current = performance.now();
  }, []);

  // Initialize match
  useEffect(() => {
    initRoundWords(1);
    setMatchStartTime(performance.now());
  }, [initRoundWords]);

  // Keep focus on typing input during combat
  useEffect(() => {
    if (gameState === 'playing' && !isInputLocked) {
      inputRef.current?.focus();
    }
  }, [gameState, isInputLocked, wordIndex]);

  // Bot Auto-Attack Timer
  useEffect(() => {
    if (gameState !== 'playing' || isInputLocked) return;

    const intervalSec = DIFFICULTY_CONFIG[difficulty].botAttackIntervalSec;
    const telegraphMs = 1200; // Warning telegraph before strike

    const telegraphTimer = setTimeout(() => {
      setIsBotTelegraphing(true);
    }, (intervalSec * 1000) - telegraphMs);

    const attackTimer = setTimeout(() => {
      setIsBotTelegraphing(false);

      // Execute Bot Attack on Player
      const baseDmg = DIFFICULTY_CONFIG[difficulty].botBaseDamage;
      const isCrit = Math.random() < 0.25;
      const incomingDmg = Math.round(baseDmg * (isCrit ? 1.5 : 1.0));

      setPlayerHp((prev) => {
        const next = Math.max(0, prev - incomingDmg);
        if (next === 0) handleRoundDefeat();
        return next;
      });

      setTotalDamageTaken((prev) => prev + incomingDmg);
      spawnFloatingDamage('player', `-${incomingDmg}`, isCrit);
      playSfx('hit');

      // Trigger screen shake
      setScreenShake(true);
      setTimeout(() => setScreenShake(false), 300);

      // Bot attack interrupts player combo
      setCombo(0);
    }, intervalSec * 1000);

    return () => {
      clearTimeout(telegraphTimer);
      clearTimeout(attackTimer);
    };
  }, [gameState, isInputLocked, difficulty, round, playerHp]);

  // Handle Round Victory
  const handleRoundVictory = () => {
    setIsInputLocked(true);
    setRoundWinner('player');
    playSfx('victory');

    setRoundScores((prev) => {
      const nextScores = { ...prev, player: prev.player + 1 };
      if (nextScores.player >= 2 || round === 3) {
        setGameState('matchOver');
      } else {
        setGameState('roundOver');
      }
      return nextScores;
    });
  };

  // Handle Round Defeat
  const handleRoundDefeat = () => {
    setIsInputLocked(true);
    setRoundWinner('bot');
    playSfx('defeat');

    setRoundScores((prev) => {
      const nextScores = { ...prev, bot: prev.bot + 1 };
      if (nextScores.bot >= 2 || round === 3) {
        setGameState('matchOver');
      } else {
        setGameState('roundOver');
      }
      return nextScores;
    });
  };

  // Proceed to Next Round
  const handleNextRound = () => {
    const nextRound = (round + 1) as 1 | 2 | 3;
    setRound(nextRound);
    setPlayerHp(100);
    setBotHp(100);
    setSpecialEnergy(0);
    setCombo(0);
    setGameState('playing');
    setIsInputLocked(false);
    initRoundWords(nextRound);
  };

  // Restart Full Match
  const handleRestartMatch = () => {
    setRound(1);
    setRoundScores({ player: 0, bot: 0 });
    setPlayerHp(100);
    setBotHp(100);
    setSpecialEnergy(0);
    setCombo(0);
    setBestCombo(0);
    setTotalWordsTyped(0);
    setTotalKeystrokes(0);
    setCorrectKeystrokes(0);
    setTotalDamageDealt(0);
    setTotalDamageTaken(0);
    setGameState('playing');
    setIsInputLocked(false);
    setMatchStartTime(performance.now());
    initRoundWords(1);
  };

  // Handle Typing Input
  const targetWord = wordList[wordIndex] || '';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (gameState !== 'playing' || isInputLocked) return;

    const val = e.target.value;
    setInput(val);
    setTotalKeystrokes((prev) => prev + 1);

    // Keystroke accuracy check
    const isCharCorrect = targetWord.startsWith(val);
    if (isCharCorrect) {
      setCorrectKeystrokes((prev) => prev + 1);
    }

    // Word Completed Check
    if (val === targetWord) {
      const now = performance.now();
      const wordTimeSec = Math.max(0.1, (now - wordStartTimeRef.current) / 1000);
      const instantWpm = Math.round((val.length / 5) / (wordTimeSec / 60));

      // Calculate Player Strike Damage
      const baseDmg = Math.round(18 + targetWord.length * 1.5);
      const isCrit = instantWpm > 75;
      const comboMultiplier = Math.min(2.5, 1 + combo * 0.15);
      const finalDmg = Math.round(baseDmg * comboMultiplier * (isCrit ? 1.4 : 1.0));

      // Bot Parry Check if bot is telegraphing
      if (isBotTelegraphing) {
        // Counter-parry bot!
        spawnFloatingDamage('player', 'PARRY BLOCK!', false, true);
        setIsBotTelegraphing(false);
      }

      // Deal damage to bot
      setBotHp((prev) => {
        const next = Math.max(0, prev - finalDmg);
        if (next === 0) handleRoundVictory();
        return next;
      });

      setTotalDamageDealt((prev) => prev + finalDmg);
      spawnFloatingDamage('bot', `-${finalDmg}`, isCrit);
      playSfx('slash');

      // Update Combos & Energy
      const newCombo = combo + 1;
      setCombo(newCombo);
      setBestCombo((prev) => Math.max(prev, newCombo));
      setSpecialEnergy((prev) => Math.min(100, prev + 18));
      setTotalWordsTyped((prev) => prev + 1);

      // Advance Word
      setInput('');
      setWordIndex((prev) => (prev + 1) % wordList.length);
      wordStartTimeRef.current = performance.now();
    }
  };

  // Special 100% Catastrophic Slash
  const handleUnleashSpecial = () => {
    if (specialEnergy < 100 || gameState !== 'playing' || isInputLocked) return;

    const specialDamage = Math.round(48 + difficulty === 'easy' ? 20 : 15);
    setSpecialEnergy(0);

    setBotHp((prev) => {
      const next = Math.max(0, prev - specialDamage);
      if (next === 0) handleRoundVictory();
      return next;
    });

    setTotalDamageDealt((prev) => prev + specialDamage);
    spawnFloatingDamage('bot', `💥 CRITICAL ${specialDamage}!`, true);
    playSfx('special');

    setScreenShake(true);
    setTimeout(() => setScreenShake(false), 450);
  };

  // Overall Match Stats
  const elapsedMinutes = Math.max(0.1, (performance.now() - matchStartTime) / 60000);
  const battleWpm = Math.round((totalWordsTyped) / elapsedMinutes);
  const accuracy = totalKeystrokes > 0 ? Math.round((correctKeystrokes / totalKeystrokes) * 100) : 100;
  const currentBotInfo = BOT_ROUNDS[round] || BOT_ROUNDS[1];

  return (
    <div
      className={`w-full max-w-5xl mx-auto py-4 sm:py-6 px-4 transition-transform duration-75 ${
        screenShake ? 'animate-shake' : ''
      }`}
    >
      {/* ARENA HEADER NAVIGATION */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] text-[var(--text-sub)] hover:text-[var(--text-main)] hover:border-[var(--color-primary)] text-xs font-bold transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Arena</span>
        </button>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full bg-[var(--color-primary)]/15 border border-[var(--color-primary)]/30 text-[var(--color-primary)] text-xs font-bold font-mono">
            ROUND {round} / 3
          </span>

          <span
            className={`px-3 py-1 rounded-full border text-xs font-bold font-mono ${
              DIFFICULTY_CONFIG[difficulty].badgeColor
            }`}
          >
            {DIFFICULTY_CONFIG[difficulty].label}
          </span>

          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-1.5 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-color)] text-[var(--text-sub)] hover:text-[var(--text-main)] cursor-pointer"
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* 2D ARCADE COMBAT ARENA */}
      <div className="relative w-full rounded-3xl bg-gradient-to-b from-[var(--bg-surface)] to-[var(--bg-subtle)] border border-[var(--border-color)] p-4 sm:p-6 shadow-2xl overflow-hidden flex flex-col gap-6">
        {/* Arena Background Decors */}
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-[var(--color-primary)]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* COMBATANT HUD & HEALTH BARS */}
        <div className="grid grid-cols-2 gap-4 sm:gap-8 items-center relative z-10">
          {/* Player Side */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">⚔️</span>
                <div>
                  <h3 className="text-sm font-black text-[var(--text-main)]">You (Challenger)</h3>
                  <span className="text-[10px] text-[var(--color-primary)] font-bold uppercase font-mono">
                    Combo: {combo}x
                  </span>
                </div>
              </div>
              <span className="text-sm font-mono font-bold text-[var(--color-correct)]">
                {playerHp} / 100 HP
              </span>
            </div>

            {/* Player Health Bar */}
            <div className="w-full h-3 rounded-full bg-[var(--bg-subtle)] border border-[var(--border-color)] overflow-hidden p-0.5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-[var(--color-correct)] transition-all duration-300 shadow-sm"
                style={{ width: `${playerHp}%` }}
              />
            </div>

            {/* Special Energy Meter */}
            <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text-sub)] mt-0.5">
              <span>SPECIAL ENERGY</span>
              <span className="text-amber-400 font-bold">{specialEnergy}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-[var(--bg-subtle)] overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-500 to-rose-500 transition-all duration-300"
                style={{ width: `${specialEnergy}%` }}
              />
            </div>
          </div>

          {/* Bot Opponent Side */}
          <div className="flex flex-col gap-1.5 text-right">
            <div className="flex items-center justify-between flex-row-reverse">
              <div className="flex items-center gap-2 flex-row-reverse">
                <span className="text-xl">{currentBotInfo.avatar}</span>
                <div>
                  <h3 className="text-sm font-black text-[var(--text-main)]">{currentBotInfo.name}</h3>
                  <span className="text-[10px] text-[var(--text-sub)] font-bold uppercase font-mono">
                    {currentBotInfo.title}
                  </span>
                </div>
              </div>
              <span className="text-sm font-mono font-bold text-rose-400">
                {botHp} / 100 HP
              </span>
            </div>

            {/* Bot Health Bar */}
            <div className="w-full h-3 rounded-full bg-[var(--bg-subtle)] border border-[var(--border-color)] overflow-hidden p-0.5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-rose-500 to-orange-500 transition-all duration-300 shadow-sm ml-auto"
                style={{ width: `${botHp}%` }}
              />
            </div>

            {/* Bot Telegraph Indicator */}
            <div className="h-4 flex items-center justify-end">
              {isBotTelegraphing && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-400 animate-pulse font-mono">
                  ⚠️ INCOMING ATTACK! TYPE TO PARRY!
                </span>
              )}
            </div>
          </div>
        </div>

        {/* COMBAT ARENA VISUAL DOCK */}
        <div className="relative w-full h-44 sm:h-56 rounded-2xl bg-[var(--bg-subtle)]/70 border border-[var(--border-color)] overflow-hidden flex items-end justify-between px-3 sm:px-8 md:px-16 pb-4">
          {/* Ground Flagstone line */}
          <div className="absolute bottom-0 left-0 right-0 h-4 bg-[var(--border-color)]" />

          {/* Player Sprite Avatar */}
          <div className="relative flex flex-col items-center z-10">
            {/* Floating Damage above Player */}
            <div className="absolute -top-12 flex flex-col items-center pointer-events-none">
              {floatingDamage
                .filter((d) => d.target === 'player')
                .map((d) => (
                  <span
                    key={d.id}
                    className={`font-black text-sm sm:text-base animate-bounce ${
                      d.isBlock ? 'text-cyan-400' : 'text-rose-400'
                    }`}
                  >
                    {d.text}
                  </span>
                ))}
            </div>

            <div className="w-20 h-28 sm:w-24 sm:h-32 rounded-2xl bg-gradient-to-t from-emerald-600/30 to-emerald-400/10 border-2 border-emerald-400/40 flex flex-col items-center justify-center p-2 shadow-lg backdrop-blur-sm">
              <span className="text-4xl sm:text-5xl">🤺</span>
              <span className="text-[10px] font-bold text-emerald-400 font-mono mt-2">PLAYER</span>
            </div>
          </div>

          {/* Arena Center Clash Area */}
          <div className="flex flex-col items-center justify-center gap-1 self-center z-10">
            <Swords className="w-8 h-8 text-[var(--color-primary)] animate-pulse" />
            <span className="text-[11px] font-black tracking-widest text-[var(--text-sub)] uppercase">
              ROUND {roundScores.player} - {roundScores.bot}
            </span>
          </div>

          {/* Bot Sprite Avatar */}
          <div className="relative flex flex-col items-center z-10">
            {/* Floating Damage above Bot */}
            <div className="absolute -top-12 flex flex-col items-center pointer-events-none">
              {floatingDamage
                .filter((d) => d.target === 'bot')
                .map((d) => (
                  <span
                    key={d.id}
                    className={`font-black text-sm sm:text-base animate-bounce ${
                      d.isCrit ? 'text-amber-400 scale-125' : 'text-emerald-400'
                    }`}
                  >
                    {d.text}
                  </span>
                ))}
            </div>

            <div
              className={`w-20 h-28 sm:w-24 sm:h-32 rounded-2xl bg-gradient-to-t from-rose-600/30 to-rose-400/10 border-2 border-rose-400/40 flex flex-col items-center justify-center p-2 shadow-lg backdrop-blur-sm ${
                isBotTelegraphing ? 'ring-4 ring-rose-500/50' : ''
              }`}
            >
              <span className="text-4xl sm:text-5xl">{currentBotInfo.avatar}</span>
              <span className="text-[10px] font-bold text-rose-400 font-mono mt-2">
                {currentBotInfo.name.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* ACTIVE TYPING COMBAT DOCK */}
        {gameState === 'playing' && (
          <div className="flex flex-col items-center gap-4 relative z-10">
            {/* Target Word Display with Keystroke Character Highlighting */}
            <div className="flex flex-col items-center gap-1">
              <span className="text-xs text-[var(--text-sub)] font-mono uppercase tracking-wider">
                Type Target Word to Strike:
              </span>
              <div className="text-2xl sm:text-3xl font-mono font-black tracking-wider px-6 py-2.5 rounded-2xl bg-[var(--bg-main)] border border-[var(--border-color)] shadow-inner flex items-center justify-center gap-0.5">
                {targetWord.split('').map((char, idx) => {
                  const typedChar = input[idx];
                  let colorClass = 'text-[var(--text-sub)]';
                  if (typedChar !== undefined) {
                    colorClass =
                      typedChar === char
                        ? 'text-[var(--color-correct)]'
                        : 'text-[var(--color-error)] bg-rose-500/20 rounded px-0.5';
                  }
                  return (
                    <span key={idx} className={`${colorClass} transition-colors duration-75`}>
                      {char}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Input Element */}
            <div className="w-full max-w-md flex items-center gap-3">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={handleInputChange}
                placeholder="Type word to strike..."
                autoFocus
                inputMode="text"
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"
                style={{ fontSize: '16px' }}
                className="w-full px-4 sm:px-5 py-3 rounded-2xl bg-[var(--bg-main)] border border-[var(--border-color)] text-center text-lg sm:text-xl font-mono text-[var(--text-main)] focus:outline-none focus:border-[var(--color-primary)] shadow-md"
              />

              {/* Special Attack Button */}
              {specialEnergy >= 100 && (
                <button
                  onClick={handleUnleashSpecial}
                  className="px-4 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 text-white font-black text-xs uppercase tracking-wider animate-bounce shadow-lg shadow-amber-500/30 flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>SPECIAL!</span>
                </button>
              )}
            </div>

            {/* Real-time battle feedback */}
            <div className="flex items-center gap-6 text-xs font-mono text-[var(--text-sub)]">
              <span className="flex items-center gap-1.5 text-[var(--color-primary)] font-bold">
                <Zap className="w-3.5 h-3.5" />
                {battleWpm} WPM
              </span>
              <span>•</span>
              <span className="font-bold text-[var(--text-main)]">{accuracy}% Accuracy</span>
              <span>•</span>
              <span className="text-emerald-400 font-bold">{totalDamageDealt} Dmg Dealt</span>
            </div>
          </div>
        )}

        {/* ROUND OVER BANNER */}
        {gameState === 'roundOver' && (
          <div className="flex flex-col items-center justify-center py-8 gap-4 text-center z-10">
            <h3
              className={`text-3xl font-black ${
                roundWinner === 'player' ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {roundWinner === 'player'
                ? `⚔️ ROUND ${round} VICTORY!`
                : `💀 ROUND ${round} DEFEAT!`}
            </h3>
            <p className="text-xs text-[var(--text-sub)] max-w-sm">
              {roundWinner === 'player'
                ? `You overpowered ${currentBotInfo.name} with lightning keyboard strikes!`
                : `${currentBotInfo.name} broke through your defenses this round.`}
            </p>

            {round < 3 && roundScores.player < 2 && roundScores.bot < 2 && (
              <button
                onClick={handleNextRound}
                className="mt-2 px-6 py-2.5 rounded-xl bg-[var(--color-primary)] text-[var(--bg-main)] font-bold text-xs hover:opacity-90 shadow-lg cursor-pointer"
              >
                Proceed to Round {round + 1} →
              </button>
            )}
          </div>
        )}

        {/* MATCH OVER FINAL SCORECARD */}
        {gameState === 'matchOver' && (
          <div className="flex flex-col items-center py-6 gap-6 text-center z-10">
            <div className="p-4 rounded-3xl bg-[var(--bg-main)] border border-[var(--border-color)] flex flex-col items-center gap-2">
              <div className="p-3 rounded-2xl bg-[var(--color-primary)]/15 text-[var(--color-primary)]">
                {roundScores.player > roundScores.bot ? (
                  <Trophy className="w-8 h-8 text-amber-400" />
                ) : (
                  <Skull className="w-8 h-8 text-rose-400" />
                )}
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[var(--text-main)]">
                {roundScores.player > roundScores.bot
                  ? '🏆 ARENA GRAND CHAMPION!'
                  : '💀 FALLEN IN THE ARENA'}
              </h2>
              <p className="text-xs text-[var(--text-sub)] max-w-md">
                {roundScores.player > roundScores.bot
                  ? `Spectacular typing combat! You conquered the arena overlords with rapid keystrokes.`
                  : `The bots proved formidable today. Sharpen your keyboard reflexes and fight again!`}
              </p>
            </div>

            {/* Scorecard Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 w-full max-w-xl">
              <div className="p-3 rounded-2xl bg-[var(--bg-main)] border border-[var(--border-color)] flex flex-col items-center">
                <span className="text-[10px] text-[var(--text-sub)] font-semibold uppercase">Rounds</span>
                <span className="text-xl font-black font-mono text-[var(--color-primary)]">
                  {roundScores.player} - {roundScores.bot}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-[var(--bg-main)] border border-[var(--border-color)] flex flex-col items-center">
                <span className="text-[10px] text-[var(--text-sub)] font-semibold uppercase">Battle WPM</span>
                <span className="text-xl font-black font-mono text-[var(--color-correct)]">
                  {battleWpm}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-[var(--bg-main)] border border-[var(--border-color)] flex flex-col items-center">
                <span className="text-[10px] text-[var(--text-sub)] font-semibold uppercase">Accuracy</span>
                <span className="text-xl font-black font-mono text-[var(--text-main)]">
                  {accuracy}%
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-[var(--bg-main)] border border-[var(--border-color)] flex flex-col items-center">
                <span className="text-[10px] text-[var(--text-sub)] font-semibold uppercase">Max Streak</span>
                <span className="text-xl font-black font-mono text-amber-400">
                  {bestCombo}x
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-[var(--bg-main)] border border-[var(--border-color)] flex flex-col items-center">
                <span className="text-[10px] text-[var(--text-sub)] font-semibold uppercase">Combat DMG</span>
                <span className="text-xl font-black font-mono text-emerald-400">
                  {totalDamageDealt}
                </span>
                <span className="text-[10px] text-rose-400 font-mono">
                  -{totalDamageTaken} taken
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={handleRestartMatch}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[var(--color-primary)] text-[var(--bg-main)] font-bold text-xs hover:opacity-90 transition-opacity cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Fight Again
              </button>

              <button
                onClick={onBack}
                className="px-6 py-2.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] text-[var(--text-main)] font-bold text-xs hover:border-[var(--color-primary)] transition-colors cursor-pointer"
              >
                Return to Arcade
              </button>
            </div>
          </div>
        )}

        {/* DIFFICULTY SELECTOR FOOTER */}
        <div className="flex flex-wrap items-center justify-between pt-4 border-t border-[var(--border-color)] text-xs text-[var(--text-sub)] relative z-10">
          <span className="font-semibold">Battle Difficulty:</span>
          <div className="flex items-center gap-2">
            {(['easy', 'normal', 'hard', 'master'] as BattleDifficulty[]).map((d) => (
              <button
                key={d}
                onClick={() => {
                  setDifficulty(d);
                  handleRestartMatch();
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                  difficulty === d
                    ? 'bg-[var(--color-primary)] text-[var(--bg-main)] font-bold shadow-sm'
                    : 'bg-[var(--bg-subtle)] text-[var(--text-sub)] hover:text-[var(--text-main)]'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
