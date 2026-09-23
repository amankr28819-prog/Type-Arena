import * as THREE from 'three';

export interface PhysicsParams {
  gravity: number;
  windStrength: number;
  windDirection: number; // In radians (0 to 2PI)
  upperBodyIntensity: number; // 0.0 to 2.0
  hairElasticity: number; // 0.2 to 2.0
  clothStiffness: number; // 0.2 to 2.0
  damping: number;
}

export const DEFAULT_PHYSICS_PARAMS: PhysicsParams = {
  gravity: 9.8,
  windStrength: 0.35,
  windDirection: 0.8,
  upperBodyIntensity: 1.0,
  hairElasticity: 1.0,
  clothStiffness: 1.0,
  damping: 0.88,
};

export interface SoftBodyOscillator {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  restPosition: THREE.Vector3;
  stiffness: number;
  damping: number;
  mass: number;
}

export interface HairChainNode {
  position: THREE.Vector3;
  prevPosition: THREE.Vector3;
  restLength: number;
}

export class SecondaryDynamicsEngine {
  public params: PhysicsParams;

  // Upper body dual-mass soft dynamics (Left & Right nodes)
  public leftBust: SoftBodyOscillator;
  public rightBust: SoftBodyOscillator;

  // Hair braid chain nodes (left braid, right braid, rear hair)
  public leftBraidNodes: HairChainNode[] = [];
  public rightBraidNodes: HairChainNode[] = [];
  public backHairNodes: HairChainNode[] = [];

  // Wind state
  private windPhase: number = 0;
  public currentWindVector: THREE.Vector3 = new THREE.Vector3();

  // Inertia tracking
  private prevCharPosition: THREE.Vector3 = new THREE.Vector3();
  private charVelocity: THREE.Vector3 = new THREE.Vector3();
  private prevCharVelocity: THREE.Vector3 = new THREE.Vector3();
  private charAcceleration: THREE.Vector3 = new THREE.Vector3();
  private prevCharRotation: number = 0;
  private angularVelocity: number = 0;

  constructor(params: Partial<PhysicsParams> = {}) {
    this.params = { ...DEFAULT_PHYSICS_PARAMS, ...params };

    // Initial soft body setup for upper body (natural human tissue response)
    this.leftBust = {
      position: new THREE.Vector3(-0.092, 1.25, 0.17),
      velocity: new THREE.Vector3(0, 0, 0),
      restPosition: new THREE.Vector3(-0.092, 1.25, 0.17),
      stiffness: 165.0,
      damping: 14.5,
      mass: 1.0,
    };

    this.rightBust = {
      position: new THREE.Vector3(0.092, 1.25, 0.17),
      velocity: new THREE.Vector3(0, 0, 0),
      restPosition: new THREE.Vector3(0.092, 1.25, 0.17),
      stiffness: 165.0,
      damping: 14.5,
      mass: 1.0,
    };

    // Initialize hair braid chains (5 segments each)
    this.initHairChain(this.leftBraidNodes, 5, 0.11);
    this.initHairChain(this.rightBraidNodes, 5, 0.11);
    this.initHairChain(this.backHairNodes, 4, 0.13);
  }

  private initHairChain(chain: HairChainNode[], count: number, segLength: number) {
    chain.length = 0;
    for (let i = 0; i < count; i++) {
      const pos = new THREE.Vector3(0, -i * segLength, 0);
      chain.push({
        position: pos.clone(),
        prevPosition: pos.clone(),
        restLength: segLength,
      });
    }
  }

  public reset() {
    this.leftBust.position.copy(this.leftBust.restPosition);
    this.leftBust.velocity.set(0, 0, 0);
    this.rightBust.position.copy(this.rightBust.restPosition);
    this.rightBust.velocity.set(0, 0, 0);

    this.initHairChain(this.leftBraidNodes, 5, 0.11);
    this.initHairChain(this.rightBraidNodes, 5, 0.11);
    this.initHairChain(this.backHairNodes, 4, 0.13);

    this.charVelocity.set(0, 0, 0);
    this.charAcceleration.set(0, 0, 0);
  }

