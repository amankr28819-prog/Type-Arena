import * as THREE from 'three';
import { AnimeHeroine3D } from '../character/AnimeHeroine3D';

export type AnimationState = 'idle' | 'walk' | 'run' | 'jump' | 'attack';
export type PosePreset = 'none' | 'confident' | 'ready' | 'blossom' | 'glamour';

export class CharacterAnimator {
  public character: AnimeHeroine3D;
  public currentState: AnimationState = 'idle';
  public currentPose: PosePreset = 'none';

  // Animation clocks
  public animTime: number = 0;
  public isJumping: boolean = false;
  public jumpTime: number = 0;
  public jumpDuration: number = 0.85;
  public jumpHeight: number = 0.75;
  public jumpStartY: number = 0;

  // Attack state
  public isAttacking: boolean = false;
  public attackTime: number = 0;
  public attackDuration: number = 0.72;

  // Eye Blinking Animation
  private blinkTimer: number = 0;
  private blinkInterval: number = 3.5;

  // Movement speed tracking
  public speed: number = 0;

  constructor(character: AnimeHeroine3D) {
    this.character = character;
  }

  public setPose(pose: PosePreset) {
    this.currentPose = pose;
    if (pose !== 'none') {
      this.currentState = 'idle';
    }
  }

  public triggerJump(): boolean {
    if (this.isJumping) return false;
    this.isJumping = true;
    this.jumpTime = 0;
    this.jumpStartY = this.character.root.position.y;
    return true;
  }

  public triggerAttack(): boolean {
    if (this.isAttacking) return false;
    this.isAttacking = true;
    this.attackTime = 0;
    this.character.setSwordInHand(true);
    return true;
  }

  public toggleDrawSheathe() {
    const nextState = !this.character.layers.swordInHand;
    this.character.setSwordInHand(nextState);
  }

