import React, { useState, useEffect } from 'react';
import {
  Gamepad2,
  Trophy,
  Heart,
  Zap,
  Flame,
  Flag,
  Swords,
  Sparkles
} from 'lucide-react';
import { ENGLISH_WORDS } from '../lib/wordlists';
import { soundEngine } from '../lib/audio';
import { TypeArenaBattle } from '../components/games/TypeArenaBattle';
import { TiltCard } from '../components/ui/TiltCard';

type GameType = 'menu' | 'battle' | 'race' | 'falling' | 'bubble' | 'speed';

export const GamesPage: React.FC = () => {
  const [activeGame, setActiveGame] = useState<GameType>('menu');

  return (
    <div className="w-full max-w-5xl mx-auto py-6 sm:py-10 px-4">
      {activeGame === 'menu' && (
        <div className="flex flex-col gap-8">
          <div>
            <div className="flex items-center gap-2 text-[var(--color-primary)] font-bold text-xs uppercase tracking-wider mb-2">
              <Gamepad2 className="w-4 h-4" />
              <span>Arcade Typing Arena</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-main)] tracking-tight">
              Typing Games & Challenges
            </h1>
            <p className="text-sm text-[var(--text-sub)] max-w-2xl mt-1">
              Reinforce keyboard reflexes through gameplay. Fast-paced action tests your instant word recognition, finger independence, and composure under pressure.
            </p>
          </div>

          {/* FEATURED: TypeArena Battle Card with 3D Tilt */}
          <TiltCard
            maxTilt={6}
            onClick={() => setActiveGame('battle')}
            className="relative p-6 sm:p-8 bg-gradient-to-br from-[var(--bg-surface)] to-[var(--bg-subtle)] border-2 border-[var(--color-primary)]/50 hover:border-[var(--color-primary)] shadow-2xl transition-all cursor-pointer group flex flex-col md:flex-row items-start md:items-center justify-between gap-6 card-3d overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-80 h-80 bg-[var(--color-primary)]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col gap-3 max-w-2xl relative z-10">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-[var(--color-primary)]/20 text-[var(--color-primary)] font-bold text-[11px] uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  Featured Arcade Game
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 font-bold text-[11px]">
                  3-Round Boss Battle
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-[var(--text-main)] group-hover:text-[var(--color-primary)] transition-colors flex items-center gap-3">
                <Swords className="w-7 h-7 text-[var(--color-primary)]" />
                TypeArena Battle: Typing Duel
              </h2>

              <p className="text-xs sm:text-sm text-[var(--text-sub)] leading-relaxed">
                Step inside the arena for a high-speed typing duel! Test your keyboard reflexes with lightning keystroke strikes, combos, parry blocks, and special attacks across 3 intense boss rounds.
              </p>

              <div className="flex items-center gap-4 text-xs font-mono text-[var(--text-sub)] mt-1">
                <span>⚔️ Rapid Keystrokes</span>
                <span>•</span>
                <span>💥 Combos & Special Attacks</span>
                <span>•</span>
                <span>🛡️ Parry Block System</span>
              </div>
            </div>

            <button className="btn-3d relative z-10 px-6 py-3 rounded-2xl bg-[var(--color-primary)] text-[var(--bg-main)] font-black text-xs uppercase tracking-wider group-hover:scale-105 transition-transform flex items-center gap-2 shadow-lg shadow-[var(--color-primary)]/25 shrink-0 cursor-pointer">
              <Swords className="w-4 h-4" />
              <span>Enter Arena Battle</span>
            </button>
          </TiltCard>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Game 1: Word Race */}
            <TiltCard
              maxTilt={7}
              onClick={() => setActiveGame('race')}
              className="p-6 bg-[var(--bg-surface)] border border-[var(--border-color)] hover:border-[var(--color-primary)] transition-all cursor-pointer group flex flex-col justify-between gap-6 card-3d"
            >
              <div>
                <div className="p-3 w-fit rounded-2xl bg-amber-500/15 text-amber-400 mb-4">
                  <Flag className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[var(--text-main)] group-hover:text-[var(--color-primary)] transition-colors">
                  Word Race
                </h3>
                <p className="text-xs text-[var(--text-sub)] mt-1.5 leading-relaxed">
                  Race your car against an AI rival! Every word you type correctly propels your vehicle forward along the track. First across the finish line claims the trophy.
                </p>
              </div>
              <span className="text-xs font-bold text-[var(--color-primary)] flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                Play Word Race →
              </span>
            </TiltCard>

            {/* Game 2: Falling Words */}
            <TiltCard
              maxTilt={7}
              onClick={() => setActiveGame('falling')}
              className="p-6 bg-[var(--bg-surface)] border border-[var(--border-color)] hover:border-[var(--color-primary)] transition-all cursor-pointer group flex flex-col justify-between gap-6 card-3d"
            >
              <div>
                <div className="p-3 w-fit rounded-2xl bg-rose-500/15 text-rose-400 mb-4">
                  <Flame className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[var(--text-main)] group-hover:text-[var(--color-primary)] transition-colors">
                  Falling Words
                </h3>
                <p className="text-xs text-[var(--text-sub)] mt-1.5 leading-relaxed">
                  Words cascade down from the sky. Type them before they hit the ground line. Protect your 3 hearts and rack up high streaks!
                </p>
              </div>
              <span className="text-xs font-bold text-[var(--color-primary)] flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                Play Falling Words →
              </span>
            </TiltCard>

            {/* Game 3: Bubble Typing */}
            <TiltCard
              maxTilt={7}
              onClick={() => setActiveGame('bubble')}
              className="p-6 bg-[var(--bg-surface)] border border-[var(--border-color)] hover:border-[var(--color-primary)] transition-all cursor-pointer group flex flex-col justify-between gap-6 card-3d"
            >
              <div>
                <div className="p-3 w-fit rounded-2xl bg-cyan-500/15 text-cyan-400 mb-4">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[var(--text-main)] group-hover:text-[var(--color-primary)] transition-colors">
                  Bubble Pop
                </h3>
                <p className="text-xs text-[var(--text-sub)] mt-1.5 leading-relaxed">
                  Floating letter and word bubbles drift upwards. Type their content to burst the bubbles with satisfying mechanical pops before they float away.
                </p>
              </div>
              <span className="text-xs font-bold text-[var(--color-primary)] flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                Play Bubble Pop →
              </span>
            </TiltCard>

            {/* Game 4: Speed Sprint */}
            <TiltCard
              maxTilt={7}
              onClick={() => setActiveGame('speed')}
              className="p-6 bg-[var(--bg-surface)] border border-[var(--border-color)] hover:border-[var(--color-primary)] transition-all cursor-pointer group flex flex-col justify-between gap-6 card-3d"
            >
              <div>
                <div className="p-3 w-fit rounded-2xl bg-emerald-500/15 text-emerald-400 mb-4">
                  <Trophy className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[var(--text-main)] group-hover:text-[var(--color-primary)] transition-colors">
                  15-Second Speed Sprint
                </h3>
                <p className="text-xs text-[var(--text-sub)] mt-1.5 leading-relaxed">
                  Pure high-octane speed challenge. How many words can you nail in 15 seconds? Push your burst typing limits.
                </p>
              </div>
              <span className="text-xs font-bold text-[var(--color-primary)] flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                Play Speed Sprint →
              </span>
            </TiltCard>
          </div>
        </div>
      )}

      {/* Render Active Game */}
      {activeGame === 'battle' && <TypeArenaBattle onBack={() => setActiveGame('menu')} />}
      {activeGame === 'race' && <WordRaceGame onBack={() => setActiveGame('menu')} />}
      {activeGame === 'falling' && <FallingWordsGame onBack={() => setActiveGame('menu')} />}
      {activeGame === 'bubble' && <BubbleTypingGame onBack={() => setActiveGame('menu')} />}
      {activeGame === 'speed' && <SpeedSprintGame onBack={() => setActiveGame('menu')} />}
    </div>
  );
};

