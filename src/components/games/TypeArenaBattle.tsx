import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Swords,
  RotateCcw,
  Trophy,
  Skull,
  ArrowLeft,
  Volume2,
  VolumeX,
  Play,
  UserCheck,
  MoveLeft,
  MoveRight,
  Repeat
} from 'lucide-react';
import { soundEngine } from '../../lib/audio';
import { CartoonWarrior, type WarriorAnimation, type FacingDirection } from './CartoonWarrior';
import { WARRIOR_ROSTER, getRandomBotOpponent, type WarriorProfile } from '../../lib/warriors';
import { TiltCard } from '../ui/TiltCard';

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
  // Game Setup & Character Selection
  const [selectedPlayer, setSelectedPlayer] = useState<WarriorProfile>(WARRIOR_ROSTER[0]);
  const [currentBot, setCurrentBot] = useState<WarriorProfile>(WARRIOR_ROSTER[4]);
  const [difficulty, setDifficulty] = useState<BattleDifficulty>('normal');
  const [round, setRound] = useState<1 | 2 | 3>(1);
  const [roundScores, setRoundScores] = useState<{ player: number; bot: number }>({
    player: 0,
    bot: 0
  });

  // Arena Physics & Positioning (Movable Fighters)
  const [playerX, setPlayerX] = useState<number>(20); // 20% from left
  const [botX, setBotX] = useState<number>(75);       // 75% from left
  const [playerFacing, setPlayerFacing] = useState<FacingDirection>('right');
  const [botFacing, setBotFacing] = useState<FacingDirection>('left');

  // Combatant Health & Energy
  const [playerHp, setPlayerHp] = useState(100);
  const [botHp, setBotHp] = useState(100);
  const [specialEnergy, setSpecialEnergy] = useState(0); // 0 to 100%
  const [botCharge, setBotCharge] = useState(0);         // 0 to 100%

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
  const inputRef = useRef<HTMLInputElement>(null);

  // Combat Flow & Combos
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [floatingDamage, setFloatingDamage] = useState<FloatingDamage[]>([]);
  const [isBotTelegraphing, setIsBotTelegraphing] = useState(false);

  // Game Phase
  const [gameState, setGameState] = useState<
    'selecting' | 'countdown' | 'fighting' | 'roundOver' | 'matchOver'
  >('selecting');
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
      setPlayerX(20);
      setBotX(75);
      setPlayerFacing('right');
      setBotFacing('left');
      setRoundWinner(null);
      setGameState('countdown');
      setCountdown(3);
      initRoundWords(rnd);
      soundEngine.playRoundStart();
    },
    [initRoundWords]
  );

  // Begin Match from Character Selection
  const handleConfirmCharacter = () => {
    // Randomly choose a different bot opponent
    const bot = getRandomBotOpponent(selectedPlayer.id);
    setCurrentBot(bot);
    setRoundScores({ player: 0, bot: 0 });
    setTotalDamageDealt(0);
    setTotalDamageTaken(0);
    setTotalKeystrokes(0);
    setCorrectKeystrokes(0);
    setBestStrikeWpm(0);
    startTimeRef.current = performance.now();
    startRoundCountdown(1);
  };

  // Turn around player
  const handleToggleFacing = () => {
    setPlayerFacing((prev) => {
      if (prev === 'right') return 'left';
      if (prev === 'left') return 'back';
      return 'right';
    });
    setPlayerAnim('turn');
    setTimeout(() => setPlayerAnim('idle'), 250);
  };

  // Keyboard Movement & Controls
  const movePlayer = useCallback((delta: number) => {
    setPlayerX((prev) => {
      const next = Math.max(8, Math.min(74, prev + delta));
      return next;
    });
    if (delta > 0) setPlayerFacing('right');
    if (delta < 0) setPlayerFacing('left');
    setPlayerAnim('walk');
    setTimeout(() => {
      setPlayerAnim((a) => (a === 'walk' ? 'idle' : a));
    }, 300);
  }, []);

  // Click-to-move on Arena ground
  const handleArenaClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (gameState !== 'fighting') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clampedX = Math.max(8, Math.min(74, clickX));
    const delta = clampedX - playerX;
    if (Math.abs(delta) > 3) {
      movePlayer(delta > 0 ? 8 : -8);
    }
  };

  // Countdown timer logic
  useEffect(() => {
    if (gameState !== 'countdown') return;

    if (countdown > 1) {
      const timer = setTimeout(() => {
        setCountdown((c) => c - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setGameState('fighting');
        inputRef.current?.focus();
        wordStartTimeRef.current = performance.now();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [gameState, countdown]);

  // Round Finish Handler
  const handleRoundFinish = useCallback(
    (winner: 'player' | 'bot') => {
      setGameState('roundOver');
      setRoundWinner(winner);

      const nextScores = {
        player: roundScores.player + (winner === 'player' ? 1 : 0),
        bot: roundScores.bot + (winner === 'bot' ? 1 : 0)
      };
      setRoundScores(nextScores);

      if (winner === 'player') {
        setPlayerAnim('victory');
        setBotAnim('defeat');
        soundEngine.playVictory();
      } else {
        setBotAnim('victory');
        setPlayerAnim('defeat');
        soundEngine.playDefeat();
      }

      setTimeout(() => {
        if (round >= 3 || nextScores.player >= 2 || nextScores.bot >= 2) {
          setGameState('matchOver');
        } else {
          startRoundCountdown((round + 1) as 1 | 2 | 3);
        }
      }, 2400);
    },
    [round, roundScores, startRoundCountdown]
  );

  // Bot Attack AI Loop
  useEffect(() => {
    if (gameState !== 'fighting') return;

    const intervalMs = 100;
    const step = 100 / ((currentConfig.botAttackIntervalSec * 1000) / intervalMs);

    const timer = setInterval(() => {
      setBotCharge((charge) => {
        const next = charge + step;

        if (next >= 75 && !isBotTelegraphing) {
          setIsBotTelegraphing(true);
        }

        if (next >= 100) {
          // Bot Unleashes Attack
          setIsBotTelegraphing(false);
          setBotFacing('left');
          setBotAnim('attack');
          soundEngine.playBotAttack();

          setTimeout(() => {
            // Player hit impact
            setPlayerAnim('hit');
            triggerCameraShake();

            // Calculate damage with player defense stat
            const baseDmg = currentConfig.botBaseDamage + Math.floor(Math.random() * 5);
            const defFactor = Math.max(0.65, 1 - (selectedPlayer.stats.defense - 50) * 0.005);
            const dmg = Math.round(baseDmg * defFactor);

            addFloatingDamage('player', `-${dmg} HP`);
            setTotalDamageTaken((t) => t + dmg);
            setCombo(0);

            setPlayerHp((hp) => {
              const nextHp = hp - dmg;
              if (nextHp <= 0) {
                handleRoundFinish('bot');
                return 0;
              }
              return nextHp;
            });

            setTimeout(() => {
              setPlayerAnim('idle');
              setBotAnim('idle');
            }, 350);
          }, 320);

          return 0;
        }

        return next;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [
    gameState,
    currentConfig,
    isBotTelegraphing,
    handleRoundFinish,
    addFloatingDamage,
    triggerCameraShake,
    selectedPlayer.stats.defense
  ]);

  // Execute Player Attack on Word Complete
  const executePlayerAttack = useCallback(
    (isSpecial = false) => {
      if (gameState !== 'fighting' || isInputLocked) return;

      setIsInputLocked(true);
      setPlayerFacing('right');

      // Word strike duration & velocity
      const elapsedMs = performance.now() - wordStartTimeRef.current;
      const wordWpm = Math.round((targetWord.length / 5) / (Math.max(elapsedMs, 250) / 60000));
      setBestStrikeWpm((b) => Math.max(b, wordWpm));

      // Critical strike evaluation (enhanced by Valeria passive)
      const critThreshold = selectedPlayer.id === 'valeria' ? 65 : 72;
      const isCrit = wordWpm >= critThreshold;

      // Combo count
      const nextCombo = combo + 1;
      setCombo(nextCombo);
      setBestCombo((b) => Math.max(b, nextCombo));

      // Sound FX
      if (isSpecial) {
        soundEngine.playSpecialAttack();
      } else {
        soundEngine.playSwordSlash();
        soundEngine.playComboChime(nextCombo);
      }

      // Step 1: Attack Anticipation
      setPlayerAnim('attackAnticipation');

      // Step 2: Sword Swing & Travel to Hit point
      setTimeout(() => {
        setPlayerAnim(isSpecial ? 'specialAttack' : 'attack');

        // Check if Bot was charging and Parry / Block was performed
        const wasParry = isBotTelegraphing;
        if (wasParry) {
          soundEngine.playSwordBlock();
          setBotCharge((c) => Math.max(0, c - 45)); // Disrupt bot charge
        }

        // Step 3: Collision at Hit point
        setTimeout(() => {
          soundEngine.playSwordHit();
          triggerCameraShake();
          setBotAnim('stagger');

          // Damage Calculation based on character stats, combo, and special
          const statPowerMultiplier = selectedPlayer.stats.power / 80;
          const baseDmg = (16 + targetWord.length * 1.6) * statPowerMultiplier;
          const comboMult = Math.min(2.5, 1 + (nextCombo - 1) * 0.15);
          const critMult = isCrit ? 1.45 : 1.0;
          const specialMult = isSpecial ? 2.4 : 1.0;

          const totalDmg = Math.round(baseDmg * comboMult * critMult * specialMult);
          setTotalDamageDealt((d) => d + totalDmg);

          const floatText = isSpecial
            ? `SPECIAL! -${totalDmg} HP`
            : isCrit
            ? `CRIT! -${totalDmg} HP`
            : `-${totalDmg} HP`;

          addFloatingDamage('bot', floatText, isCrit || isSpecial, wasParry);

          // Energy Charge (enhanced by Seraphina passive)
          const energyGain = selectedPlayer.id === 'seraphina' ? 24 : 18;
          setSpecialEnergy((e) => (isSpecial ? 0 : Math.min(100, e + energyGain)));

          // Apply damage to bot HP
          setBotHp((hp) => {
            const nextHp = hp - totalDmg;
            if (nextHp <= 0) {
              handleRoundFinish('player');
              return 0;
            }
            return nextHp;
          });

          // Step 4: Recovery to Idle
          setTimeout(() => {
            setPlayerAnim('attackRecovery');
            setBotAnim('idle');

            setTimeout(() => {
              setPlayerAnim('idle');
              setWordIndex((idx) => idx + 1);
              setInput('');
              setIsInputLocked(false);
              wordStartTimeRef.current = performance.now();
              inputRef.current?.focus();
            }, 180);
          }, 240);
        }, 160);
      }, 120);
    },
    [
      gameState,
      isInputLocked,
      targetWord,
      combo,
      isBotTelegraphing,
      selectedPlayer,
      triggerCameraShake,
      addFloatingDamage,
      handleRoundFinish
    ]
  );

  // Keyboard Typing & Control Handler
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (gameState !== 'fighting') return;

    // Movement hotkeys: Left/Right Arrow or A/D when alt/ctrl held, or tab for special
    if (e.key === 'Tab' && specialEnergy >= 100) {
      e.preventDefault();
      executePlayerAttack(true);
      return;
    }

    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      movePlayer(-6);
      return;
    }
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      movePlayer(6);
      return;
    }
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      handleToggleFacing();
      return;
    }

    if (isInputLocked) {
      e.preventDefault();
      return;
    }

    // Process typing keystrokes
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      setTotalKeystrokes((k) => k + 1);

      const nextInput = input + e.key;
      const expectedChar = targetWord[input.length];

      if (e.key === expectedChar) {
        setCorrectKeystrokes((k) => k + 1);
        soundEngine.playKeypress(true);

        if (nextInput === targetWord) {
          e.preventDefault();
          executePlayerAttack(false);
          return;
        }
      } else {
        soundEngine.playKeypress(false);
        setCombo(0); // Reset combo on mistake
      }
    }
  };

  // Restart match handler
  const handleRestartMatch = () => {
    setRoundScores({ player: 0, bot: 0 });
    setTotalDamageDealt(0);
    setTotalDamageTaken(0);
    setTotalKeystrokes(0);
    setCorrectKeystrokes(0);
    setBestStrikeWpm(0);
    startTimeRef.current = performance.now();
    startRoundCountdown(1);
  };

  // Combat Stats Calculation
  const elapsedMinutes = startTimeRef.current
    ? Math.max((performance.now() - startTimeRef.current) / 60000, 0.05)
    : 1;
  const combatWpm = Math.round((correctKeystrokes / 5) / elapsedMinutes);
  const combatAccuracy = totalKeystrokes > 0
    ? Math.round((correctKeystrokes / totalKeystrokes) * 100)
    : 100;

  return (
    <div
      className={`w-full max-w-5xl mx-auto flex flex-col gap-6 select-none transition-transform duration-100 ${
        screenShake ? 'scale-[1.015] translate-y-1' : ''
      }`}
    >
      {/* 1. Header & Navigation Controls */}
      <div className="flex items-center justify-between px-2">
        <button
          onClick={onBack}
          className="btn-3d flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs font-semibold text-[var(--text-sub)] hover:text-[var(--text-main)] cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Arena</span>
        </button>

        <div className="flex items-center gap-2">
          {gameState !== 'selecting' && (
            <button
              onClick={() => setGameState('selecting')}
              className="btn-3d flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs font-bold text-[var(--color-primary)] cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Change Fighter</span>
            </button>
          )}

          {/* Difficulty selector */}
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as BattleDifficulty)}
            disabled={gameState === 'fighting'}
            className="px-2.5 py-1.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs font-bold text-[var(--text-main)] cursor-pointer outline-none"
          >
            <option value="easy">Novice</option>
            <option value="normal">Gladiator</option>
            <option value="hard">Veteran</option>
            <option value="master">Overlord</option>
          </select>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className="btn-3d p-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-sub)] hover:text-[var(--text-main)] cursor-pointer"
            title={soundMuted ? 'Unmute' : 'Mute'}
          >
            {soundMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* PHASE A: CHARACTER SELECTION SCREEN */}
      {gameState === 'selecting' && (
        <div className="flex flex-col gap-6 p-6 sm:p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-6">
            <div>
              <div className="flex items-center gap-2 text-[var(--color-primary)] font-bold text-xs uppercase tracking-wider mb-1">
                <Swords className="w-4 h-4" />
                <span>Warrior Roster Selection</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-[var(--text-main)]">
                Choose Your Arena Champion
              </h1>
              <p className="text-xs text-[var(--text-sub)] mt-1">
                Select an adult action heroine or powerhouse gladiator. Each warrior features distinct weapons, stats, and combat silhouettes.
              </p>
            </div>

            <button
              onClick={handleConfirmCharacter}
              className="btn-3d flex items-center justify-center gap-2 px-8 py-3 rounded-2xl bg-[var(--color-primary)] text-[var(--bg-main)] font-black text-sm shadow-xl shadow-[var(--color-primary)]/25 cursor-pointer hover:opacity-90"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Enter Arena with {selectedPlayer.name}</span>
            </button>
          </div>

          {/* 8-Warrior Selection Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {WARRIOR_ROSTER.map((warrior) => {
              const isSelected = selectedPlayer.id === warrior.id;
              return (
                <TiltCard
                  key={warrior.id}
                  onClick={() => setSelectedPlayer(warrior)}
                  maxTilt={10}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[var(--bg-subtle)] border-[var(--color-primary)] shadow-lg shadow-[var(--color-primary)]/20 ring-2 ring-[var(--color-primary)]/30'
                      : 'bg-[var(--bg-surface)] border-[var(--border-color)] hover:border-[var(--color-primary)]/50'
                  }`}
                >
                  <div className="flex flex-col items-center">
                    {/* Header Badges */}
                    <div className="flex items-center justify-between w-full text-[10px] font-bold uppercase mb-2">
                      <span className="text-[var(--text-sub)]">{warrior.archetype}</span>
                      <span
                        className={`px-1.5 py-0.5 rounded ${
                          warrior.gender === 'female'
                            ? 'bg-rose-500/15 text-rose-400'
                            : 'bg-indigo-500/15 text-indigo-400'
                        }`}
                      >
                        {warrior.gender}
                      </span>
                    </div>

                    {/* Animated Character Full-Body Preview */}
                    <div className="h-44 w-full flex items-center justify-center overflow-hidden my-1">
                      <CartoonWarrior
                        warrior={warrior}
                        animation={isSelected ? 'idle' : 'idle'}
                        scale={0.88}
                      />
                    </div>

                    {/* Name & Title */}
                    <h3 className="text-base font-extrabold text-[var(--text-main)] text-center">
                      {warrior.name}
                    </h3>
                    <span className="text-[11px] text-[var(--color-primary)] font-semibold text-center mb-2">
                      {warrior.title}
                    </span>

                    {/* Weapon Info */}
                    <div className="w-full text-center px-2 py-1 rounded-lg bg-[var(--bg-main)] text-[10px] text-[var(--text-sub)] font-mono mb-3">
                      🗡️ {warrior.weaponName}
                    </div>

                    {/* Combat Stat Bars */}
                    <div className="flex flex-col gap-1.5 w-full text-[10px] font-mono">
                      <div className="flex items-center justify-between">
                        <span className="text-[var(--text-sub)]">Speed</span>
                        <span className="font-bold text-[var(--text-main)]">{warrior.stats.speed}</span>
                      </div>
                      <div className="w-full h-1 rounded-full bg-[var(--border-color)] overflow-hidden">
                        <div
                          className="h-full bg-cyan-400 rounded-full"
                          style={{ width: `${warrior.stats.speed}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-[var(--text-sub)]">Power</span>
                        <span className="font-bold text-[var(--text-main)]">{warrior.stats.power}</span>
                      </div>
                      <div className="w-full h-1 rounded-full bg-[var(--border-color)] overflow-hidden">
                        <div
                          className="h-full bg-rose-400 rounded-full"
                          style={{ width: `${warrior.stats.power}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-[var(--text-sub)]">Defense</span>
                        <span className="font-bold text-[var(--text-main)]">{warrior.stats.defense}</span>
                      </div>
                      <div className="w-full h-1 rounded-full bg-[var(--border-color)] overflow-hidden">
                        <div
                          className="h-full bg-amber-400 rounded-full"
                          style={{ width: `${warrior.stats.defense}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Passive Description */}
                  <div className="mt-3 pt-2 border-t border-[var(--border-color)] text-[10px] text-[var(--text-sub)] italic text-center">
                    {warrior.passiveDescription}
                  </div>
                </TiltCard>
              );
            })}
          </div>
        </div>
      )}

      {/* PHASE B: BATTLE ARENA */}
      {gameState !== 'selecting' && (
        <div className="flex flex-col gap-4">
          {/* Top Status & Health Bars */}
          <div className="p-4 sm:p-5 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-xl flex flex-col gap-3">
            <div className="flex items-center justify-between">
              {/* Player Fighter Info */}
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-[var(--color-primary)]/15 border border-[var(--color-primary)]/30 flex items-center justify-center font-bold text-xs text-[var(--color-primary)]">
                  {selectedPlayer.name[0]}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-[var(--text-main)]">
                      {selectedPlayer.name}
                    </span>
                    <span className="text-[10px] text-[var(--color-primary)]">
                      (P1: {roundScores.player})
                    </span>
                  </div>
                  <span className="text-[10px] text-[var(--text-sub)] font-mono">
                    {selectedPlayer.weaponName}
                  </span>
                </div>
              </div>

              {/* Round Indicator */}
              <div className="flex flex-col items-center">
                <div className="px-3 py-1 rounded-full bg-[var(--bg-subtle)] border border-[var(--border-color)] font-mono text-[11px] font-bold text-[var(--text-main)]">
                  ROUND {round} OF 3
                </div>
                {combo > 1 && (
                  <span className="text-xs font-black text-amber-400 animate-pulse mt-0.5">
                    🔥 COMBO x{combo}!
                  </span>
                )}
              </div>

              {/* Bot Opponent Info */}
              <div className="flex items-center gap-2 text-right">
                <div>
                  <div className="flex items-center justify-end gap-1.5">
                    <span className="text-[10px] text-rose-400">(BOT: {roundScores.bot})</span>
                    <span className="text-xs font-black text-[var(--text-main)]">
                      {currentBot.name}
                    </span>
                  </div>
                  <span className="text-[10px] text-[var(--text-sub)] font-mono">
                    {currentBot.title}
                  </span>
                </div>
                <div className="w-9 h-9 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center font-bold text-xs text-rose-400">
                  {currentBot.name[0]}
                </div>
              </div>
            </div>

            {/* Health Bars Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Player Health Bar */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-[11px] font-mono font-bold">
                  <span className="text-[var(--text-sub)]">HP: {playerHp}/100</span>
                  {specialEnergy >= 100 && (
                    <span className="text-amber-400 font-extrabold animate-bounce">
                      SPECIAL READY [TAB]
                    </span>
                  )}
                </div>
                <div className="w-full h-3 rounded-full bg-[var(--bg-main)] p-0.5 border border-[var(--border-color)] overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      playerHp > 50
                        ? 'bg-gradient-to-r from-emerald-500 to-emerald-400'
                        : playerHp > 25
                        ? 'bg-gradient-to-r from-amber-500 to-amber-400'
                        : 'bg-gradient-to-r from-rose-500 to-rose-400'
                    }`}
                    style={{ width: `${Math.max(0, playerHp)}%` }}
                  />
                </div>
                {/* Special Energy Meter */}
                <div className="w-full h-1.5 rounded-full bg-[var(--bg-main)] overflow-hidden mt-0.5">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 to-amber-400 transition-all duration-200"
                    style={{ width: `${specialEnergy}%` }}
                  />
                </div>
              </div>

              {/* Bot Health Bar */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-[11px] font-mono font-bold">
                  {isBotTelegraphing ? (
                    <span className="text-rose-400 animate-pulse font-extrabold">
                      ⚠️ CHARGING STRIKE!
                    </span>
                  ) : (
                    <span className="text-[var(--text-sub)]">ATTACK CHARGE</span>
                  )}
                  <span className="text-[var(--text-sub)]">HP: {botHp}/100</span>
                </div>
                <div className="w-full h-3 rounded-full bg-[var(--bg-main)] p-0.5 border border-[var(--border-color)] overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      botHp > 50
                        ? 'bg-gradient-to-r from-emerald-500 to-emerald-400'
                        : botHp > 25
                        ? 'bg-gradient-to-r from-amber-500 to-amber-400'
                        : 'bg-gradient-to-r from-rose-500 to-rose-400'
                    }`}
                    style={{ width: `${Math.max(0, botHp)}%` }}
                  />
                </div>
                {/* Bot Attack Meter */}
                <div className="w-full h-1.5 rounded-full bg-[var(--bg-main)] overflow-hidden mt-0.5">
                  <div
                    className={`h-full transition-all duration-100 ${
                      isBotTelegraphing ? 'bg-rose-500 animate-pulse' : 'bg-rose-400/80'
                    }`}
                    style={{ width: `${botCharge}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 3D ARENA BATTLEFIELD (Movable Fighters + Click-To-Move Floor) */}
          <div
            onClick={handleArenaClick}
            className="relative w-full h-80 sm:h-96 rounded-3xl overflow-hidden bg-gradient-to-b from-[#090d16] via-[#121929] to-[#0a0f1d] border border-[var(--border-color)] shadow-2xl flex flex-col justify-end cursor-crosshair"
          >
            {/* Ambient Torchlight & Floating Ember Particles */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-8 left-12 w-28 h-28 rounded-full bg-cyan-500/10 blur-2xl" />
              <div className="absolute top-8 right-12 w-28 h-28 rounded-full bg-rose-500/10 blur-2xl" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-32 bg-amber-500/5 blur-3xl" />
            </div>

            {/* 3D Perspective Ground Plane */}
            <div className="absolute bottom-0 left-0 right-0 h-40 arena-ground-3d bg-gradient-to-t from-slate-900 via-stone-900 to-transparent border-t border-slate-700/30">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:18px_18px]" />
            </div>

            {/* Floating Damage Numbers */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
              {floatingDamage.map((dmg) => (
                <div
                  key={dmg.id}
                  className={`absolute font-mono font-black text-sm sm:text-base animate-in fade-in zoom-in-110 duration-200 ${
                    dmg.isCrit
                      ? 'text-amber-300 drop-shadow-[0_0_8px_#f59e0b]'
                      : dmg.isBlock
                      ? 'text-cyan-300 drop-shadow-[0_0_8px_#38bdf8]'
                      : 'text-rose-400 drop-shadow-[0_0_6px_#ef4444]'
                  }`}
                  style={{
                    left: dmg.target === 'bot' ? `${botX + 8}%` : `${playerX + 5}%`,
                    top: '40%'
                  }}
                >
                  {dmg.text}
                </div>
              ))}
            </div>

            {/* Countdown Overlay */}
            {gameState === 'countdown' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/55 backdrop-blur-xs z-30 pointer-events-none">
                <span className="text-xs uppercase font-extrabold tracking-widest text-[var(--color-primary)] mb-2">
                  ROUND {round} STARTING
                </span>
                <span className="text-7xl sm:text-8xl font-black font-mono text-[var(--text-main)] animate-bounce">
                  {countdown}
                </span>
              </div>
            )}

            {/* Round Result Banner Overlay */}
            {gameState === 'roundOver' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-xs z-30 pointer-events-none animate-in fade-in">
                <span className="text-3xl sm:text-4xl font-black text-[var(--text-main)]">
                  {roundWinner === 'player' ? '🏆 ROUND WON!' : '💀 ROUND LOST!'}
                </span>
                <span className="text-xs text-[var(--text-sub)] mt-1 font-mono">
                  {roundWinner === 'player'
                    ? `${selectedPlayer.name} dealt the decisive blow.`
                    : `${currentBot.name} overwhelmed your defenses.`}
                </span>
              </div>
            )}

            {/* Fighters Staged Inside Battlefield */}
            <div className="relative w-full h-64 sm:h-72 z-10">
              {/* Player Fighter (Movable X position & Dynamic Facing) */}
              <div
                className="absolute bottom-6 transition-all duration-150 ease-out"
                style={{
                  left: `${playerX}%`,
                  transform: 'translateX(-50%)'
                }}
              >
                <CartoonWarrior
                  warrior={selectedPlayer}
                  animation={playerAnim}
                  facing={playerFacing}
                  scale={1.05}
                />
              </div>

              {/* Bot Fighter (Positioned across stage) */}
              <div
                className="absolute bottom-6 transition-all duration-200 ease-out"
                style={{
                  left: `${botX}%`,
                  transform: 'translateX(-50%)'
                }}
              >
                <CartoonWarrior
                  warrior={currentBot}
                  animation={botAnim}
                  facing={botFacing}
                  scale={1.05}
                  isBot={true}
                />
              </div>
            </div>
          </div>

          {/* Movement & Facing Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 px-2 py-1 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl text-xs">
            <div className="flex items-center gap-1.5 text-[var(--text-sub)]">
              <span>Arena Controls:</span>
              <button
                onClick={() => movePlayer(-6)}
                className="btn-3d flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-color)] text-[var(--text-main)] font-mono cursor-pointer"
                title="Step Left"
              >
                <MoveLeft className="w-3.5 h-3.5" />
                <span>[← / A]</span>
              </button>
              <button
                onClick={() => movePlayer(6)}
                className="btn-3d flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-color)] text-[var(--text-main)] font-mono cursor-pointer"
                title="Step Right"
              >
                <MoveRight className="w-3.5 h-3.5" />
                <span>[→ / D]</span>
              </button>
              <button
                onClick={handleToggleFacing}
                className="btn-3d flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-color)] text-[var(--color-primary)] font-mono cursor-pointer"
                title="Turn Around"
              >
                <Repeat className="w-3.5 h-3.5" />
                <span>Turn [W / S]</span>
              </button>
            </div>

            <div className="text-[11px] text-[var(--text-sub)] font-mono">
              Click battlefield floor to walk • Type words to strike
            </div>
          </div>

          {/* TYPING INPUT & COMBAT COMMAND PANEL */}
          <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-xl flex flex-col items-center gap-4">
            {gameState === 'fighting' && (
              <div className="flex flex-col items-center gap-3 w-full max-w-lg">
                {/* Target Word Display with Keystroke Character Highlighting */}
                <div className="flex items-center justify-center gap-1 text-3xl sm:text-4xl font-mono font-black tracking-wider py-2">
                  {targetWord.split('').map((char, index) => {
                    const typedChar = input[index];
                    const isMatched = typedChar === char;
                    const isCurrent = index === input.length;

                    return (
                      <span
                        key={index}
                        className={`transition-all ${
                          isMatched
                            ? 'text-[var(--color-correct)] drop-shadow-[0_0_8px_rgba(34,197,94,0.4)]'
                            : typedChar
                            ? 'text-[var(--color-error)] underline'
                            : isCurrent
                            ? 'text-[var(--color-primary)] animate-pulse'
                            : 'text-[var(--text-sub)] opacity-50'
                        }`}
                      >
                        {char}
                      </span>
                    );
                  })}
                </div>

                {/* Hidden / Transparent Keystroke Receiver Input */}
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={() => {}}
                  onKeyDown={handleKeyDown}
                  autoFocus
                  disabled={isInputLocked}
                  className="w-full text-center px-4 py-3 rounded-2xl bg-[var(--bg-subtle)] border-2 border-[var(--color-primary)] text-xl font-mono font-bold text-[var(--text-main)] outline-none shadow-inner"
                  placeholder="Type the word above to strike..."
                />

                {/* Special Attack Trigger Button */}
                {specialEnergy >= 100 && (
                  <button
                    onClick={() => executePlayerAttack(true)}
                    className="btn-3d w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-amber-500 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-amber-500/25 cursor-pointer animate-pulse"
                  >
                    ⚡ UNLEASH 100% SPECIAL ATTACK CLEAVE [TAB] ⚡
                  </button>
                )}
              </div>
            )}

            {/* MATCH OVER SCORECARD & CERTIFICATE RESULT */}
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
                      ? `Flawless swordsmanship! ${selectedPlayer.name} claimed victory across the tournament.`
                      : `${currentBot.name} outmatched you in the final round. Re-sharpen your keyboard instincts!`}
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
                    <span className="text-[9px] text-[var(--text-sub)] font-mono">Peak: {bestStrikeWpm} WPM</span>
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
                    <span className="text-[10px] text-[var(--text-sub)] font-semibold uppercase">Damage</span>
                    <span className="text-base font-black font-mono text-cyan-400">
                      +{totalDamageDealt} HP
                    </span>
                    <span className="text-[10px] font-mono text-rose-400">
                      -{totalDamageTaken} HP
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
                    onClick={() => setGameState('selecting')}
                    className="btn-3d flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] text-[var(--text-main)] font-bold text-xs hover:border-[var(--color-primary)] transition-colors cursor-pointer"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Change Fighter</span>
                  </button>

                  <button
                    onClick={onBack}
                    className="btn-3d px-6 py-2.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] text-[var(--text-sub)] font-bold text-xs hover:text-[var(--text-main)] transition-colors cursor-pointer"
                  >
                    Return to Arcade
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