  public update(dt: number, isMoving: boolean, isRunning: boolean): { footstep: number; jumpVel: number } {
    this.animTime += dt;
    let footstepImpulse = 0;
    let jumpVerticalVel = 0;

    // Procedural Eye Blinking Cycle (Every 3-5 seconds, smooth 0.16s blink)
    this.blinkTimer += dt;
    if (this.blinkTimer >= this.blinkInterval) {
      const blinkProgress = (this.blinkTimer - this.blinkInterval) / 0.16;
      if (blinkProgress <= 1.0) {
        const blinkFactor = Math.sin(blinkProgress * Math.PI);
        this.character.setBlink(blinkFactor);
      } else {
        this.character.setBlink(0);
        this.blinkTimer = 0;
        this.blinkInterval = 2.8 + Math.random() * 2.4;
      }
    }

    // 1. ATTACK OVERRIDE
    if (this.isAttacking) {
      this.attackTime += dt;
      const progress = this.attackTime / this.attackDuration;

      if (progress < 0.25) {
        // Windup: Pull right arm back, twist torso
        const t = progress / 0.25;
        this.character.spineNode.rotation.y = -t * 0.45;
        this.character.rightUpperArmNode.rotation.set(-0.6 * t, 0.4 * t, 1.2 * t);
        this.character.rightForearmNode.rotation.set(0, 0, -1.0 * t);
      } else if (progress < 0.6) {
        // Explosive forward slash
        const t = (progress - 0.25) / 0.35;
        this.character.spineNode.rotation.y = -0.45 + t * 0.95;
        this.character.rightUpperArmNode.rotation.set(0.8 * t, -0.6 * t, -0.4 * t);
        this.character.rightForearmNode.rotation.set(0, 0, 0.2 * t);
      } else if (progress < 1.0) {
        // Recovery return to stance
        const t = (progress - 0.6) / 0.4;
        this.character.spineNode.rotation.y = THREE.MathUtils.lerp(0.5, 0, t);
        this.character.rightUpperArmNode.rotation.set(
          THREE.MathUtils.lerp(0.8, 0, t),
          THREE.MathUtils.lerp(-0.6, 0, t),
          THREE.MathUtils.lerp(-0.4, 0, t)
        );
      } else {
        this.isAttacking = false;
      }
      return { footstep: 0, jumpVel: 0 };
    }

    // 2. JUMP CYCLE
    if (this.isJumping) {
      this.jumpTime += dt;
      const normTime = this.jumpTime / this.jumpDuration;

      if (normTime < 0.15) {
        // Anticipation crouch
        const c = Math.sin((normTime / 0.15) * Math.PI);
        this.character.root.position.y = this.jumpStartY - c * 0.08;
        this.character.leftThighNode.rotation.x = -c * 0.35;
        this.character.leftShinNode.rotation.x = c * 0.45;
        this.character.rightThighNode.rotation.x = -c * 0.35;
        this.character.rightShinNode.rotation.x = c * 0.45;
        jumpVerticalVel = -0.5;
      } else if (normTime < 0.85) {
        // Parabolic Leap Arc
        const airProgress = (normTime - 0.15) / 0.7; // 0 to 1
        const yOffset = Math.sin(airProgress * Math.PI) * this.jumpHeight;
        this.character.root.position.y = this.jumpStartY + yOffset;

        // Derivative of parabolic arc = vertical velocity
        jumpVerticalVel = Math.cos(airProgress * Math.PI) * this.jumpHeight * 3.5;

        // Aerial pose
        this.character.leftThighNode.rotation.x = -0.25;
        this.character.leftShinNode.rotation.x = 0.55;
        this.character.rightThighNode.rotation.x = 0.2;
        this.character.rightShinNode.rotation.x = 0.4;
        this.character.leftUpperArmNode.rotation.z = -0.6;
        this.character.rightUpperArmNode.rotation.z = 0.6;
      } else if (normTime < 1.0) {
        // Landing compression / squash
        const landT = (normTime - 0.85) / 0.15;
        const squash = Math.sin(landT * Math.PI);
        this.character.root.position.y = this.jumpStartY - squash * 0.06;
        this.character.leftThighNode.rotation.x = -squash * 0.28;
        this.character.rightThighNode.rotation.x = -squash * 0.28;
        footstepImpulse = 1.0; // Strong impact impulse for bust & hair jiggle
        jumpVerticalVel = -1.2;
      } else {
        this.isJumping = false;
        this.character.root.position.y = this.jumpStartY;
        this.resetLimbs();
      }
      return { footstep: footstepImpulse, jumpVel: jumpVerticalVel };
    }

    // 3. POSE PRESETS (When not moving and a pose is selected)
    if (this.currentPose !== 'none' && !isMoving) {
      this.applyPosePreset(this.currentPose);
      return { footstep: 0, jumpVel: 0 };
    }

    // 4. LOCOMOTION (Walk / Run / Idle)
    if (isMoving) {
      this.currentState = isRunning ? 'run' : 'walk';
      const strideFreq = isRunning ? 9.5 : 5.5;
      const strideAmp = isRunning ? 0.65 : 0.42;
      const armAmp = isRunning ? 0.7 : 0.38;
      const cycle = this.animTime * strideFreq;

      const leftLegAngle = Math.sin(cycle) * strideAmp;
      const rightLegAngle = -Math.sin(cycle) * strideAmp;

      // Leg strides
      this.character.leftThighNode.rotation.x = leftLegAngle;
      this.character.leftShinNode.rotation.x = leftLegAngle > 0 ? leftLegAngle * 0.6 : 0.1;

      this.character.rightThighNode.rotation.x = rightLegAngle;
      this.character.rightShinNode.rotation.x = rightLegAngle > 0 ? rightLegAngle * 0.6 : 0.1;

      // Arm swings (opposite to legs)
      this.character.leftUpperArmNode.rotation.x = -leftLegAngle * armAmp;
      this.character.rightUpperArmNode.rotation.x = leftLegAngle * armAmp;

      // Hip sway and natural torso bounce
      this.character.pelvisNode.rotation.y = Math.sin(cycle) * 0.08;
      this.character.pelvisNode.rotation.z = Math.cos(cycle) * 0.04;
      this.character.spineNode.rotation.x = isRunning ? 0.12 : 0.04; // Forward lean

      // Vertical step bounce
      const stepBounce = Math.abs(Math.sin(cycle)) * (isRunning ? 0.045 : 0.025);
      this.character.root.position.y = stepBounce;

      // Footstep strike impulse at cycle zeroes
      if (Math.abs(Math.sin(cycle)) < 0.12) {
        footstepImpulse = isRunning ? 0.75 : 0.35;
      }
    } else {
      // Natural Idle Animation (Breathing & Weight Shifting)
      this.currentState = 'idle';
      const breatheCycle = Math.sin(this.animTime * 2.2);
      const swayCycle = Math.sin(this.animTime * 0.9);

      // Chest expands gently
      this.character.chestNode.scale.set(
        1.0 + breatheCycle * 0.012,
        1.0 + breatheCycle * 0.015,
        1.0 + breatheCycle * 0.018
      );

      // Spine & head micro-sway
      this.character.spineNode.rotation.x = -breatheCycle * 0.02;
      this.character.spineNode.rotation.y = swayCycle * 0.035;
      this.character.headNode.rotation.y = -swayCycle * 0.04;
      this.character.headNode.rotation.z = swayCycle * 0.02;

      // Weight shifting between hips
      this.character.pelvisNode.rotation.z = swayCycle * 0.035;
      this.character.leftThighNode.rotation.z = swayCycle * 0.02;
      this.character.rightThighNode.rotation.z = -swayCycle * 0.02;

      // Relaxed arms
      this.character.leftUpperArmNode.rotation.set(0.05, 0, -0.08);
      this.character.rightUpperArmNode.rotation.set(0.05, 0, 0.08);
    }

    return { footstep: footstepImpulse, jumpVel: 0 };
  }

