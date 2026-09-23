import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Swords,
  Shield,
  Zap,
  RotateCcw,
  Trophy,
  Skull,
  Flame,
  ArrowLeft,
  Volume2,
  VolumeX
} from 'lucide-react';
import { soundEngine } from '../../lib/audio';
import { CartoonWarrior, type WarriorAnimation, type WarriorType } from './CartoonWarrior';

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

const BOT_DATA: Record<number, { name: string; title: string; type: WarriorType }> = {
  1: { name: 'Gorgon', title: 'The Iron Vanguard', type: 'bot-1' },
  2: { name: 'Vesper', title: 'The Shadow Blademaster', type: 'bot-2' },
  3: { name: 'Ignis', title: 'The Arena Overlord', type: 'bot-3' }
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
  // Game Setup
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
  const [botCharge, setBotCharge] = useState(0); // 0 to 100%

  // Character Animation States
  const [playerAnim, setPlayerAnim] = useState<WarriorAnimation>('idle');
  const [botAnim, setBotAnim] = useState<WarriorAnimation>('idle');
  const [screenShake, setScreenShake] = useState(false);

  // Typing & Target Word State
  const [wordList, setWordList] = useState<string[]>([]);
  const [wordIndex, setWordIndex] = useState(0);
  const [input, setInput] = useState('');
  const [isInputLocked, setIsInputLocked] = useState(false);
  const wordStartTimeRef = useRef<number>(performance.now());

  // Combat Flow & Combos
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [perfectHitActive, setPerfectHitActive] = useState(false);
  const [floatingDamage, setFloatingDamage] = useState<FloatingDamage[]>([]);
  const [isBotTelegraphing, setIsBotTelegraphing] = useState(false);

  // Game Phase
  const [gameState, setGameState] = useState<'countdown' | 'fighting' | 'roundOver' | 'matchOver'>(
    'countdown'
  );
  const [countdown, setCountdown] = useState(3);
  const [roundWinner, setRoundWinner] = useState<'player' | 'bot' | null>(null);
  const [soundMuted, setSoundMuted] = useState(false);

  // Combat Statistics
  const [totalDamageDealt, setTotalDamageDealt] = useState(0);
  const [totalDamageTaken, setTotalDamageTaken] = useState(0);
  const [totalKeystrokes, setTotalKeystrokes] = useState(0);
  const [correctKeystrokes, setCorrectKeystrokes] = useState(0);
  const [bestStrikeWpm, setBestStrikeWpm] = useState(0);
  const startTimeRef = useRef<number | null>(null);

  const currentConfig = DIFFICULTY_CONFIG[difficulty];
  const currentBot = BOT_DATA[round];
  const targetWord = wordList[wordIndex % (wordList.length || 1)] || 'strike';

  // Toggle audio
  const toggleSound = () => {
    const next = !soundMuted;
    setSoundMuted(next);
    soundEngine.setMuted(next);
  };

  // Trigger floating damage helper
  const addFloatingDamage = useCallback(
    (target: 'bot' | 'player', text: string, isCrit = false, isBlock = false) => {
      const id = Date.now() + Math.random();
      setFloatingDamage((prev) => [...prev, { id, target, text, isCrit, isBlock }]);
      setTimeout(() => {
        setFloatingDamage((prev) => prev.filter((item) => item.id !== id));
      }, 950);
    },
    []
  );

  // Trigger camera screen shake
  const triggerCameraShake = useCallback(() => {
    setScreenShake(true);
    setTimeout(() => setScreenShake(false), 380);
  }, []);

  // Shuffle and set round words
  const initRoundWords = useCallback((rnd: 1 | 2 | 3) => {
    const base = [...ROUND_WORDS[rnd]];
    for (let i = base.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [base[i], base[j]] = [base[j], base[i]];
    }
    setWordList(base);
    setWordIndex(0);
    setInput('');
    setIsInputLocked(false);
    wordStartTimeRef.current = performance.now();
  }, []);

  // Start round countdown
  const startRoundCountdown = useCallback(
    (rnd: 1 | 2 | 3) => {
      setRound(rnd);
      setPlayerHp(100);
      setBotHp(100);
      setBotCharge(0);
      setSpecialEnergy(0);
      setCombo(0);
      setPlayerAnim('idle');
      setBotAnim('idle');
      setRoundWinner(null);
      setGameState('countdown');
      setCountdown(3);
      initRoundWords(rnd);
      soundEngine.playRoundStart();
    },
    [initRoundWords]
  );

  useEffect(() => {
    startRoundCountdown(1);
  }, [startRoundCountdown]);

  // Countdown timer logic
  useEffect(() => {
    if (gameState !== 'countdown') return;

    if (countdown > 1) {
      const timer = setTimeout(() => {
        setCountdown((c) => c - 1);
        soundEngine.playButtonClick();
      }, 750);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setGameState('fighting');
        wordStartTimeRef.current = performance.now();
        if (!startTimeRef.current) {
          startTimeRef.current = performance.now();
        }
      }, 750);
      return () => clearTimeout(timer);
    }
  }, [gameState, countdown]);

  // Bot Attack Charge Loop
  useEffect(() => {
    if (gameState !== 'fighting') return;

    const chargeRatePer100ms = 100 / (currentConfig.botAttackIntervalSec * 10);

    const interval = setInterval(() => {
      setBotCharge((prev) => {
        const next = prev + chargeRatePer100ms;

        // Telegraph warning when charge >= 75%
        if (next >= 75 && !isBotTelegraphing) {
          setIsBotTelegraphing(true);
        }

        // Full charge reached: Bot Attacks!
        if (next >= 100) {
          setIsBotTelegraphing(false);

          // Bot lunge & attack
          setBotAnim('attack');
          soundEngine.playBotAttack();

          setTimeout(() => {
            // Player hit impact
            setPlayerAnim('hit');
            triggerCameraShake();

            const dmg = currentConfig.botBaseDamage + Math.floor(Math.random() * 5);
            addFloatingDamage('player', `-${dmg} HP`);
            setTotalDamageTaken((t) => t + dmg);

            // Reset combo on taking damage
            setCombo(0);

            setPlayerHp((hp) => {
              const nextHp = hp - dmg;
              if (nextHp <= 0) {
                handleRoundFinish('bot');
                return 0;
              }
              return nextHp;
            });

            // Return animations to idle
            setTimeout(() => {
              setBotAnim('idle');
              setPlayerAnim('idle');
            }, 350);
          }, 200);

          return 0; // reset charge
        }
        return next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [gameState, currentConfig, isBotTelegraphing, addFloatingDamage, triggerCameraShake]);

  // Handle Round Finish
  const handleRoundFinish = (winner: 'player' | 'bot') => {
    setGameState('roundOver');
    setRoundWinner(winner);

    if (winner === 'player') {
      setPlayerAnim('victory');
      setBotAnim('defeat');
      soundEngine.playVictory();
    } else {
      setPlayerAnim('defeat');
      setBotAnim('victory');
      soundEngine.playDefeat();
    }

    const nextRoundScores = {
      ...roundScores,
      [winner]: roundScores[winner] + 1
    };
    setRoundScores(nextRoundScores);

    // If a fighter won 2 rounds or round 3 concluded -> match ends
    if (nextRoundScores.player >= 2 || nextRoundScores.bot >= 2 || round === 3) {
      setTimeout(() => {
        setGameState('matchOver');
        if (nextRoundScores.player > nextRoundScores.bot) {
          soundEngine.playVictory();
        } else {
          soundEngine.playDefeat();
        }
      }, 1600);
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
    setBestCombo(0);
    setBestStrikeWpm(0);
    startTimeRef.current = null;
    startRoundCountdown(1);
  };

  // Execute Player Special Attack (100% Energy)
  const triggerSpecialAttack = useCallback(() => {
    if (specialEnergy < 100 || isInputLocked || gameState !== 'fighting') return;

    setIsInputLocked(true);
    setPlayerAnim('specialAttack');
    soundEngine.playSpecialAttack();
    triggerCameraShake();

    const specialDmg = 55 + Math.floor(Math.random() * 10);

    setTimeout(() => {
      setBotAnim('hit');
      addFloatingDamage('bot', `💥 SPECIAL CRIT -${specialDmg}!`, true);
      setTotalDamageDealt((d) => d + specialDmg);

      setBotHp((hp) => {
        const nextHp = hp - specialDmg;
        if (nextHp <= 0) {
          handleRoundFinish('player');
          return 0;
        }
        return nextHp;
      });

      setSpecialEnergy(0);

      setTimeout(() => {
        setPlayerAnim('idle');
        setBotAnim('idle');
        setIsInputLocked(false);
      }, 450);
    }, 280);
  }, [specialEnergy, isInputLocked, gameState, triggerCameraShake, addFloatingDamage]);

  // Execute Defensive Parry / Block
  const triggerParryBlock = useCallback(() => {
    if (gameState !== 'fighting' || !isBotTelegraphing || isInputLocked) return;

    soundEngine.playSwordBlock();
    setPlayerAnim('block');
    addFloatingDamage('player', '🛡️ BLOCKED!', false, true);

    // Deflect and stun the bot, reducing bot charge to 0
    setBotCharge(0);
    setIsBotTelegraphing(false);

    // Deal parry counter-damage to bot
    const parryDmg = 15;
    setTimeout(() => {
      setBotAnim('hit');
      addFloatingDamage('bot', `PARRY COUNTER -${parryDmg}!`, true);
      setTotalDamageDealt((d) => d + parryDmg);

      setBotHp((hp) => {
        const nextHp = hp - parryDmg;
        if (nextHp <= 0) {
          handleRoundFinish('player');
          return 0;
        }
        return nextHp;
      });

      setTimeout(() => {
        setPlayerAnim('idle');
        setBotAnim('idle');
      }, 350);
    }, 150);
  }, [gameState, isBotTelegraphing, isInputLocked, addFloatingDamage]);

  // Keyboard and Input Handling
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (gameState !== 'fighting' || isInputLocked) return;

    // Special attack hotkey: Tab or Shift+Enter
    if (e.key === 'Tab' || (e.shiftKey && e.key === 'Enter')) {
      e.preventDefault();
      if (specialEnergy >= 100) {
        triggerSpecialAttack();
        return;
      }
    }

    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      const cleanInput = input.trim();
      if (!cleanInput) return;

      setTotalKeystrokes((k) => k + cleanInput.length);

      if (cleanInput.toLowerCase() === targetWord.toLowerCase()) {
        // Calculate Word Burst Speed
        const wordTimeSec = Math.max(0.2, (performance.now() - wordStartTimeRef.current) / 1000);
        const wordWpm = Math.round((cleanInput.length / 5) / (wordTimeSec / 60));
        if (wordWpm > bestStrikeWpm) setBestStrikeWpm(wordWpm);

        const isPerfect = wordWpm >= 70;
        if (isPerfect) {
          setPerfectHitActive(true);
          setTimeout(() => setPerfectHitActive(false), 900);
        }

        // Lock input momentarily during sword swing
        setIsInputLocked(true);
        setCorrectKeystrokes((c) => c + cleanInput.length);

        // Advance combo
        const nextCombo = combo + 1;
        setCombo(nextCombo);
        if (nextCombo > bestCombo) setBestCombo(nextCombo);
        soundEngine.playComboChime(nextCombo);

        // Charge Special Attack Energy (+15% base, +5% for high combo)
        setSpecialEnergy((prev) => Math.min(100, prev + 15 + Math.min(10, nextCombo * 2)));

        // Trigger Real Sword Attack Sequence
        setPlayerAnim('attack');
        soundEngine.playSwordSlash();

        // Calculate Damage with Combo & Perfect multipliers
        const comboBonus = 1 + (nextCombo - 1) * 0.15;
        const perfectMultiplier = isPerfect ? 1.4 : 1.0;
        const baseDmg = 18 + cleanInput.length * 1.5;
        const totalDmg = Math.round(baseDmg * comboBonus * perfectMultiplier);

        setTimeout(() => {
          // Sword strikes bot
          soundEngine.playSwordHit();
          setBotAnim('hit');
          triggerCameraShake();

          addFloatingDamage(
            'bot',
            isPerfect ? `PERFECT -${totalDmg}!` : nextCombo >= 3 ? `COMBO x${nextCombo} -${totalDmg}!` : `-${totalDmg} HP`,
            isPerfect || nextCombo >= 3
          );
          setTotalDamageDealt((d) => d + totalDmg);

          setBotHp((hp) => {
            const nextHp = hp - totalDmg;
            if (nextHp <= 0) {
              handleRoundFinish('player');
              return 0;
            }
            return nextHp;
          });

          // Return to combat idle & unlock next word
          setTimeout(() => {
            setPlayerAnim('idle');
            setBotAnim('idle');
            setIsInputLocked(false);
            setWordIndex((prev) => prev + 1);
            setInput('');
            wordStartTimeRef.current = performance.now();
          }, 240);
        }, 160);
      } else {
        // Mistake: reset combo and play error sound
        soundEngine.playErrorSound();
        setCombo(0);
        setInput('');
      }
    }
  };

  // Combat WPM & Accuracy calculation
  const totalElapsedSec = startTimeRef.current
    ? Math.max(1, (performance.now() - startTimeRef.current) / 1000)
    : 1;
  const combatWpm = Math.round((correctKeystrokes / 5) / (totalElapsedSec / 60));
  const combatAccuracy =
    totalKeystrokes > 0 ? Math.round((correctKeystrokes / totalKeystrokes) * 100) : 100;

  return (
    <div className={`flex flex-col gap-5 w-full max-w-5xl mx-auto ${screenShake ? 'animate-shake' : ''}`}>
      {/* Top Header & Combat HUD */}
      <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)]">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-[var(--color-primary)] hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Exit Arena</span>
        </button>

        {/* Round Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-1 rounded-full bg-[var(--bg-subtle)] border border-[var(--border-color)] font-mono text-xs font-black tracking-wider text-[var(--text-main)] shadow-sm">
            <Swords className="w-4 h-4 text-[var(--color-primary)]" />
            <span>ROUND {round} / 3</span>
          </div>

          <span className={`text-[11px] px-2.5 py-0.5 rounded-full border font-bold ${currentConfig.badgeColor}`}>
            {difficulty.toUpperCase()}
          </span>

          <button
            onClick={toggleSound}
            title={soundMuted ? 'Unmute Audio' : 'Mute Audio'}
            className="p-1.5 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-color)] text-[var(--text-sub)] hover:text-[var(--text-main)]"
          >
            {soundMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Match Win Score */}
        <div className="flex items-center gap-3 font-mono text-xs font-bold">
          <span className="text-[var(--color-primary)]">You: {roundScores.player}</span>
          <span className="text-[var(--text-sub)]">vs</span>
          <span className="text-rose-400">Enemy: {roundScores.bot}</span>
        </div>
      </div>

      {/* 3D ARENA STAGE CONTAINER */}
      <div className="relative rounded-3xl border-2 border-[var(--border-color)] shadow-2xl overflow-hidden bg-gradient-to-b from-[#070b12] via-[#0d1522] to-[#141e30]">
        {/* Dynamic Sky & Arena Atmosphere */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Distant Mountain / Colosseum Silhouette */}
          <div className="absolute bottom-32 left-0 right-0 h-44 opacity-25 bg-[radial-gradient(ellipse_at_bottom,_var(--color-primary)_0%,_transparent_70%)]" />

          {/* Torches on Colosseum Pillars */}
          <div className="absolute top-12 left-12 w-6 h-6 rounded-full bg-amber-500/30 blur-md animate-pulse" />
          <div className="absolute top-12 right-12 w-6 h-6 rounded-full bg-rose-500/30 blur-md animate-pulse" />

          {/* Floating Ember Particles */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(56,189,248,0.06),transparent_60%)]" />
        </div>

        {/* TOP STATUS BAR: HP & Attack Meters */}
        <div className="relative z-10 grid grid-cols-2 gap-8 px-6 sm:px-12 pt-6">
          {/* PLAYER STATUS */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-extrabold">
              <span className="text-[var(--text-main)] flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-primary)] animate-pulse" />
                Player Knight
              </span>
              <span
                className={`font-mono text-sm ${
                  playerHp > 50 ? 'text-emerald-400' : playerHp > 25 ? 'text-amber-400' : 'text-rose-400'
                }`}
              >
                {playerHp} / 100 HP
              </span>
            </div>

            {/* Health Bar */}
            <div className="w-full h-3.5 bg-[var(--bg-subtle)] rounded-full overflow-hidden border border-[var(--border-color)] shadow-inner">
              <div
                className={`h-full transition-all duration-300 rounded-full ${
                  playerHp > 50
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-400'
                    : playerHp > 25
                    ? 'bg-gradient-to-r from-amber-500 to-amber-400'
                    : 'bg-gradient-to-r from-rose-600 to-rose-400'
                }`}
                style={{ width: `${playerHp}%` }}
              />
            </div>

            {/* Special Attack Meter */}
            <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text-sub)]">
              <span className="flex items-center gap-1 text-[var(--color-primary)] font-semibold">
                <Zap className="w-3 h-3 text-[var(--color-primary)]" />
                Special Energy: {Math.round(specialEnergy)}%
              </span>
              {specialEnergy >= 100 && (
                <span className="text-amber-400 font-extrabold animate-bounce">READY! [TAB]</span>
              )}
            </div>
            <div className="w-full h-1.5 bg-[var(--bg-subtle)] rounded-full overflow-hidden border border-[var(--border-color)]">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-amber-400 transition-all duration-200 rounded-full"
                style={{ width: `${specialEnergy}%` }}
              />
            </div>
          </div>

          {/* BOT STATUS */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-extrabold">
              <span
                className={`font-mono text-sm ${
                  botHp > 50 ? 'text-emerald-400' : botHp > 25 ? 'text-amber-400' : 'text-rose-400'
                }`}
              >
                {botHp} / 100 HP
              </span>
              <span className="text-right text-rose-400 flex items-center gap-1.5">
                {currentBot.name} — {currentBot.title}
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
              </span>
            </div>

            {/* Health Bar */}
            <div className="w-full h-3.5 bg-[var(--bg-subtle)] rounded-full overflow-hidden border border-[var(--border-color)] shadow-inner">
              <div
                className={`h-full transition-all duration-300 rounded-full ml-auto ${
                  botHp > 50
                    ? 'bg-gradient-to-l from-rose-500 to-amber-500'
                    : 'bg-gradient-to-l from-rose-600 to-rose-400'
                }`}
                style={{ width: `${botHp}%` }}
              />
            </div>

            {/* Bot Attack Charge Bar */}
            <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text-sub)]">
              <span className="text-rose-400 font-bold">
                {isBotTelegraphing ? '⚠️ INCOMING STRIKE! PARRY NOW!' : 'Attack Charge:'}
              </span>
              <span>{Math.round(botCharge)}%</span>
            </div>
            <div className="w-full h-1.5 bg-[var(--bg-subtle)] rounded-full overflow-hidden border border-[var(--border-color)]">
              <div
                className={`h-full transition-all duration-100 rounded-full ${
                  isBotTelegraphing ? 'bg-rose-500 animate-pulse' : 'bg-rose-500/70'
                }`}
                style={{ width: `${botCharge}%` }}
              />
            </div>
          </div>
        </div>

        {/* 3D ARENA GROUND & CHARACTERS COMBAT FIELD */}
        <div className="relative h-72 sm:h-80 w-full flex items-end justify-between px-8 sm:px-24 pb-8 overflow-hidden">
          {/* 3D Stone Grid Perspective Ground */}
          <div className="absolute inset-x-0 bottom-0 h-36 arena-ground-3d bg-[linear-gradient(to_bottom,#1e293b_1px,transparent_1px),linear-gradient(to_right,#1e293b_1px,transparent_1px)] bg-[size:36px_36px] bg-[rgba(15,23,42,0.8)] border-t border-[var(--border-color)]/60 pointer-events-none" />

          {/* Floating Damage Text Indicators */}
          {floatingDamage.map((f) => (
            <div
              key={f.id}
              className={`absolute top-16 z-30 font-mono font-black text-xl animate-float-damage select-none pointer-events-none ${
                f.target === 'player' ? 'left-1/4 text-rose-400' : 'right-1/4 text-[var(--color-primary)]'
              } ${f.isCrit ? 'text-amber-300 text-2xl font-black drop-shadow-[0_0_8px_#facc15]' : ''} ${
                f.isBlock ? 'text-cyan-400' : ''
              }`}
            >
              {f.text}
            </div>
          ))}

          {/* Perfect Hit Floating Banner */}
          {perfectHitActive && (
            <div className="absolute top-8 left-1/2 -translate-x-1/2 z-30 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-white font-black text-xs uppercase tracking-widest shadow-xl animate-bounce">
              ⚡ PERFECT HIT! +40% CRIT DAMAGE!
            </div>
          )}

          {/* PLAYER WARRIOR RIG */}
          <div className="relative z-20 flex flex-col items-center">
            {combo >= 2 && (
              <div className="absolute -top-10 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 font-mono text-[11px] font-black tracking-wider flex items-center gap-1 animate-pulse">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                COMBO x{combo}
              </div>
            )}
            <CartoonWarrior type="player" animation={playerAnim} scale={1.15} />
          </div>

          {/* BOT WARRIOR RIG */}
          <div className="relative z-20 flex flex-col items-center">
            {isBotTelegraphing && (
              <div className="absolute -top-10 px-2.5 py-0.5 rounded-full bg-rose-500/25 border border-rose-500 text-rose-400 font-mono text-[11px] font-black animate-bounce flex items-center gap-1">
                ⚠️ CHARGING ATTACK!
              </div>
            )}
            <CartoonWarrior
              type={currentBot.type}
              animation={botAnim}
              isFlipped={true}
              scale={1.15}
            />
          </div>
        </div>

        {/* INTERACTIVE COMBAT HUD & WORD INPUT BAR */}
        <div className="relative z-20 p-6 bg-[rgba(12,16,23,0.85)] border-t border-[var(--border-color)] flex flex-col items-center gap-4">
          {gameState === 'countdown' && (
            <div className="flex flex-col items-center py-4 text-center">
              <span className="text-xs uppercase tracking-widest text-[var(--color-primary)] font-bold mb-1">
                ROUND {round} COMMENCING
              </span>
              <span className="text-6xl font-black font-mono text-[var(--text-main)] animate-bounce">
                {countdown}
              </span>
              <p className="text-xs text-[var(--text-sub)] mt-1">Get ready to strike with your keyboard!</p>
            </div>
          )}

          {gameState === 'fighting' && (
            <div className="w-full flex flex-col items-center gap-4">
              {/* Target Word Display with character-by-character feedback */}
              <div className="flex flex-col items-center gap-1.5">
                <span className="text-[11px] text-[var(--text-sub)] font-semibold uppercase tracking-wider">
                  Type Word & Press <kbd className="px-1.5 py-0.5 rounded bg-[var(--bg-subtle)] border text-[var(--text-main)]">Space</kbd> to Slash:
                </span>
                <div className="px-8 py-3 rounded-2xl bg-[var(--bg-subtle)] border-2 border-[var(--color-primary)]/50 shadow-inner flex items-center gap-1 font-mono text-3xl font-extrabold tracking-widest">
                  {targetWord.split('').map((char, idx) => {
                    const typedChar = input[idx];
                    let cls = 'text-[var(--text-sub)]';
                    if (typedChar !== undefined) {
                      cls =
                        typedChar === char
                          ? 'text-[var(--color-correct)]'
                          : 'text-[var(--color-error)] bg-rose-500/20 rounded px-0.5';
                    }
                    return (
                      <span key={idx} className={`${cls} transition-colors duration-75`}>
                        {char}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Input Box & Action Controls */}
              <div className="flex flex-wrap items-center justify-center gap-3 w-full max-w-lg">
                <input
                  type="text"
                  value={input}
                  disabled={isInputLocked}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={isInputLocked ? 'Striking enemy...' : 'Type word here + Space...'}
                  autoFocus
                  className="flex-1 min-w-[240px] px-5 py-3 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-center text-xl font-mono text-[var(--text-main)] focus:outline-none focus:border-[var(--color-primary)] shadow-md disabled:opacity-50"
                />

                {/* Special Attack Button */}
                <button
                  type="button"
                  onClick={triggerSpecialAttack}
                  disabled={specialEnergy < 100 || isInputLocked}
                  className={`btn-3d px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                    specialEnergy >= 100
                      ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-lg shadow-amber-500/25 animate-pulse cursor-pointer'
                      : 'bg-[var(--bg-subtle)] border border-[var(--border-color)] text-[var(--text-sub)] opacity-50 cursor-not-allowed'
                  }`}
                >
                  <Zap className="w-4 h-4" />
                  <span>Special [TAB]</span>
                </button>

                {/* Parry / Block Defense Button */}
                {isBotTelegraphing && (
                  <button
                    type="button"
                    onClick={triggerParryBlock}
                    className="btn-3d px-5 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-[var(--bg-main)] font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-cyan-500/30 animate-bounce cursor-pointer"
                  >
                    <Shield className="w-4 h-4" />
                    <span>PARRY!</span>
                  </button>
                )}
              </div>

              {/* Live Combat Metrics Bar */}
              <div className="flex items-center gap-6 text-xs font-mono text-[var(--text-sub)] mt-1">
                <span className="flex items-center gap-1.5 text-[var(--color-primary)] font-bold">
                  <Zap className="w-3.5 h-3.5" />
                  {combatWpm} WPM
                </span>
                <span>•</span>
                <span className="font-bold text-[var(--text-main)]">{combatAccuracy}% Accuracy</span>
                <span>•</span>
                <span className="text-emerald-400 font-bold">{totalDamageDealt} DMG Dealt</span>
                <span>•</span>
                <span className="text-amber-400 font-bold">{bestStrikeWpm} Peak Strike WPM</span>
              </div>
            </div>
          )}

          {/* Round Over Transition Banner */}
          {gameState === 'roundOver' && (
            <div className="flex flex-col items-center py-6 text-center gap-3">
              <h3
                className={`text-3xl font-black ${
                  roundWinner === 'player' ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {roundWinner === 'player'
                  ? `⚔️ ROUND ${round} VICTORY!`
                  : `💀 ROUND ${round} DEFEAT!`}
              </h3>
              <p className="text-xs text-[var(--text-sub)] max-w-md">
                {roundWinner === 'player'
                  ? `You overwhelmed ${currentBot.name} with precise blade combinations!`
                  : `${currentBot.name} breached your defense this round.`}
              </p>

              {round < 3 && roundScores.player < 2 && roundScores.bot < 2 && (
                <button
                  onClick={handleNextRound}
                  className="btn-3d mt-2 px-7 py-2.5 rounded-xl bg-[var(--color-primary)] text-[var(--bg-main)] font-bold text-xs shadow-lg cursor-pointer"
                >
                  Proceed to Round {round + 1} →
                </button>
              )}
            </div>
          )}

          {/* Match Over Final Scorecard */}
          {gameState === 'matchOver' && (
            <div className="flex flex-col items-center py-6 gap-6 text-center w-full max-w-xl">
              <div className="p-4 rounded-3xl bg-[var(--bg-subtle)] border border-[var(--border-color)] flex flex-col items-center gap-2 w-full">
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
                    : '💀 DEFEATED IN THE ARENA'}
                </h2>
                <p className="text-xs text-[var(--text-sub)] max-w-md">
                  {roundScores.player > roundScores.bot
                    ? `Flawless swordsmanship! You claimed victory across 3 grueling combat rounds.`
                    : `The arena titans outmatched you today. Re-sharpen your keyboard instincts!`}
                </p>
              </div>

              {/* Scorecard Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 w-full">
                <div className="p-3 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-color)] flex flex-col items-center">
                  <span className="text-[10px] text-[var(--text-sub)] font-semibold uppercase">Rounds</span>
                  <span className="text-xl font-black font-mono text-[var(--color-primary)]">
                    {roundScores.player} - {roundScores.bot}
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-color)] flex flex-col items-center">
                  <span className="text-[10px] text-[var(--text-sub)] font-semibold uppercase">Combat WPM</span>
                  <span className="text-xl font-black font-mono text-[var(--color-correct)]">
                    {combatWpm}
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-color)] flex flex-col items-center">
                  <span className="text-[10px] text-[var(--text-sub)] font-semibold uppercase">Accuracy</span>
                  <span className="text-xl font-black font-mono text-[var(--text-main)]">
                    {combatAccuracy}%
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-color)] flex flex-col items-center">
                  <span className="text-[10px] text-[var(--text-sub)] font-semibold uppercase">Best Combo</span>
                  <span className="text-xl font-black font-mono text-amber-400">
                    x{bestCombo}
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-color)] flex flex-col items-center">
                  <span className="text-[10px] text-[var(--text-sub)] font-semibold uppercase">Damage Taken</span>
                  <span className="text-xl font-black font-mono text-rose-400">
                    {totalDamageTaken} HP
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={handleRestartMatch}
                  className="btn-3d flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[var(--color-primary)] text-[var(--bg-main)] font-bold text-xs cursor-pointer shadow-md"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Fight Again</span>
                </button>

                <button
                  onClick={onBack}
                  className="btn-3d px-6 py-2.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] text-[var(--text-main)] font-bold text-xs hover:border-[var(--color-primary)] transition-colors cursor-pointer"
                >
                  Return to Arcade
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Difficulty Selector Footer */}
        <div className="flex flex-wrap items-center justify-between px-6 py-3 bg-[var(--bg-surface)] border-t border-[var(--border-color)] text-xs text-[var(--text-sub)]">
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
