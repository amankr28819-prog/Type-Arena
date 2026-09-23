import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { AnimeHeroine3D, type AppearanceMode, type FacialExpression, type CostumeLayers } from './character/AnimeHeroine3D';
import { ZenCourtyard3D, type LightingMood } from './environment/ZenCourtyard3D';
import { CharacterAnimator, type PosePreset } from './animation/CharacterAnimator';
import { SecondaryDynamicsEngine, type PhysicsParams } from './physics/SecondaryDynamics';
import { StudioCameraController, type CameraFocusMode } from './camera/StudioCameraController';

export interface StudioCanvasProps {
  appearanceMode: AppearanceMode;
  costumeLayers: CostumeLayers;
  expression: FacialExpression;
  skinSheen: number;
  physicsParams: PhysicsParams;
  lightingMood: LightingMood;
  posePreset: PosePreset;
  cameraFocus: CameraFocusMode;
  isRunning: boolean;
  onJumpTriggered?: () => void;
  onAttackTriggered?: () => void;
  onResetCharacter?: () => void;
  onResetCamera?: () => void;
}

export interface StudioCanvasHandles {
  triggerJump: () => void;
  triggerAttack: () => void;
  toggleDrawSheathe: () => void;
  resetCharacter: () => void;
  resetCamera: () => void;
  moveDirection: (dx: number, dz: number) => void;
}

