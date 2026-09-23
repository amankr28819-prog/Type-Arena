import React from 'react';
import {
  Activity,
  Wind,
  Sun,
  Flame,
  Moon,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import type { PhysicsParams } from './physics/SecondaryDynamics';
import type { LightingMood } from './environment/ZenCourtyard3D';

interface PhysicsDemoPanelProps {
  physicsParams: PhysicsParams;
  onChangePhysics: (params: PhysicsParams) => void;
  lightingMood: LightingMood;
  onSetLightingMood: (mood: LightingMood) => void;
  onResetPhysics: () => void;
}

export const PhysicsDemoPanel: React.FC<PhysicsDemoPanelProps> = ({
  physicsParams,
  onChangePhysics,
  lightingMood,
  onSetLightingMood,
  onResetPhysics,
}) => {
  const updateParam = (key: keyof PhysicsParams, val: number) => {
    onChangePhysics({
      ...physicsParams,
      [key]: val,
    });
  };

  const moods: { id: LightingMood; label: string; icon: React.ReactNode; desc: string }[] = [
    {
      id: 'twilight',
      label: 'Twilight Sakura',
      icon: <Sparkles className="w-3.5 h-3.5 text-pink-400" />,
      desc: 'Cinematic dusk with warm lanterns & magenta rim glow',
    },
    {
      id: 'sunset',
      label: 'Golden Hour',
      icon: <Flame className="w-3.5 h-3.5 text-amber-400" />,
      desc: 'Warm golden sunlight & dramatic amber shadows',
    },
    {
      id: 'moonlight',
      label: 'Moonlit Zen',
      icon: <Moon className="w-3.5 h-3.5 text-cyan-400" />,
      desc: 'Cool cyan moonlight & vivid neon rim highlights',
    },
    {
      id: 'studio',
      label: 'Clean Studio',
      icon: <Sun className="w-3.5 h-3.5 text-blue-300" />,
      desc: 'High-key neutral illumination for figure inspection',
    },
  ];

  return (
    <div className="flex flex-col gap-4 text-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[var(--border-color)]">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-rose-400" />
          <span className="font-bold text-sm text-[var(--text-main)]">Physics Demo & Lab</span>
        </div>
        <button
          onClick={onResetPhysics}
          className="btn-3d flex items-center gap-1 px-2 py-1 rounded-lg bg-[var(--bg-subtle)] hover:bg-[var(--bg-surface)] border border-[var(--border-color)] text-[10px] text-[var(--text-sub)] hover:text-[var(--text-main)] cursor-pointer"
          title="Reset to Default Physics"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Defaults</span>
        </button>
      </div>

      {/* 1. Upper-Body Soft Dynamics Intensity */}
      <div className="flex flex-col gap-1.5 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20">
        <div className="flex items-center justify-between text-[11px]">
          <span className="font-semibold text-rose-300 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
            <span>Upper-Body Soft Dynamics</span>
          </span>
          <span className="font-mono font-bold text-rose-400">
            {physicsParams.upperBodyIntensity.toFixed(1)}x
          </span>
        </div>
        <input
          type="range"
          min="0.0"
          max="2.0"
          step="0.1"
          value={physicsParams.upperBodyIntensity}
          onChange={(e) => updateParam('upperBodyIntensity', parseFloat(e.target.value))}
          className="w-full h-1.5 bg-black/40 rounded-lg appearance-none cursor-pointer accent-rose-400"
        />
        <div className="flex justify-between text-[9px] text-[var(--text-muted)] font-mono">
          <span>0.0x (Rigid)</span>
          <span>1.0x (Natural)</span>
          <span>2.0x (Max)</span>
        </div>
        <span className="text-[10px] text-rose-200/70 mt-0.5">
          Dual-mass spring simulation responding to footsteps, movement inertia, turns, and jumps.
        </span>
      </div>

      {/* 2. Hair & Braids Elasticity */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-[11px]">
          <span className="font-medium text-[var(--text-main)]">Hair & Braid Elasticity</span>
          <span className="font-mono text-[var(--color-primary)]">
            {physicsParams.hairElasticity.toFixed(1)}x
          </span>
        </div>
        <input
          type="range"
          min="0.2"
          max="2.0"
          step="0.1"
          value={physicsParams.hairElasticity}
          onChange={(e) => updateParam('hairElasticity', parseFloat(e.target.value))}
          className="w-full h-1.5 bg-[var(--bg-subtle)] rounded-lg appearance-none cursor-pointer accent-[var(--color-primary)]"
        />
        <span className="text-[10px] text-[var(--text-muted)]">
          Controls how flexibly the twin braided twintails and fringe lag behind motion and drift in wind.
        </span>
      </div>

      {/* 3. Wind Strength & Direction */}
      <div className="flex flex-col gap-2 p-2 rounded-xl bg-[var(--bg-subtle)]/50 border border-[var(--border-color)]">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[var(--text-main)]">
          <Wind className="w-3.5 h-3.5 text-cyan-400" />
          <span>Courtyard Wind & Breeze</span>
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between text-[10px] text-[var(--text-sub)]">
            <span>Wind Velocity</span>
            <span className="font-mono text-cyan-400">{physicsParams.windStrength.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0.0"
            max="1.5"
            step="0.05"
            value={physicsParams.windStrength}
            onChange={(e) => updateParam('windStrength', parseFloat(e.target.value))}
            className="w-full h-1 bg-black/40 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between text-[10px] text-[var(--text-sub)]">
            <span>Wind Angle</span>
            <span className="font-mono text-cyan-400">
              {Math.round((physicsParams.windDirection * 180) / Math.PI)}°
            </span>
          </div>
          <input
            type="range"
            min="0"
            max={Math.PI * 2}
            step="0.1"
            value={physicsParams.windDirection}
            onChange={(e) => updateParam('windDirection', parseFloat(e.target.value))}
            className="w-full h-1 bg-black/40 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>
      </div>

      {/* 4. Gravity Control */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-[11px]">
          <span className="font-medium text-[var(--text-main)]">Environment Gravity</span>
          <span className="font-mono text-[var(--color-primary)]">
            {physicsParams.gravity.toFixed(1)} m/s²
          </span>
        </div>
        <input
          type="range"
          min="3.0"
          max="18.0"
          step="0.5"
          value={physicsParams.gravity}
          onChange={(e) => updateParam('gravity', parseFloat(e.target.value))}
          className="w-full h-1.5 bg-[var(--bg-subtle)] rounded-lg appearance-none cursor-pointer accent-[var(--color-primary)]"
        />
        <div className="flex justify-between text-[9px] text-[var(--text-muted)] font-mono">
          <span>Low Gravity</span>
          <span>Earth (9.8)</span>
          <span>Heavy</span>
        </div>
      </div>

      {/* 5. Lighting Atmosphere Mood */}
      <div className="flex flex-col gap-1.5 pt-1">
        <label className="text-[11px] font-semibold text-[var(--text-sub)] uppercase tracking-wider">
          Lighting & Environment Mood
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {moods.map((m) => {
            const isActive = lightingMood === m.id;
            return (
              <button
                key={m.id}
                onClick={() => onSetLightingMood(m.id)}
                className={`
                  flex flex-col text-left p-2 rounded-xl border transition-all cursor-pointer
                  ${
                    isActive
                      ? 'bg-[var(--color-primary)]/15 border-[var(--color-primary)] text-[var(--text-main)] font-semibold'
                      : 'bg-[var(--bg-subtle)]/60 border-[var(--border-color)] text-[var(--text-sub)] hover:text-[var(--text-main)]'
                  }
                `}
              >
                <div className="flex items-center gap-1.5">
                  {m.icon}
                  <span className="text-[11px]">{m.label}</span>
                </div>
                <span className="text-[9px] opacity-75 mt-0.5 line-clamp-1">{m.desc}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
