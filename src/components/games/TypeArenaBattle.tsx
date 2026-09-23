import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Swords,
  Zap,
  RotateCcw,
  Trophy,
  Skull,
  Flame,
  ArrowLeft
} from 'lucide-react';
import { soundEngine } from '../../lib/audio';

type BattleDifficulty = 'easy' | 'normal' | 'hard' | 'master';

interface FloatingDamage {
  id: number;
  target: 'bot' | 'player';
  text: string;
  isCrit: boolean;
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

const BOT_NAMES = {
  1: 'Gorgon the Iron Vanguard',
  2: 'Vesper the Shadow Blademaster',
  3: 'Ignis the Arena Overlord'
};

const BOT_AVATARS = {
  1: '🛡️',
  2: '⚔️',
  3: '🔥'
};

const DIFFICULTY_CONFIG: Record<
  BattleDifficulty,
  { label: string; chargeDurationSec: number; botDamage: number; badgeColor: string }
> = {
  easy: {
    label: 'Novice (6.0s bot pace)',
    chargeDurationSec: 6.0,
    botDamage: 12,
    badgeColor: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30'
  },
  normal: {
    label: 'Gladiator (4.2s bot pace)',
    chargeDurationSec: 4.2,
    botDamage: 16,
    badgeColor: 'text-amber-400 bg-amber-500/15 border-amber-500/30'
  },
  hard: {
    label: 'Veteran (3.0s bot pace)',
    chargeDurationSec: 3.0,
    botDamage: 22,
    badgeColor: 'text-rose-400 bg-rose-500/15 border-rose-500/30'
  },
  master: {
    label: 'Overlord (2.2s bot pace)',
    chargeDurationSec: 2.2,
    botDamage: 28,
    badgeColor: 'text-purple-400 bg-purple-500/15 border-purple-500/30'
  }
};

export const TypeArenaBattle: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  // Game Setup & Progression
  const [difficulty, setDifficulty] = useState<BattleDifficulty>('normal');
  const [round, setRound] = useState<1 | 2 | 3>(1);
  const [roundScores, setRoundScores] = useState<{ player: number; bot: number }>({
    player: 0,
    bot: 0
  });

  // Combat State
  const [playerHp, setPlayerHp] = useState(100);
  const [botHp, setBotHp] = useState(100);
  const [botCharge, setBotCharge] = useState(0); // 0 to 100%

  // Typing State
  const [wordList, setWordList] = useState<string[]>([]);
  const [wordIndex, setWordIndex] = useState(0);
  const [input, setInput] = useState('');

  // Round & Match State
  const [gameState, setGameState] = useState<'countdown' | 'fighting' | 'roundOver' | 'matchOver'>(
    'countdown'
  );
  const [countdown, setCountdown] = useState(3);
  const [roundWinner, setRoundWinner] = useState<'player' | 'bot' | null>(null);

  // Animations & FX
  const [playerAttacking, setPlayerAttacking] = useState(false);
  const [botHit, setBotHit] = useState(false);
  const [botAttacking, setBotAttacking] = useState(false);
  const [playerHit, setPlayerHit] = useState(false);
  const [floatingDamage, setFloatingDamage] = useState<FloatingDamage[]>([]);

  // Statistics
  const [totalDamageDealt, setTotalDamageDealt] = useState(0);
  const [totalDamageTaken, setTotalDamageTaken] = useState(0);
  const [totalKeystrokes, setTotalKeystrokes] = useState(0);
  const [correctKeystrokes, setCorrectKeystrokes] = useState(0);
  const startTimeRef = useRef<number | null>(null);

  const currentConfig = DIFFICULTY_CONFIG[difficulty];
  const targetWord = wordList[wordIndex % (wordList.length || 1)] || 'clash';

  // Spawn floating damage helper
  const addFloatingDamage = useCallback((target: 'bot' | 'player', text: string, isCrit = false) => {
    const id = Date.now() + Math.random();
    setFloatingDamage((prev) => [...prev, { id, target, text, isCrit }]);
    setTimeout(() => {
      setFloatingDamage((prev) => prev.filter((item) => item.id !== id));
    }, 900);
  }, []);