  private resetLimbs() {
    this.character.leftThighNode.rotation.set(0, 0, 0);
    this.character.leftShinNode.rotation.set(0, 0, 0);
    this.character.rightThighNode.rotation.set(0, 0, 0);
    this.character.rightShinNode.rotation.set(0, 0, 0);
    this.character.leftUpperArmNode.rotation.set(0, 0, 0);
    this.character.rightUpperArmNode.rotation.set(0, 0, 0);
    this.character.spineNode.rotation.set(0, 0, 0);
    this.character.pelvisNode.rotation.set(0, 0, 0);
  }

  private applyPosePreset(pose: PosePreset) {
    const breathe = Math.sin(this.animTime * 2.0) * 0.01;

    switch (pose) {
      case 'confident':
        // Hand on hip, head tilted, weight shifted
        this.character.pelvisNode.rotation.z = 0.07;
        this.character.spineNode.rotation.y = 0.12;
        this.character.headNode.rotation.set(-0.05, -0.15, 0.08);
        this.character.leftUpperArmNode.rotation.set(0.2, 0.3, -0.75); // Hand on hip
        this.character.leftForearmNode.rotation.set(0, 0, -1.2);
        this.character.rightUpperArmNode.rotation.set(0.05, 0, 0.1);
        this.character.rightThighNode.rotation.x = -0.1;
        break;

      case 'ready':
        // Low combat stance, knees flexed, blade forward
        this.character.root.position.y = -0.06;
        this.character.pelvisNode.rotation.y = -0.3;
        this.character.spineNode.rotation.x = 0.15;
        this.character.leftThighNode.rotation.set(-0.25, 0, -0.15);
        this.character.leftShinNode.rotation.x = 0.4;
        this.character.rightThighNode.rotation.set(0.3, 0, 0.15);
        this.character.rightShinNode.rotation.x = 0.3;
        this.character.rightUpperArmNode.rotation.set(-0.3, -0.4, 0.5);
        break;

      case 'blossom':
        // Relaxed, feminine pose, hands gently clasped
        this.character.pelvisNode.rotation.z = -0.04;
        this.character.headNode.rotation.set(0.04, 0.08, -0.06);
        this.character.leftUpperArmNode.rotation.set(0.2, 0, -0.2);
        this.character.rightUpperArmNode.rotation.set(0.2, 0, 0.2);
        this.character.leftForearmNode.rotation.set(0, 0, 0.4);
        this.character.rightForearmNode.rotation.set(0, 0, -0.4);
        break;

      case 'glamour':
        // Alluring silhouette turn: hips turned, looking back towards camera
        this.character.pelvisNode.rotation.y = 0.65;
        this.character.spineNode.rotation.y = -0.35;
        this.character.headNode.rotation.set(0, -0.45, 0.06);
        this.character.leftUpperArmNode.rotation.set(-0.1, 0, -0.3);
        this.character.rightUpperArmNode.rotation.set(0.1, 0, 0.25);
        this.character.rightThighNode.rotation.set(-0.15, 0, 0.1);
        break;
    }

    // Micro breathing applied to pose
    this.character.chestNode.scale.set(1 + breathe, 1 + breathe, 1 + breathe);
  }
}