// ==========================================
// GAME 1: WORD RACE
// ==========================================
const WordRaceGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const wordsList = ['fast', 'turbo', 'engine', 'speed', 'shift', 'track', 'finish', 'drive', 'focus', 'wheel', 'brake', 'pedal', 'boost'];
  const [wordIdx, setWordIdx] = useState(0);
  const [input, setInput] = useState('');
  const [playerProgress, setPlayerProgress] = useState(0); // 0 to 100
  const [botProgress, setBotProgress] = useState(0); // 0 to 100
  const [isGameOver, setIsGameOver] = useState(false);
  const [winner, setWinner] = useState<'player' | 'bot' | null>(null);

  // Bot progress interval (approximates ~45 WPM pace)
  useEffect(() => {
    if (isGameOver) return;
    const interval = setInterval(() => {
      setBotProgress((prev) => {
        const next = prev + 1.2;
        if (next >= 100) {
          setIsGameOver(true);
          setWinner('bot');
          return 100;
        }
        return next;
      });
    }, 500);
    return () => clearInterval(interval);
  }, [isGameOver]);

  const targetWord = wordsList[wordIdx % wordsList.length];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isGameOver) return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      if (input.trim() === targetWord) {
        soundEngine.playKeystroke('clicky');
        const nextProgress = playerProgress + (100 / wordsList.length);
        if (nextProgress >= 100) {
          setPlayerProgress(100);
          setIsGameOver(true);
          setWinner('player');
          soundEngine.playSuccessChime();
        } else {
          setPlayerProgress(nextProgress);
          setWordIdx((prev) => prev + 1);
        }
      } else {
        soundEngine.playErrorSound();
      }
      setInput('');
    }
  };

  const restartRace = () => {
    setWordIdx(0);
    setInput('');
    setPlayerProgress(0);
    setBotProgress(0);
    setIsGameOver(false);
    setWinner(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between pb-4 border-b border-[var(--border-color)]">
        <button onClick={onBack} className="text-xs font-semibold text-[var(--color-primary)] hover:underline">
          ← Back to Games Menu
        </button>
        <span className="text-xs font-mono text-[var(--text-sub)]">Word Race • 45 WPM Bot</span>
      </div>

      <div className="p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-xl flex flex-col gap-6">
        {/* Race Tracks */}
        <div className="flex flex-col gap-4 p-5 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-color)]">
          {/* Player Track */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-xs font-bold text-[var(--color-primary)]">
              <span>Your Car (Player)</span>
              <span>{Math.round(playerProgress)}%</span>
            </div>
            <div className="relative w-full h-8 bg-[var(--bg-main)] rounded-xl overflow-hidden border border-[var(--border-color)] flex items-center px-2">
              <div
                className="absolute left-0 top-0 bottom-0 bg-[var(--color-primary)]/20 transition-all duration-150"
                style={{ width: `${playerProgress}%` }}
              />
              <span
                className="relative text-lg transition-all duration-150 select-none"
                style={{ left: `calc(${playerProgress}% - 24px)` }}
              >
                🏎️
              </span>
            </div>
          </div>

          {/* Bot Track */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-xs font-bold text-rose-400">
              <span>SpeedBot 45</span>
              <span>{Math.round(botProgress)}%</span>
            </div>
            <div className="relative w-full h-8 bg-[var(--bg-main)] rounded-xl overflow-hidden border border-[var(--border-color)] flex items-center px-2">
              <div
                className="absolute left-0 top-0 bottom-0 bg-rose-500/20 transition-all duration-300"
                style={{ width: `${botProgress}%` }}
              />
              <span
                className="relative text-lg transition-all duration-300 select-none"
                style={{ left: `calc(${botProgress}% - 24px)` }}
              >
                🚗
              </span>
            </div>
          </div>
        </div>

        {/* Word Display & Input Box */}
        {isGameOver ? (
          <div className="text-center p-6 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-color)]">
            <h3 className="text-2xl font-black mb-2 text-[var(--text-main)]">
              {winner === 'player' ? '🏆 YOU WON THE RACE!' : '🏁 BOT CROSSED FIRST!'}
            </h3>
            <p className="text-xs text-[var(--text-sub)] mb-4">
              {winner === 'player' ? 'Incredible burst speed and precision.' : 'SpeedBot outpaced you this round.'}
            </p>
            <button
              onClick={restartRace}
              className="px-6 py-2.5 rounded-xl bg-[var(--color-primary)] text-[var(--bg-main)] font-bold text-xs"
            >
              Race Again
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 py-4">
            <span className="text-xs uppercase tracking-widest text-[var(--text-sub)] font-semibold">
              Type the word and hit Space:
            </span>
            <div className="text-3xl font-mono font-extrabold text-[var(--color-primary)] px-6 py-3 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-color)]">
              {targetWord}
            </div>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type word + Space..."
              autoFocus
              className="w-full max-w-sm px-4 py-3 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] text-center text-lg font-mono text-[var(--text-main)] focus:outline-none focus:border-[var(--color-primary)]"
            />
          </div>
        )}
      </div>
    </div>
  );
};

// ==========================================
// GAME 2: FALLING WORDS
// ==========================================
interface FallingWord {
  id: number;
  text: string;
  x: number;
  y: number;
  speed: number;
}

const FallingWordsGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [words, setWords] = useState<FallingWord[]>([]);
  const [input, setInput] = useState('');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [isGameOver, setIsGameOver] = useState(false);

  // Spawn word every 2 seconds
  useEffect(() => {
    if (isGameOver) return;
    const interval = setInterval(() => {
      const randomText = ENGLISH_WORDS[Math.floor(Math.random() * 200)];
      const newWord: FallingWord = {
        id: Date.now() + Math.random(),
        text: randomText,
        x: Math.floor(Math.random() * 65) + 15, // 15% to 80% horizontal
        y: 0,
        speed: 0.8 + Math.random() * 0.8
      };
      setWords((prev) => [...prev, newWord]);
    }, 1800);
    return () => clearInterval(interval);
  }, [isGameOver]);

  // Fall tick interval
  useEffect(() => {
    if (isGameOver) return;
    const tick = setInterval(() => {
      setWords((prev) => {
        const next: FallingWord[] = [];
        let lostLife = false;

        for (const w of prev) {
          const nextY = w.y + w.speed;
          if (nextY >= 90) {
            lostLife = true;
          } else {
            next.push({ ...w, y: nextY });
          }
        }

        if (lostLife) {
          soundEngine.playErrorSound();
          setLives((l) => {
            const nextL = l - 1;
            if (nextL <= 0) {
              setIsGameOver(true);
            }
            return Math.max(0, nextL);
          });
        }
        return next;
      });
    }, 100);
    return () => clearInterval(tick);
  }, [isGameOver]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isGameOver) return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      const trimmed = input.trim();
      const matchIndex = words.findIndex((w) => w.text.toLowerCase() === trimmed.toLowerCase());
      if (matchIndex !== -1) {
        soundEngine.playKeystroke('clicky');
        setScore((s) => s + 10);
        setWords((prev) => prev.filter((_, idx) => idx !== matchIndex));
      } else {
        soundEngine.playErrorSound();
      }
      setInput('');
    }
  };

  const restartGame = () => {
    setWords([]);
    setInput('');
    setScore(0);
    setLives(3);
    setIsGameOver(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between pb-4 border-b border-[var(--border-color)]">
        <button onClick={onBack} className="text-xs font-semibold text-[var(--color-primary)] hover:underline">
          ← Back to Games Menu
        </button>
        <div className="flex items-center gap-6 font-mono text-xs">
          <span className="flex items-center gap-1.5 text-rose-400 font-bold">
            {Array.from({ length: 3 }).map((_, i) => (
              <Heart key={i} className={`w-4 h-4 ${i < lives ? 'fill-rose-500' : 'opacity-20'}`} />
            ))}
          </span>
          <span className="font-bold text-[var(--color-primary)]">Score: {score}</span>
        </div>
      </div>

      <div className="relative w-full h-96 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-xl overflow-hidden flex flex-col justify-end p-4">
        {/* Falling Words Container */}
        <div className="absolute inset-0 pointer-events-none">
          {words.map((w) => (
            <div
              key={w.id}
              style={{ left: `${w.x}%`, top: `${w.y}%` }}
              className="absolute -translate-x-1/2 px-2.5 py-1 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-color)] text-[var(--color-primary)] font-mono text-sm font-bold shadow-md transition-all duration-100"
            >
              {w.text}
            </div>
          ))}
          {/* Danger Bottom Line */}
          <div className="absolute bottom-16 left-0 right-0 h-[2px] bg-rose-500/40 border-b border-dashed border-rose-500" />
        </div>

        {/* Input Bar */}
        {isGameOver ? (
          <div className="relative z-10 p-6 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-color)] text-center">
            <h3 className="text-2xl font-bold text-rose-400 mb-1">Game Over!</h3>
            <p className="text-xs text-[var(--text-sub)] mb-4">Final Score: {score} points</p>
            <button
              onClick={restartGame}
              className="px-6 py-2.5 rounded-xl bg-[var(--color-primary)] text-[var(--bg-main)] font-bold text-xs"
            >
              Play Again
            </button>
          </div>
        ) : (
          <div className="relative z-10 flex justify-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type word + Space to destroy..."
              autoFocus
              className="w-full max-w-md px-4 py-2.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] text-center font-mono text-base text-[var(--text-main)] focus:outline-none focus:border-[var(--color-primary)]"
            />
          </div>
        )}
      </div>
    </div>
  );
};