export const Studio3DCanvas = React.forwardRef<StudioCanvasHandles, StudioCanvasProps>(
  (
    {
      appearanceMode,
      costumeLayers,
      expression,
      skinSheen,
      physicsParams,
      lightingMood,
      posePreset,
      cameraFocus,
      isRunning,
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);

    // Three.js instances ref
    const engineRef = useRef<{
      scene: THREE.Scene;
      camera: THREE.PerspectiveCamera;
      renderer: THREE.WebGLRenderer;
      cameraCtrl: StudioCameraController;
      dynamics: SecondaryDynamicsEngine;
      character: AnimeHeroine3D;
      animator: CharacterAnimator;
      courtyard: ZenCourtyard3D;
      raycaster: THREE.Raycaster;
      mousePos: THREE.Vector2;
      keysPressed: Record<string, boolean>;
      animFrameId: number;
      charPosition: THREE.Vector3;
      charRotationY: number;
      targetMovePos: THREE.Vector3 | null;
      isDraggingMouse: boolean;
      lastMouseX: number;
      lastMouseY: number;
    } | null>(null);

    const [fps, setFps] = useState<number>(60);

    // Initialize 3D Engine
    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const width = container.clientWidth || window.innerWidth;
      const height = container.clientHeight || window.innerHeight;

      // 1. Scene & Camera
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x0c1017);
      scene.fog = new THREE.FogExp2(0x0c1017, 0.045);

      const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 50);
      const cameraCtrl = new StudioCameraController(camera);

      // 2. WebGL Renderer
      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: 'high-performance',
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFShadowMap;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.1;
      container.appendChild(renderer.domElement);

      // 3. Environment & Physics & Character
      const courtyard = new ZenCourtyard3D();
      scene.add(courtyard.root);

      const dynamics = new SecondaryDynamicsEngine(physicsParams);
      const character = new AnimeHeroine3D(dynamics);
      scene.add(character.root);

      const animator = new CharacterAnimator(character);

      const raycaster = new THREE.Raycaster();
      const mousePos = new THREE.Vector2();

      const engine = {
        scene,
        camera,
        renderer,
        cameraCtrl,
        dynamics,
        character,
        animator,
        courtyard,
        raycaster,
        mousePos,
        keysPressed: {} as Record<string, boolean>,
        animFrameId: 0,
        charPosition: new THREE.Vector3(0, 0, 0),
        charRotationY: 0,
        targetMovePos: null as THREE.Vector3 | null,
        isDraggingMouse: false,
        lastMouseX: 0,
        lastMouseY: 0,
      };

      engineRef.current = engine;

      // 4. Resize Observer
      const handleResize = () => {
        if (!container || !engineRef.current) return;
        const w = container.clientWidth;
        const h = container.clientHeight;
        engine.camera.aspect = w / h;
        engine.camera.updateProjectionMatrix();
        engine.renderer.setSize(w, h);
      };
      window.addEventListener('resize', handleResize);

      // 5. User Interaction: Keyboard Listeners
      const handleKeyDown = (e: KeyboardEvent) => {
        // Ignore if user is typing in an input
        if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

        engine.keysPressed[e.code] = true;

        if (e.code === 'Space') {
          e.preventDefault();
          engine.animator.triggerJump();
        } else if (e.code === 'KeyF') {
          e.preventDefault();
          engine.animator.triggerAttack();
        } else if (e.code === 'KeyR') {
          e.preventDefault();
          engine.animator.toggleDrawSheathe();
        }
      };

      const handleKeyUp = (e: KeyboardEvent) => {
        engine.keysPressed[e.code] = false;
      };

      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);

      // 6. User Interaction: Mouse Drag Camera Orbit & Click-To-Move
      const handleMouseDown = (e: MouseEvent) => {
        // If left click
        if (e.button === 0) {
          engine.isDraggingMouse = true;
          engine.lastMouseX = e.clientX;
          engine.lastMouseY = e.clientY;
        }
      };

      const handleMouseMove = (e: MouseEvent) => {
        if (engine.isDraggingMouse) {
          const deltaX = e.clientX - engine.lastMouseX;
          const deltaY = e.clientY - engine.lastMouseY;
          engine.cameraCtrl.onRotate(deltaX, deltaY);
          engine.lastMouseX = e.clientX;
          engine.lastMouseY = e.clientY;
        }
      };

      const handleMouseUp = (e: MouseEvent) => {
        // If it was a quick click without dragging, treat as click-to-move on floor
        if (engine.isDraggingMouse) {
          const dragDist = Math.hypot(e.clientX - engine.lastMouseX, e.clientY - engine.lastMouseY);
          if (dragDist < 4) {
            // Raycast on arena floor
            const rect = renderer.domElement.getBoundingClientRect();
            mousePos.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            mousePos.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
            raycaster.setFromCamera(mousePos, camera);
            const intersects = raycaster.intersectObject(courtyard.floorMesh);
            if (intersects.length > 0) {
              const hit = intersects[0].point;
              // Clamp inside arena radius
              const hitDist = Math.hypot(hit.x, hit.z);
              if (hitDist < 7.8) {
                engine.targetMovePos = new THREE.Vector3(hit.x, 0, hit.z);
              }
            }
          }
        }
        engine.isDraggingMouse = false;
      };

      const handleWheel = (e: WheelEvent) => {
        e.preventDefault();
        engine.cameraCtrl.onZoom(e.deltaY);
      };

      // Touch handlers for mobile
      let touchStartX = 0;
      let touchStartY = 0;
      let initialPinchDist = 0;

      const handleTouchStart = (e: TouchEvent) => {
        if (e.touches.length === 1) {
          touchStartX = e.touches[0].clientX;
          touchStartY = e.touches[0].clientY;
        } else if (e.touches.length === 2) {
          initialPinchDist = Math.hypot(
            e.touches[0].clientX - e.touches[1].clientX,
            e.touches[0].clientY - e.touches[1].clientY
          );
        }
      };

      const handleTouchMove = (e: TouchEvent) => {
        if (e.touches.length === 1) {
          const deltaX = e.touches[0].clientX - touchStartX;
          const deltaY = e.touches[0].clientY - touchStartY;
          engine.cameraCtrl.onRotate(deltaX, deltaY);
          touchStartX = e.touches[0].clientX;
          touchStartY = e.touches[0].clientY;
        } else if (e.touches.length === 2) {
          const currentDist = Math.hypot(
            e.touches[0].clientX - e.touches[1].clientX,
            e.touches[0].clientY - e.touches[1].clientY
          );
          const diff = initialPinchDist - currentDist;
          engine.cameraCtrl.onZoom(diff * 1.5);
          initialPinchDist = currentDist;
        }
      };

      const dom = renderer.domElement;
      dom.addEventListener('mousedown', handleMouseDown);
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      dom.addEventListener('wheel', handleWheel, { passive: false });
      dom.addEventListener('touchstart', handleTouchStart, { passive: true });
      dom.addEventListener('touchmove', handleTouchMove, { passive: true });

      // 7. Main Real-time Animation Loop (60+ FPS)
      let lastTime = performance.now();
      let frameCount = 0;
      let lastFpsTime = performance.now();

      const animate = (currentTime: number) => {
        engine.animFrameId = requestAnimationFrame(animate);

        const dt = Math.min((currentTime - lastTime) / 1000, 0.05);
        lastTime = currentTime;

        // FPS meter
        frameCount++;
        if (currentTime - lastFpsTime >= 1000) {
          setFps(frameCount);
          frameCount = 0;
          lastFpsTime = currentTime;
        }

        // Handle Character Locomotion
        let moveX = 0;
        let moveZ = 0;

        if (engine.keysPressed['KeyW'] || engine.keysPressed['ArrowUp']) moveZ -= 1;
        if (engine.keysPressed['KeyS'] || engine.keysPressed['ArrowDown']) moveZ += 1;
        if (engine.keysPressed['KeyA'] || engine.keysPressed['ArrowLeft']) moveX -= 1;
        if (engine.keysPressed['KeyD'] || engine.keysPressed['ArrowRight']) moveX += 1;

        // Turning with Q / E
        if (engine.keysPressed['KeyQ']) engine.charRotationY += dt * 2.8;
        if (engine.keysPressed['KeyE']) engine.charRotationY -= dt * 2.8;

        let isMoving = false;

        // If keyboard movement is active, cancel click-to-move
        if (moveX !== 0 || moveZ !== 0) {
          engine.targetMovePos = null;
          isMoving = true;

          // Camera-relative movement
          const camAngle = engine.cameraCtrl.theta;
          const inputAngle = Math.atan2(moveX, moveZ);
          const worldAngle = camAngle + inputAngle;

          const moveSpeed = (engine.keysPressed['ShiftLeft'] || isRunning) ? 4.2 : 2.2;
          const dx = Math.sin(worldAngle) * moveSpeed * dt;
          const dz = Math.cos(worldAngle) * moveSpeed * dt;

          engine.charPosition.x += dx;
          engine.charPosition.z += dz;

          // Smoothly rotate character toward movement heading
          engine.charRotationY = worldAngle;
        } else if (engine.targetMovePos) {
          // Click-To-Move path interpolation
          const diffX = engine.targetMovePos.x - engine.charPosition.x;
          const diffZ = engine.targetMovePos.z - engine.charPosition.z;
          const dist = Math.hypot(diffX, diffZ);

          if (dist > 0.12) {
            isMoving = true;
            const targetAngle = Math.atan2(diffX, diffZ);
            engine.charRotationY = targetAngle;

            const moveSpeed = isRunning ? 4.2 : 2.2;
            const step = Math.min(dist, moveSpeed * dt);
            engine.charPosition.x += Math.sin(targetAngle) * step;
            engine.charPosition.z += Math.cos(targetAngle) * step;
          } else {
            engine.targetMovePos = null;
          }
        }

        // Clamp character inside arena radius
        const charDist = Math.hypot(engine.charPosition.x, engine.charPosition.z);
        if (charDist > 7.5) {
          const factor = 7.5 / charDist;
          engine.charPosition.x *= factor;
          engine.charPosition.z *= factor;
        }

        // Update character root transform
        character.root.position.x = engine.charPosition.x;
        character.root.position.z = engine.charPosition.z;
        character.root.rotation.y = engine.charRotationY;

        // Update Animator (walk, run, idle, jump, attack)
        const runActive = engine.keysPressed['ShiftLeft'] || isRunning;
        const animResult = animator.update(dt, isMoving, runActive);

        // Update Secondary Dynamics (soft-body bust dynamics & hair braid chains)
        dynamics.update(
          dt,
          character.root.position,
          engine.charRotationY,
          animResult.footstep,
          animResult.jumpVel
        );

        // Apply physics to character meshes
        character.updatePhysics(dt);

        // Update Environment (sakura petals & lanterns)
        courtyard.update(dt, dynamics.currentWindVector);

        // Update Camera
        cameraCtrl.update(character.root.position);

        // Render Frame
        renderer.render(scene, camera);
      };

      engine.animFrameId = requestAnimationFrame(animate);

      // Clean cleanup on component unmount
      return () => {
        cancelAnimationFrame(engine.animFrameId);
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
        dom.removeEventListener('mousedown', handleMouseDown);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
        dom.removeEventListener('wheel', handleWheel);
        dom.removeEventListener('touchstart', handleTouchStart);
        dom.removeEventListener('touchmove', handleTouchMove);

        renderer.dispose();
        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
        engineRef.current = null;
      };
    }, []);

    // Sync Props to Engine when changed
    useEffect(() => {
      const e = engineRef.current;
      if (!e) return;
      e.character.setAppearanceMode(appearanceMode);
    }, [appearanceMode]);

    useEffect(() => {
      const e = engineRef.current;
      if (!e) return;
      e.character.layers = { ...costumeLayers };
      e.character.applyLayerVisibility();
    }, [costumeLayers]);

    useEffect(() => {
      const e = engineRef.current;
      if (!e) return;
      e.character.setExpression(expression);
    }, [expression]);

    useEffect(() => {
      const e = engineRef.current;
      if (!e) return;
      e.character.setSkinSheen(skinSheen);
    }, [skinSheen]);

    useEffect(() => {
      const e = engineRef.current;
      if (!e) return;
      e.dynamics.params = { ...physicsParams };
    }, [physicsParams]);

    useEffect(() => {
      const e = engineRef.current;
      if (!e) return;
      e.courtyard.setLightingMood(lightingMood);
    }, [lightingMood]);

    useEffect(() => {
      const e = engineRef.current;
      if (!e) return;
      e.animator.setPose(posePreset);
    }, [posePreset]);

    useEffect(() => {
      const e = engineRef.current;
      if (!e) return;
      e.cameraCtrl.setFocusMode(cameraFocus);
    }, [cameraFocus]);

    // Imperative Handles for parent UI
    React.useImperativeHandle(ref, () => ({
      triggerJump: () => {
        engineRef.current?.animator.triggerJump();
      },
      triggerAttack: () => {
        engineRef.current?.animator.triggerAttack();
      },
      toggleDrawSheathe: () => {
        engineRef.current?.animator.toggleDrawSheathe();
      },
      resetCharacter: () => {
        if (!engineRef.current) return;
        engineRef.current.charPosition.set(0, 0, 0);
        engineRef.current.charRotationY = 0;
        engineRef.current.targetMovePos = null;
        engineRef.current.character.root.position.set(0, 0, 0);
        engineRef.current.character.root.rotation.y = 0;
        engineRef.current.dynamics.reset();
        engineRef.current.animator.setPose('none');
      },
      resetCamera: () => {
        engineRef.current?.cameraCtrl.resetCamera();
      },
      moveDirection: (dx: number, dz: number) => {
        if (!engineRef.current) return;
        const e = engineRef.current;
        const speed = isRunning ? 0.35 : 0.2;
        e.charPosition.x += dx * speed;
        e.charPosition.z += dz * speed;
        e.charRotationY = Math.atan2(dx, dz);
      },
    }));

    return (
      <div className="relative w-full h-full min-h-[580px] select-none overflow-hidden rounded-2xl bg-[#0c1017]">
        <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {/* Viewport Overlay: FPS and Click-to-Move Hint */}
        <div className="absolute top-4 left-4 flex items-center gap-2 pointer-events-none z-10">
          <div className="px-2.5 py-1 rounded-xl bg-black/60 backdrop-blur-md border border-[var(--border-color)]/60 text-[11px] font-mono text-[var(--color-primary)] flex items-center gap-1.5 shadow-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{fps} FPS</span>
            <span className="text-[var(--text-sub)]">| WebGL 3D</span>
          </div>

          <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-xl bg-black/50 backdrop-blur-md border border-[var(--border-color)]/50 text-[10px] text-[var(--text-sub)]">
            <span>Drag to Orbit • Scroll to Zoom • Click Arena Floor to Walk</span>
          </div>
        </div>
      </div>
    );
  }
);