  public update(
    dt: number,
    charPos: THREE.Vector3,
    charRotY: number,
    footstepImpact: number = 0,
    jumpVerticalVel: number = 0
  ) {
    const clampedDt = Math.min(dt, 0.033);

    // Compute linear velocity and acceleration of the character
    this.charVelocity.subVectors(charPos, this.prevCharPosition).divideScalar(clampedDt);
    this.charAcceleration
      .subVectors(this.charVelocity, this.prevCharVelocity)
      .divideScalar(clampedDt);
    this.prevCharPosition.copy(charPos);
    this.prevCharVelocity.copy(this.charVelocity);

    // Compute angular velocity
    let deltaRot = charRotY - this.prevCharRotation;
    // Normalize angle difference to [-PI, PI]
    while (deltaRot > Math.PI) deltaRot -= Math.PI * 2;
    while (deltaRot < -Math.PI) deltaRot += Math.PI * 2;
    this.angularVelocity = deltaRot / clampedDt;
    this.prevCharRotation = charRotY;

    // Wind oscillation calculation
    this.windPhase += clampedDt * 2.2;
    const windGust =
      Math.sin(this.windPhase) * 0.4 +
      Math.sin(this.windPhase * 2.7) * 0.25 +
      0.35;
    const effectiveWind = this.params.windStrength * windGust;
    this.currentWindVector.set(
      Math.cos(this.params.windDirection) * effectiveWind,
      Math.sin(this.windPhase * 1.5) * 0.05 * effectiveWind,
      Math.sin(this.params.windDirection) * effectiveWind
    );

    // Transform linear acceleration into character local frame
    const forwardAcc =
      this.charAcceleration.z * Math.cos(charRotY) -
      this.charAcceleration.x * Math.sin(charRotY);
    const lateralAcc =
      this.charAcceleration.x * Math.cos(charRotY) +
      this.charAcceleration.z * Math.sin(charRotY);

    // 1. UPDATE UPPER-BODY DYNAMICS
    this.updateBustNode(
      this.leftBust,
      clampedDt,
      forwardAcc,
      lateralAcc,
      this.angularVelocity,
      footstepImpact,
      jumpVerticalVel,
      -1
    );

    this.updateBustNode(
      this.rightBust,
      clampedDt,
      forwardAcc,
      lateralAcc,
      this.angularVelocity,
      footstepImpact,
      jumpVerticalVel,
      1
    );

    // 2. UPDATE HAIR BRAID VERLET CHAINS
    this.updateHairChain(
      this.leftBraidNodes,
      clampedDt,
      lateralAcc + this.angularVelocity * 0.5,
      forwardAcc,
      jumpVerticalVel
    );

    this.updateHairChain(
      this.rightBraidNodes,
      clampedDt,
      lateralAcc - this.angularVelocity * 0.5,
      forwardAcc,
      jumpVerticalVel
    );

    this.updateHairChain(
      this.backHairNodes,
      clampedDt,
      lateralAcc,
      forwardAcc,
      jumpVerticalVel
    );
  }

  private updateBustNode(
    node: SoftBodyOscillator,
    dt: number,
    forwardAcc: number,
    lateralAcc: number,
    angVel: number,
    footstepImpact: number,
    jumpVel: number,
    sideSign: number
  ) {
    if (this.params.upperBodyIntensity <= 0.01) {
      node.position.copy(node.restPosition);
      node.velocity.set(0, 0, 0);
      return;
    }

    const intensity = this.params.upperBodyIntensity;

    // Displacement from rest position in local coords
    const disp = new THREE.Vector3().subVectors(node.position, node.restPosition);

    // Spring force (Hooke's Law: F = -k * x)
    const springForce = disp.multiplyScalar(-node.stiffness);

    // Damping force (F = -c * v)
    const dampingForce = node.velocity.clone().multiplyScalar(-node.damping);

    // Inertial forces
    // Footstep vertical impulse (adds downward punch that bounces upward)
    const footstepForceY = -footstepImpact * 3.8 * intensity;

    // Jump velocity causes lag on ascent and bounce on landing
    const jumpForceY = -jumpVel * 2.2 * intensity;

    // Movement inertia: forward acceleration pushes bust back (Z), lateral pushes side (X)
    const inertX = (-lateralAcc * 0.04 - angVel * 0.12 * sideSign) * intensity;
    const inertZ = -forwardAcc * 0.05 * intensity;

    // Natural breathing / idle micro-bounce
    const totalForce = springForce
      .add(dampingForce)
      .add(new THREE.Vector3(inertX, footstepForceY + jumpForceY, inertZ));

    // Euler integration: a = F / m
    const acc = totalForce.divideScalar(node.mass);
    node.velocity.addScaledVector(acc, dt);

    // Velocity decay / safety clamp
    node.velocity.multiplyScalar(this.params.damping);

    // Limit maximum displacement to prevent any unnatural deformation
    const maxDisp = 0.048 * intensity;
    node.position.addScaledVector(node.velocity, dt);

    const delta = new THREE.Vector3().subVectors(node.position, node.restPosition);
    if (delta.length() > maxDisp) {
      delta.normalize().multiplyScalar(maxDisp);
      node.position.addVectors(node.restPosition, delta);
    }
  }