// ==========================================
// GAME 3: BUBBLE TYPING
// ==========================================
interface BubbleItem {
  id: number;
  letter: string;
  x: number;
  y: number;
  speed: number;
}

const BubbleTypingGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const letters = 'abcdefghijklmnopqrstuvwxyz';
  const [bubbles, setBubbles] = useState<BubbleItem[]>([]);
  const [score, setScore] = useState(0);

  // Spawn bubbles
  useEffect(() => {
    const interval = setInterval(() => {
      const randChar = letters[Math.floor(Math.random() * letters.length)];
      setBubbles((prev) => [
        ...prev.slice(-12),
        {
          id: Date.now() + Math.random(),
          letter: randChar,
          x: Math.floor(Math.random() * 75) + 10,
          y: 85,
          speed: 1.2 + Math.random() * 1.5
        }
      ]);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Float upwards
  useEffect(() => {
    const tick = setInterval(() => {
      setBubbles((prev) =>
        prev
          .map((b) => ({ ...b, y: b.y - b.speed }))
          .filter((b) => b.y > 0)
      );
    }, 80);
    return () => clearInterval(tick);
  }, []);

  // Pop matching bubble on keystroke
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (!letters.includes(key)) return;

      setBubbles((prev) => {
        const matchIdx = prev.findIndex((b) => b.letter === key);
        if (matchIdx !== -1) {
          soundEngine.playKeystroke('clicky');
          setScore((s) => s + 5);
          return prev.filter((_, idx) => idx !== matchIdx);
        }
        return prev;
      });
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between pb-4 border-b border-[var(--border-color)]">
        <button onClick={onBack} className="text-xs font-semibold text-[var(--color-primary)] hover:underline">
          ← Back to Games Menu
        </button>
        <span className="font-mono text-xs font-bold text-[var(--color-primary)]">Score: {score}</span>
      </div>

      <div className="relative w-full h-96 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-xl overflow-hidden">
        {bubbles.map((b) => (
          <div
            key={b.id}
            style={{ left: `${b.x}%`, top: `${b.y}%` }}
            className="absolute -translate-x-1/2 w-12 h-12 rounded-full bg-[var(--color-primary)]/20 border-2 border-[var(--color-primary)] flex items-center justify-center font-mono font-black text-lg text-[var(--color-primary)] shadow-lg shadow-[var(--color-primary)]/20 animate-pulse select-none transition-all duration-75"
          >
            {b.letter.toUpperCase()}
          </div>
        ))}
        <div className="absolute bottom-4 left-0 right-0 text-center text-xs text-[var(--text-sub)]">
          Press matching key on your keyboard to pop bubbles!
        </div>
      </div>
    </div>
  );
};

// ==========================================
// GAME 4: 15-SECOND SPEED SPRINT
// ==========================================
const SpeedSprintGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const sprintWords = ['speed', 'flash', 'fast', 'quick', 'rush', 'sprint', 'zoom', 'race', 'blaze', 'hyper', 'pace', 'flow', 'rapid', 'dash'];
  const [wordIdx, setWordIdx] = useState(0);
  const [input, setInput] = useState('');
  const [timeLeft, setTimeLeft] = useState(15);
  const [wordsDone, setWordsDone] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (!isActive || isDone) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsDone(true);
          setIsActive(false);
          soundEngine.playSuccessChime();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isActive, isDone]);

  const targetWord = sprintWords[wordIdx % sprintWords.length];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isActive && !isDone) {
      setIsActive(true);
    }
    if (isDone) return;

    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      if (input.trim() === targetWord) {
        soundEngine.playKeystroke('linear');
        setWordsDone((w) => w + 1);
        setWordIdx((prev) => prev + 1);
      } else {
        soundEngine.playErrorSound();
      }
      setInput('');
    }
  };

  const restartSprint = () => {
    setWordIdx(0);
    setInput('');
    setTimeLeft(15);
    setWordsDone(0);
    setIsActive(false);
    setIsDone(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between pb-4 border-b border-[var(--border-color)]">
        <button onClick={onBack} className="text-xs font-semibold text-[var(--color-primary)] hover:underline">
          ← Back to Games Menu
        </button>
        <span className="text-xs font-mono text-[var(--text-sub)]">15-Second Speed Burst</span>
      </div>

      <div className="p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-xl flex flex-col items-center gap-6 text-center">
        {/* Timer */}
        <div className="flex flex-col items-center">
          <span className="text-xs uppercase tracking-widest text-[var(--text-sub)] font-semibold">Seconds Left</span>
          <span className="text-5xl font-black font-mono text-[var(--color-primary)]">{timeLeft}s</span>
        </div>

        {isDone ? (
          <div className="flex flex-col items-center gap-3">
            <h3 className="text-3xl font-extrabold text-[var(--text-main)]">Sprint Finished!</h3>
            <p className="text-lg font-mono text-[var(--color-correct)]">
              {wordsDone} words completed in 15 seconds! (Approx {Math.round(wordsDone * 4)} WPM)
            </p>
            <button
              onClick={restartSprint}
              className="mt-2 px-6 py-2.5 rounded-xl bg-[var(--color-primary)] text-[var(--bg-main)] font-bold text-xs"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 w-full max-w-sm">
            <div className="text-3xl font-mono font-bold text-[var(--text-main)] px-6 py-3 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-color)]">
              {targetWord}
            </div>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type word + Space to start..."
              autoFocus
              className="w-full px-4 py-3 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] text-center text-lg font-mono text-[var(--text-main)] focus:outline-none focus:border-[var(--color-primary)]"
            />
            <span className="text-xs text-[var(--text-sub)]">Words Completed: {wordsDone}</span>
          </div>
        )}
      </div>
    </div>
  );
};
