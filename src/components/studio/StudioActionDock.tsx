import React from 'react';
import {
  Zap,
  Sword,
  RotateCcw,
  Camera,
  Maximize2,
  User,
  Sparkles,
  Footprints,
  Compass,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import type { PosePreset } from './animation/CharacterAnimator';
import type { CameraFocusMode } from './camera/StudioCameraController';

interface StudioActionDockProps {
  isRunning: boolean;
  onToggleRun: () => void;
  onJump: () => void;
  onAttack: () => void;
  onToggleSword: () => void;
  isSwordInHand: boolean;
  posePreset: PosePreset;
  onSetPose: (pose: PosePreset) => void;
  cameraFocus: CameraFocusMode;
  onSetCameraFocus: (focus: CameraFocusMode) => void;
  onResetCharacter: () => void;
  onResetCamera: () => void;
  onMoveDirection: (dx: number, dz: number) => void;
}

export const StudioActionDock: React.FC<StudioActionDockProps> = ({
  isRunning,
  onToggleRun,
  onJump,
  onAttack,
  onToggleSword,
  isSwordInHand,
  posePreset,
  onSetPose,
  cameraFocus,
  onSetCameraFocus,
  onResetCharacter,
  onResetCamera,
  onMoveDirection,
}) => {
  const poses: { id: PosePreset; label: string }[] = [
    { id: 'none', label: 'Dynamic Locomotion' },
    { id: 'confident', label: 'Confident Heroine' },
    { id: 'ready', label: 'Combat Ready' },
    { id: 'blossom', label: 'Blossom Pose' },
    { id: 'glamour', label: 'Glamour Turn' },
  ];

  const cameraModes: { id: CameraFocusMode; label: string; icon: React.ReactNode }[] = [
    { id: 'full', label: 'Full Figure', icon: <Maximize2 className="w-3.5 h-3.5" /> },
    { id: 'upper', label: 'Upper Body', icon: <User className="w-3.5 h-3.5" /> },
    { id: 'mid', label: 'Midsection', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: 'lower', label: 'Lower Legs', icon: <Footprints className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="flex flex-col gap-2 p-3 rounded-2xl bg-[var(--bg-surface)]/90 backdrop-blur-md border border-[var(--border-color)] shadow-xl text-xs">
      {/* Top Row: Camera Focus Presets & Reset */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[var(--border-color)]/70">
        <div className="flex items-center gap-1">
          <span className="text-[11px] font-semibold text-[var(--text-sub)] mr-1 hidden sm:inline flex items-center gap-1">
            <Camera className="w-3 h-3 text-[var(--color-primary)]" />
            <span>Camera Focus:</span>
          </span>
          {cameraModes.map((cam) => {
            const isActive = cameraFocus === cam.id;
            return (
              <button
                key={cam.id}
                onClick={() => onSetCameraFocus(cam.id)}
                className={`
                  flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-medium transition-all cursor-pointer
                  ${
                    isActive
                      ? 'bg-[var(--color-primary)] text-[var(--bg-main)] shadow-sm font-semibold'
                      : 'bg-[var(--bg-subtle)] text-[var(--text-sub)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface)] border border-[var(--border-color)]'
                  }
                `}
              >
                {cam.icon}
                <span>{cam.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onResetCamera}
            className="btn-3d flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[var(--bg-subtle)] hover:bg-[var(--bg-surface)] border border-[var(--border-color)] text-[11px] text-[var(--text-sub)] hover:text-[var(--text-main)] cursor-pointer"
            title="Reset Camera View to Default"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Camera</span>
          </button>
          <button
            onClick={onResetCharacter}
            className="btn-3d flex items-center gap-1 px-2.5 py-1 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-[11px] text-rose-300 font-medium cursor-pointer"
            title="Reset Character Position & Pose"
          >
            <RotateCcw className="w-3 h-3 text-rose-400" />
            <span>Reset Character</span>
          </button>
        </div>
      </div>

      {/* Main Controls Row: Actions & Locomotion */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Jump Button */}
          <button
            onClick={onJump}
            className="btn-3d flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold shadow-md shadow-sky-500/20 active:scale-95 transition-transform cursor-pointer"
          >
            <Zap className="w-4 h-4" />
            <span>JUMP</span>
            <span className="text-[10px] opacity-75 font-mono ml-0.5">[Space]</span>
          </button>

          {/* Attack Slash */}
          <button
            onClick={onAttack}
            className="btn-3d flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold shadow-md shadow-rose-500/20 active:scale-95 transition-transform cursor-pointer"
          >
            <Sword className="w-4 h-4" />
            <span>ATTACK</span>
            <span className="text-[10px] opacity-75 font-mono ml-0.5">[F]</span>
          </button>

          {/* Draw / Sheathe Sword */}
          <button
            onClick={onToggleSword}
            className={`
              btn-3d flex items-center gap-1.5 px-3 py-2 rounded-xl border text-[11px] font-semibold transition-all cursor-pointer
              ${
                isSwordInHand
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                  : 'bg-[var(--bg-subtle)] border-[var(--border-color)] text-[var(--text-main)]'
              }
            `}
          >
            <Sword className="w-3.5 h-3.5" />
            <span>{isSwordInHand ? 'Sheathe Sword' : 'Draw Sword'}</span>
            <span className="text-[10px] text-[var(--text-sub)] font-mono">[R]</span>
          </button>

          {/* Walk / Run Toggle */}
          <button
            onClick={onToggleRun}
            className={`
              btn-3d flex items-center gap-1.5 px-3 py-2 rounded-xl border text-[11px] font-semibold transition-all cursor-pointer
              ${
                isRunning
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                  : 'bg-[var(--bg-subtle)] border-[var(--border-color)] text-[var(--text-main)]'
              }
            `}
          >
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isRunning ? 'Mode: Running' : 'Mode: Walking'}</span>
            <span className="text-[10px] text-[var(--text-sub)] font-mono">[Shift]</span>
          </button>
        </div>

        {/* Pose Preset Dropdown / Buttons */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-semibold text-[var(--text-sub)] hidden md:inline">
            Pose:
          </span>
          <select
            value={posePreset}
            onChange={(e) => onSetPose(e.target.value as PosePreset)}
            className="px-3 py-2 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] text-[var(--text-main)] text-xs font-semibold focus:outline-none focus:border-[var(--color-primary)] cursor-pointer"
          >
            {poses.map((p) => (
              <option key={p.id} value={p.id} className="bg-[#141b26] text-white">
                {p.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Touch D-Pad for Mobile Screen Controls */}
      <div className="md:hidden flex items-center justify-between pt-2 border-t border-[var(--border-color)]/60">
        <span className="text-[11px] text-[var(--text-sub)] flex items-center gap-1">
          <Compass className="w-3.5 h-3.5 text-[var(--color-primary)]" />
          <span>Touch Locomotion:</span>
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onMoveDirection(-1, 0)}
            className="p-2 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-color)] text-[var(--text-main)] active:bg-[var(--color-primary)]"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex flex-col gap-1">
            <button
              onClick={() => onMoveDirection(0, -1)}
              className="p-2 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-color)] text-[var(--text-main)] active:bg-[var(--color-primary)]"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
            <button
              onClick={() => onMoveDirection(0, 1)}
              className="p-2 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-color)] text-[var(--text-main)] active:bg-[var(--color-primary)]"
            >
              <ArrowDown className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={() => onMoveDirection(1, 0)}
            className="p-2 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-color)] text-[var(--text-main)] active:bg-[var(--color-primary)]"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