  private updateHairChain(
    chain: HairChainNode[],
    dt: number,
    inertialX: number,
    inertialZ: number,
    jumpVel: number
  ) {
    const elasticity = this.params.hairElasticity;
    const wind = this.currentWindVector;

    // Verlet integration for each chain segment (skip root node 0 which is anchored)
    for (let i = 1; i < chain.length; i++) {
      const node = chain[i];
      const vel = new THREE.Vector3().subVectors(node.position, node.prevPosition);
      vel.multiplyScalar(0.92); // Damping

      node.prevPosition.copy(node.position);

      // Forces: gravity + wind + inertia
      const grav = -this.params.gravity * 0.008;
      const windForceX = wind.x * 0.08 * elasticity;
      const windForceZ = wind.z * 0.08 * elasticity;
      const inX = -inertialX * 0.015 * elasticity;
      const inZ = -inertialZ * 0.018 * elasticity;
      const jumpEffectY = -jumpVel * 0.012;

      node.position.add(vel);
      node.position.x += (windForceX + inX) * dt * 60;
      node.position.y += (grav + jumpEffectY) * dt * 60;
      node.position.z += (windForceZ + inZ) * dt * 60;
    }

    // Distance constraints: enforce segment lengths
    for (let iter = 0; iter < 4; iter++) {
      for (let i = 1; i < chain.length; i++) {
        const parent = chain[i - 1];
        const child = chain[i];
        const delta = new THREE.Vector3().subVectors(child.position, parent.position);
        const dist = delta.length();
        if (dist > 0.0001) {
          const diff = (dist - child.restLength) / dist;
          child.position.sub(delta.multiplyScalar(diff));
        }
      }
    }
  }

  // Get current bust oscillation offsets for 3D meshes
  public getLeftBustOffset(): THREE.Vector3 {
    return new THREE.Vector3().subVectors(this.leftBust.position, this.leftBust.restPosition);
  }

  public getRightBustOffset(): THREE.Vector3 {
    return new THREE.Vector3().subVectors(this.rightBust.position, this.rightBust.restPosition);
  }

  // Realistic rotational tilt reacting to inertia and displacement
  public getLeftBustRotation(): THREE.Euler {
    const off = this.getLeftBustOffset();
    return new THREE.Euler(
      -off.y * 3.5 - off.z * 1.5,
      off.x * 1.8,
      -off.x * 2.2
    );
  }

  public getRightBustRotation(): THREE.Euler {
    const off = this.getRightBustOffset();
    return new THREE.Euler(
      -off.y * 3.5 - off.z * 1.5,
      off.x * 1.8,
      -off.x * 2.2
    );
  }

  // Get dynamic angles for hair braids
  public getBraidRotations(isLeft: boolean): { rotX: number; rotZ: number }[] {
    const chain = isLeft ? this.leftBraidNodes : this.rightBraidNodes;
    const rots: { rotX: number; rotZ: number }[] = [];

    for (let i = 1; i < chain.length; i++) {
      const p1 = chain[i - 1].position;
      const p2 = chain[i].position;
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const dz = p2.z - p1.z;

      const rotZ = Math.atan2(dx, -dy) * 0.65;
      const rotX = Math.atan2(dz, -dy) * 0.65;
      rots.push({ rotX, rotZ });
    }

    return rots;
  }
}