  // Shuffle round wordlist on round change
  const initRoundWords = useCallback((rnd: 1 | 2 | 3) => {
    const base = [...ROUND_WORDS[rnd]];
    // Shuffle
    for (let i = base.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [base[i], base[j]] = [base[j], base[i]];
    }
    setWordList(base);
    setWordIndex(0);
    setInput('');
  }, []);

  // Start round with 3-second countdown
  const startRoundCountdown = useCallback(
    (rnd: 1 | 2 | 3) => {
      setRound(rnd);
      setPlayerHp(100);
      setBotHp(100);
      setBotCharge(0);
      setRoundWinner(null);
      setGameState('countdown');
      setCountdown(3);
      initRoundWords(rnd);
      soundEngine.playRoundStart();
    },
    [initRoundWords]
  );

  // Initial mount start
  useEffect(() => {
    startRoundCountdown(1);
  }, [startRoundCountdown]);

  // Countdown timer effect
  useEffect(() => {
    if (gameState !== 'countdown') return;

    if (countdown > 1) {
      const timer = setTimeout(() => {
        setCountdown((c) => c - 1);
        soundEngine.playKeystroke('clicky');
      }, 800);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setGameState('fighting');
        if (!startTimeRef.current) {
          startTimeRef.current = performance.now();
        }
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [gameState, countdown]);

  // Bot Attack Charge Interval
  useEffect(() => {
    if (gameState !== 'fighting') return;

    const chargeRatePer100ms = 100 / (currentConfig.chargeDurationSec * 10);

    const chargeInterval = setInterval(() => {
      setBotCharge((prev) => {
        const next = prev + chargeRatePer100ms;
        if (next >= 100) {
          // Bot Unleashes Attack!
          setBotAttacking(true);
          setPlayerHit(true);
          soundEngine.playBotAttack();

          const dmg = currentConfig.botDamage + Math.floor(Math.random() * 5);
          addFloatingDamage('player', `-${dmg} DMG`);
          setTotalDamageTaken((t) => t + dmg);

          setTimeout(() => setBotAttacking(false), 300);
          setTimeout(() => setPlayerHit(false), 450);

          setPlayerHp((hp) => {
            const nextHp = hp - dmg;
            if (nextHp <= 0) {
              // Bot wins round
              handleRoundFinish('bot');
              return 0;
            }
            return nextHp;
          });

          return 0; // reset charge
        }
        return next;
      });
    }, 100);

    return () => clearInterval(chargeInterval);
  }, [gameState, currentConfig, addFloatingDamage]);

  // Handle Round Finish
  const handleRoundFinish = (winner: 'player' | 'bot') => {
    setGameState('roundOver');
    setRoundWinner(winner);

    const nextRoundScores = {
      ...roundScores,
      [winner]: roundScores[winner] + 1
    };
    setRoundScores(nextRoundScores);

    if (winner === 'player') {
      soundEngine.playSuccessChime();
    } else {
      soundEngine.playDefeat();
    }

    // Check if match decided (or finished round 3)
    if (nextRoundScores.player === 2 || nextRoundScores.bot === 2 || round === 3) {
      setTimeout(() => {
        setGameState('matchOver');
        if (nextRoundScores.player > nextRoundScores.bot) {
          soundEngine.playVictory();
        } else {
          soundEngine.playDefeat();
        }
      }, 1400);
    }
  };

  // Next round transition
  const handleNextRound = () => {
    if (round < 3) {
      startRoundCountdown((round + 1) as 1 | 2 | 3);
    }
  };

  // Restart match from round 1
  const handleRestartMatch = () => {
    setRoundScores({ player: 0, bot: 0 });
    setTotalDamageDealt(0);
    setTotalDamageTaken(0);
    setTotalKeystrokes(0);
    setCorrectKeystrokes(0);
    startTimeRef.current = null;
    startRoundCountdown(1);
  };

  // Typing Key Input Handler
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (gameState !== 'fighting') return;

    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      const cleanInput = input.trim();
      setTotalKeystrokes((k) => k + cleanInput.length);

      if (cleanInput.toLowerCase() === targetWord.toLowerCase()) {
        // Player successful attack strike!
        setCorrectKeystrokes((c) => c + cleanInput.length);
        setPlayerAttacking(true);
        setBotHit(true);

        soundEngine.playSwordSlash();
        setTimeout(() => soundEngine.playSwordHit(), 80);

        // Calculate damage (longer words deal more damage, bonus crit chance)
        const isCrit = cleanInput.length >= 7 || Math.random() < 0.2;
        const baseDmg = Math.round(18 + cleanInput.length * 1.5);
        const dmg = isCrit ? Math.round(baseDmg * 1.4) : baseDmg;

        addFloatingDamage('bot', isCrit ? `CRIT -${dmg}!` : `-${dmg}`, isCrit);
        setTotalDamageDealt((d) => d + dmg);

        setTimeout(() => setPlayerAttacking(false), 300);
        setTimeout(() => setBotHit(false), 450);

        setBotHp((hp) => {
          const nextHp = hp - dmg;
          if (nextHp <= 0) {
            handleRoundFinish('player');
            return 0;
          }
          return nextHp;
        });

        // Advance to next word
        setWordIndex((prev) => prev + 1);
        setInput('');
      } else {
        soundEngine.playErrorSound();
        setInput('');
      }
    }
  };

