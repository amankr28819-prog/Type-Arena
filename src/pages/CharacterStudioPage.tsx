import React, { useState, useRef } from 'react';
import {
  Sparkles,
  Shirt,
  Activity,
  Maximize,
  Minimize,
  ShieldAlert,
  Keyboard
} from 'lucide-react';
import {
  Studio3DCanvas,
  type StudioCanvasHandles,
} from '../components/studio/Studio3DCanvas';
import { CostumePanel } from '../components/studio/CostumePanel';
import { PhysicsDemoPanel } from '../components/studio/PhysicsDemoPanel';
import { StudioActionDock } from '../components/studio/StudioActionDock';
import type {
  AppearanceMode,
  FacialExpression,
  CostumeLayers,
} from '../components/studio/character/AnimeHeroine3D';
import {
  type PhysicsParams,
  DEFAULT_PHYSICS_PARAMS,
} from '../components/studio/physics/SecondaryDynamics';
import type { LightingMood } from '../components/studio/environment/ZenCourtyard3D';
import type { PosePreset } from '../components/studio/animation/CharacterAnimator';
import type { CameraFocusMode } from '../components/studio/camera/StudioCameraController';

export const CharacterStudioPage: React.FC = () => {
  const canvasRef = useRef<StudioCanvasHandles>(null);

  // Age Gate Confirmation
  const [isAgeVerified, setIsAgeVerified] = useState<boolean>(() => {
    return localStorage.getItem('typearena_studio_age_verified') === 'true';
  });

  // Active Side Panel Tab: 'costume' | 'physics' | 'none'
  const [activeSidePanel, setActiveSidePanel] = useState<'costume' | 'physics' | 'none'>('costume');
  const [isCinematicMode, setIsCinematicMode] = useState<boolean>(false);

  // Character & Appearance State
  const [appearanceMode, setAppearanceMode] = useState<AppearanceMode>('full');
  const [costumeLayers, setCostumeLayers] = useState<CostumeLayers>({
    haori: true,
    jacket: true,
    skirt: true,
    stockings: true,
    belt: true,
    sword: true,
    swordInHand: false,
  });
  const [expression, setExpression] = useState<FacialExpression>('smile');
  const [skinSheen, setSkinSheen] = useState<number>(0.28);

  // Physics State
  const [physicsParams, setPhysicsParams] = useState<PhysicsParams>({
    ...DEFAULT_PHYSICS_PARAMS,
  });

  // Environment & Animation State
  const [lightingMood, setLightingMood] = useState<LightingMood>('twilight');
  const [posePreset, setPosePreset] = useState<PosePreset>('none');
  const [cameraFocus, setCameraFocus] = useState<CameraFocusMode>('full');
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const handleConfirmAge = () => {
    localStorage.setItem('typearena_studio_age_verified', 'true');
    setIsAgeVerified(true);
  };

  const handleToggleLayer = (layer: keyof CostumeLayers) => {
    setCostumeLayers((prev) => ({
      ...prev,
      [layer]: !prev[layer],
    }));
  };

  const handleSetAppearanceMode = (mode: AppearanceMode) => {
    setAppearanceMode(mode);
    if (mode === 'full') {
      setCostumeLayers({
        haori: true,
        jacket: true,
        skirt: true,
        stockings: true,
        belt: true,
        sword: true,
        swordInHand: false,
      });
    } else if (mode === 'revealing') {
      setCostumeLayers({
        haori: false,
        jacket: true,
        skirt: true,
        stockings: true,
        belt: true,
        sword: true,
        swordInHand: false,
      });
    } else if (mode === 'unclothed') {
      setCostumeLayers({
        haori: false,
        jacket: false,
        skirt: false,
        stockings: false,
        belt: false,
        sword: false,
        swordInHand: false,
      });
    }
  };

  return (
    <div className="relative w-full min-h-[calc(100vh-4rem)] flex flex-col bg-[var(--bg-main)] text-[var(--text-main)] overflow-hidden">
      {/* 1. AGE GATE VERIFICATION MODAL */}
      {!isAgeVerified && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="max-w-md w-full p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-2xl flex flex-col items-center text-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <ShieldAlert className="w-7 h-7" />
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-xl font-black text-[var(--text-main)]">
                Artistic Character Studio
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-rose-400 font-mono">
                18+ Adult Artistic Presentation
              </span>
              <p className="text-xs text-[var(--text-sub)] mt-1 leading-relaxed">
                This experimental 3D studio features an adult female fantasy character with
                full-body artistic presentation, dynamic soft-body physics, and costume layer
                customization (including full combat uniform, revealing variant, and artistic
                unclothed study).
              </p>
            </div>

            <div className="w-full flex flex-col gap-2 mt-2">
              <button
                onClick={handleConfirmAge}
                className="btn-3d w-full py-3 rounded-2xl bg-[var(--color-primary)] text-[var(--bg-main)] font-bold text-sm shadow-lg shadow-[var(--color-primary)]/20 active:scale-98 transition-transform cursor-pointer"
              >
                Confirm & Enter 3D Studio
              </button>
              <span className="text-[10px] text-[var(--text-muted)]">
                Your consent preference will be saved locally.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 2. TOP BANNER / STUDIO HEADER */}
      <div className="w-full border-b border-[var(--border-color)] bg-[var(--bg-surface)]/70 backdrop-blur-md px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4 z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-400 flex items-center justify-center text-white shadow-md shadow-pink-500/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm sm:text-base tracking-tight font-mono text-[var(--text-main)]">
                CHARACTER STUDIO
              </span>
              <span className="text-[10px] font-sans px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/25 font-semibold">
                Adult 3D Lab
              </span>
            </div>
            <span className="text-[10px] text-[var(--text-sub)] hidden sm:inline">
              Full-body artistic presentation • Costume layer removal • Dynamic body physics
            </span>
          </div>
        </div>

        {/* Panel Switchers & Cinematic Mode */}
        <div className="flex items-center gap-2">
          {/* Quick Hotkeys Legend */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] text-[11px] text-[var(--text-sub)] font-mono">
            <Keyboard className="w-3.5 h-3.5 text-[var(--color-primary)]" />
            <span>[W/A/S/D] Move</span>
            <span>•</span>
            <span>[Space] Jump</span>
            <span>•</span>
            <span>[F] Slash</span>
            <span>•</span>
            <span>[R] Sheathe</span>
          </div>

          {/* Wardrobe Tab Button */}
          <button
            onClick={() => setActiveSidePanel((prev) => (prev === 'costume' ? 'none' : 'costume'))}
            className={`
              btn-3d flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer
              ${
                activeSidePanel === 'costume'
                  ? 'bg-[var(--color-primary)] text-[var(--bg-main)] shadow-sm'
                  : 'bg-[var(--bg-subtle)] text-[var(--text-main)] border-[var(--border-color)]'
              }
            `}
          >
            <Shirt className="w-3.5 h-3.5" />
            <span>Wardrobe</span>
          </button>

          {/* Physics Demo Tab Button */}
          <button
            onClick={() => setActiveSidePanel((prev) => (prev === 'physics' ? 'none' : 'physics'))}
            className={`
              btn-3d flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer
              ${
                activeSidePanel === 'physics'
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'bg-[var(--bg-subtle)] text-[var(--text-main)] border-[var(--border-color)]'
              }
            `}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Physics Demo</span>
          </button>

          {/* Cinematic Fullscreen Toggle */}
          <button
            onClick={() => setIsCinematicMode((prev) => !prev)}
            className="btn-3d p-1.5 rounded-xl bg-[var(--bg-subtle)] hover:bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-sub)] hover:text-[var(--text-main)] cursor-pointer"
            title={isCinematicMode ? 'Show Controls' : 'Cinematic View'}
          >
            {isCinematicMode ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* 3. MAIN WORKSPACE AREA: 3D CANVAS + FLOATING PANELS */}
      <div className="relative flex-1 w-full h-[calc(100vh-8.5rem)] flex overflow-hidden">
        {/* Real-time Three.js WebGL Canvas */}
        <div className="absolute inset-0 z-0">
          <Studio3DCanvas
            ref={canvasRef}
            appearanceMode={appearanceMode}
            costumeLayers={costumeLayers}
            expression={expression}
            skinSheen={skinSheen}
            physicsParams={physicsParams}
            lightingMood={lightingMood}
            posePreset={posePreset}
            cameraFocus={cameraFocus}
            isRunning={isRunning}
          />
        </div>

        {/* Floating Side Drawer (Wardrobe / Physics Demo) */}
        {!isCinematicMode && activeSidePanel !== 'none' && (
          <div className="absolute top-4 right-4 z-20 w-80 max-h-[calc(100%-6.5rem)] overflow-y-auto p-4 rounded-3xl bg-[var(--bg-surface)]/92 backdrop-blur-xl border border-[var(--border-color)] shadow-2xl animate-in slide-in-from-right-4 duration-200">
            {activeSidePanel === 'costume' && (
              <CostumePanel
                appearanceMode={appearanceMode}
                onSetAppearanceMode={handleSetAppearanceMode}
                costumeLayers={costumeLayers}
                onToggleLayer={handleToggleLayer}
                expression={expression}
                onSetExpression={setExpression}
                skinSheen={skinSheen}
                onSetSkinSheen={setSkinSheen}
              />
            )}

            {activeSidePanel === 'physics' && (
              <PhysicsDemoPanel
                physicsParams={physicsParams}
                onChangePhysics={setPhysicsParams}
                lightingMood={lightingMood}
                onSetLightingMood={setLightingMood}
                onResetPhysics={() => setPhysicsParams({ ...DEFAULT_PHYSICS_PARAMS })}
              />
            )}
          </div>
        )}

        {/* Floating Bottom Action Dock */}
        {!isCinematicMode && (
          <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-6 max-w-4xl mx-auto z-20">
            <StudioActionDock
              isRunning={isRunning}
              onToggleRun={() => setIsRunning((prev) => !prev)}
              onJump={() => canvasRef.current?.triggerJump()}
              onAttack={() => canvasRef.current?.triggerAttack()}
              onToggleSword={() => {
                canvasRef.current?.toggleDrawSheathe();
                setCostumeLayers((prev) => ({
                  ...prev,
                  swordInHand: !prev.swordInHand,
                }));
              }}
              isSwordInHand={costumeLayers.swordInHand}
              posePreset={posePreset}
              onSetPose={setPosePreset}
              cameraFocus={cameraFocus}
              onSetCameraFocus={setCameraFocus}
              onResetCharacter={() => canvasRef.current?.resetCharacter()}
              onResetCamera={() => canvasRef.current?.resetCamera()}
              onMoveDirection={(dx, dz) => canvasRef.current?.moveDirection(dx, dz)}
            />
          </div>
        )}
      </div>
    </div>
  );
};