  // Calculate live WPM & Accuracy
  const timeSec = startTimeRef.current
    ? Math.max(1, (performance.now() - startTimeRef.current) / 1000)
    : 1;
  const battleWpm = Math.round((correctKeystrokes / 5) / (timeSec / 60));
  const accuracy =
    totalKeystrokes > 0 ? Math.round((correctKeystrokes / totalKeystrokes) * 100) : 100;

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto">
      {/* Top Header & Navigation */}
      <div className="flex items-center justify-between pb-4 border-b border-[var(--border-color)]">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-[var(--color-primary)] hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Arcade</span>
        </button>

        {/* Round Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--bg-subtle)] border border-[var(--border-color)] font-mono text-xs font-black tracking-wider text-[var(--text-main)]">
            <Swords className="w-3.5 h-3.5 text-[var(--color-primary)]" />
            <span>ROUND {round} / 3</span>
          </div>

          <span
            className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold ${currentConfig.badgeColor}`}
          >
            {difficulty.toUpperCase()}
          </span>
        </div>

        {/* Score indicator */}
        <div className="flex items-center gap-3 font-mono text-xs font-bold">
          <span className="text-[var(--color-primary)]">You: {roundScores.player}</span>
          <span className="text-[var(--text-sub)]">vs</span>
          <span className="text-rose-400">Bot: {roundScores.bot}</span>
        </div>
      </div>

      {/* Main Combat Stage */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-2xl flex flex-col gap-8 overflow-hidden card-3d">
        {/* Ambient arena glow background */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-64 h-64 bg-[var(--color-primary)]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Battle Arena Header: Characters & HP Bars */}
        <div className="grid grid-cols-2 gap-6 sm:gap-12 relative z-10">
          {/* PLAYER SIDE */}
          <div
            className={`flex flex-col gap-3 transition-transform duration-150 ${
              playerHit ? 'scale-95 animate-shake' : playerAttacking ? 'translate-x-4' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl select-none">🗡️</span>
                <div>
                  <h3 className="font-extrabold text-sm text-[var(--text-main)]">You (Player)</h3>
                  <p className="text-[10px] text-[var(--text-sub)] font-mono">Arena Challenger</p>
                </div>
              </div>
              <span
                className={`font-mono text-sm font-black ${
                  playerHp > 50 ? 'text-emerald-400' : playerHp > 25 ? 'text-amber-400' : 'text-rose-400'
                }`}
              >
                {playerHp} / 100 HP
              </span>
            </div>

            {/* Player HP Bar */}
            <div className="relative w-full h-4 bg-[var(--bg-subtle)] rounded-full overflow-hidden border border-[var(--border-color)]">
              <div
                className={`h-full transition-all duration-300 rounded-full ${
                  playerHp > 50
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-400'
                    : playerHp > 25
                    ? 'bg-gradient-to-r from-amber-500 to-amber-400'
                    : 'bg-gradient-to-r from-rose-500 to-rose-400'
                }`}
                style={{ width: `${playerHp}%` }}
              />
            </div>

            {/* Floating damage on player */}
            {floatingDamage
              .filter((f) => f.target === 'player')
              .map((f) => (
                <div
                  key={f.id}
                  className="absolute -top-4 left-1/4 text-rose-400 font-mono font-black text-lg animate-float-damage select-none pointer-events-none"
                >
                  {f.text}
                </div>
              ))}
          </div>

          {/* BOT SIDE */}
          <div
            className={`flex flex-col gap-3 transition-transform duration-150 ${
              botHit ? 'scale-95 animate-shake' : botAttacking ? '-translate-x-4' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <span
                className={`font-mono text-sm font-black ${
                  botHp > 50 ? 'text-emerald-400' : botHp > 25 ? 'text-amber-400' : 'text-rose-400'
                }`}
              >
                {botHp} / 100 HP
              </span>
              <div className="flex items-center gap-2 text-right">
                <div>
                  <h3 className="font-extrabold text-sm text-[var(--text-main)]">
                    {BOT_NAMES[round]}
                  </h3>
                  <p className="text-[10px] text-rose-400 font-mono">Round {round} Opponent</p>
                </div>
                <span className="text-2xl select-none">{BOT_AVATARS[round]}</span>
              </div>
            </div>

            {/* Bot HP Bar */}
            <div className="relative w-full h-4 bg-[var(--bg-subtle)] rounded-full overflow-hidden border border-[var(--border-color)]">
              <div
                className={`h-full transition-all duration-300 rounded-full ml-auto ${
                  botHp > 50
                    ? 'bg-gradient-to-l from-rose-500 to-amber-500'
                    : 'bg-gradient-to-l from-rose-600 to-rose-400'
                }`}
                style={{ width: `${botHp}%` }}
              />
            </div>

            {/* Bot Attack Gauge */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[10px] font-mono text-[var(--text-sub)]">
                <span className="flex items-center gap-1 text-rose-400 font-semibold">
                  <Flame className="w-3 h-3 text-rose-500 animate-pulse" />
                  Bot Attack Gauge
                </span>
                <span>{Math.round(botCharge)}%</span>
              </div>
              <div className="w-full h-1.5 bg-[var(--bg-subtle)] rounded-full overflow-hidden border border-[var(--border-color)]">
                <div
                  className="h-full bg-rose-500 transition-all duration-100 rounded-full"
                  style={{ width: `${botCharge}%` }}
                />
              </div>
            </div>

            {/* Floating damage on bot */}
            {floatingDamage
              .filter((f) => f.target === 'bot')
              .map((f) => (
                <div
                  key={f.id}
                  className={`absolute -top-4 right-1/4 font-mono font-black text-lg animate-float-damage select-none pointer-events-none ${
                    f.isCrit ? 'text-amber-300 text-xl font-extrabold' : 'text-[var(--color-primary)]'
                  }`}
                >
                  {f.text}
                </div>
              ))}
          </div>
        </div>

        {/* Dynamic Center Action Zone */}
        {gameState === 'countdown' && (
          <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
            <span className="text-xs uppercase tracking-widest text-[var(--color-primary)] font-bold">
              Round {round} Commencing
            </span>
            <span className="text-6xl font-black font-mono text-[var(--text-main)] animate-bounce">
              {countdown}
            </span>
            <p className="text-xs text-[var(--text-sub)]">Prepare your fingers to strike!</p>
          </div>
        )}

        {gameState === 'fighting' && (
          <div className="flex flex-col items-center gap-6 py-6 relative z-10">
            {/* Visual Word Prompt */}
            <div className="flex flex-col items-center gap-2">
              <span className="text-[11px] font-semibold tracking-wider text-[var(--text-sub)] uppercase">
                Type Word & Press <kbd className="px-1.5 py-0.5 rounded bg-[var(--bg-subtle)] border text-[var(--text-main)]">Space</kbd> to Slash:
              </span>

              {/* Character by character target presentation */}
              <div className="px-8 py-4 rounded-2xl bg-[var(--bg-subtle)] border-2 border-[var(--color-primary)]/40 shadow-inner flex items-center gap-1 font-mono text-3xl font-extrabold tracking-widest">
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
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type target word..."
              autoFocus
              className="w-full max-w-md px-5 py-3 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-color)] text-center text-xl font-mono text-[var(--text-main)] focus:outline-none focus:border-[var(--color-primary)] shadow-md"
            />

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

        {/* Round Over Modal Banner */}
        {gameState === 'roundOver' && (
          <div className="flex flex-col items-center justify-center py-8 gap-4 text-center">
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
                ? `You overpowered ${BOT_NAMES[round]} with blazing keyboard strikes!`
                : `${BOT_NAMES[round]} overwhelmed your defenses this round.`}
            </p>

            {round < 3 && roundScores.player < 2 && roundScores.bot < 2 && (
              <button
                onClick={handleNextRound}
                className="mt-2 px-6 py-2.5 rounded-xl bg-[var(--color-primary)] text-[var(--bg-main)] font-bold text-xs hover:opacity-90 shadow-lg"
              >
                Proceed to Round {round + 1} →
              </button>
            )}
          </div>
        )}

        {/* Match Over Final Scorecard */}
        {gameState === 'matchOver' && (
          <div className="flex flex-col items-center py-6 gap-6 text-center">
            <div className="p-4 rounded-3xl bg-[var(--bg-subtle)] border border-[var(--border-color)] flex flex-col items-center gap-2">
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
                  ? `Spectacular combat performance! You conquered all 3 rounds and triumphed over the arena overlords.`
                  : `The bots proved formidable today. Refine your typing burst and reclaim your glory!`}
              </p>
            </div>

            {/* Scorecard Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-lg">
              <div className="p-3 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-color)] flex flex-col items-center">
                <span className="text-[10px] text-[var(--text-sub)] font-semibold uppercase">Rounds</span>
                <span className="text-xl font-black font-mono text-[var(--color-primary)]">
                  {roundScores.player} - {roundScores.bot}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-color)] flex flex-col items-center">
                <span className="text-[10px] text-[var(--text-sub)] font-semibold uppercase">Battle WPM</span>
                <span className="text-xl font-black font-mono text-[var(--color-correct)]">
                  {battleWpm}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-color)] flex flex-col items-center">
                <span className="text-[10px] text-[var(--text-sub)] font-semibold uppercase">Accuracy</span>
                <span className="text-xl font-black font-mono text-[var(--text-main)]">
                  {accuracy}%
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-color)] flex flex-col items-center">
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
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[var(--color-primary)] text-[var(--bg-main)] font-bold text-xs hover:opacity-90 transition-opacity"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Fight Again
              </button>

              <button
                onClick={onBack}
                className="px-6 py-2.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] text-[var(--text-main)] font-bold text-xs hover:border-[var(--color-primary)] transition-colors"
              >
                Return to Arcade
              </button>
            </div>
          </div>
        )}

        {/* Difficulty Selection Footer */}
        <div className="flex flex-wrap items-center justify-between pt-4 border-t border-[var(--border-color)] text-xs text-[var(--text-sub)]">
          <span className="font-semibold">Battle Difficulty:</span>
          <div className="flex items-center gap-2">
            {(['easy', 'normal', 'hard', 'master'] as BattleDifficulty[]).map((d) => (
              <button
                key={d}
                onClick={() => {
                  setDifficulty(d);
                  handleRestartMatch();
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
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
