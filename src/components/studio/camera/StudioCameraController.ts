import * as THREE from 'three';

export type CameraFocusMode = 'full' | 'upper' | 'mid' | 'lower';

export class StudioCameraController {
  public camera: THREE.PerspectiveCamera;
  public target: THREE.Vector3 = new THREE.Vector3(0, 1.05, 0);

  // Orbit angles (spherical coordinates)
  public distance: number = 3.6;
  public targetDistance: number = 3.6;
  public theta: number = 0; // Azimuth angle (horizontal)
  public targetTheta: number = 0;
  public phi: number = Math.PI / 2 - 0.15; // Elevation angle
  public targetPhi: number = Math.PI / 2 - 0.15;

  // Smoothing damping
  public dampingFactor: number = 0.085;

  // Clamping limits
  public minDistance: number = 1.2;
  public maxDistance: number = 6.5;
  public minPhi: number = 0.15; // Don't flip over top
  public maxPhi: number = Math.PI / 2 + 0.35; // Don't clip beneath ground

  // Focus targets
  public currentFocusMode: CameraFocusMode = 'full';
  private targetLookAt: THREE.Vector3 = new THREE.Vector3(0, 1.05, 0);

  constructor(camera: THREE.PerspectiveCamera) {
    this.camera = camera;
    this.resetCamera();
  }

  public setFocusMode(mode: CameraFocusMode) {
    this.currentFocusMode = mode;

    switch (mode) {
      case 'full':
        this.targetLookAt.set(0, 1.05, 0);
        this.targetDistance = 3.6;
        this.targetPhi = Math.PI / 2 - 0.12;
        break;

      case 'upper':
        this.targetLookAt.set(0, 1.35, 0);
        this.targetDistance = 1.65;
        this.targetPhi = Math.PI / 2 - 0.08;
        break;

      case 'mid':
        this.targetLookAt.set(0, 0.95, 0);
        this.targetDistance = 1.7;
        this.targetPhi = Math.PI / 2 - 0.05;
        break;

      case 'lower':
        this.targetLookAt.set(0, 0.45, 0);
        this.targetDistance = 2.1;
        this.targetPhi = Math.PI / 2 - 0.18;
        break;
    }
  }

  public resetCamera() {
    this.currentFocusMode = 'full';
    this.targetTheta = 0;
    this.targetPhi = Math.PI / 2 - 0.12;
    this.targetDistance = 3.6;
    this.targetLookAt.set(0, 1.05, 0);
    this.theta = this.targetTheta;
    this.phi = this.targetPhi;
    this.distance = this.targetDistance;
    this.target.copy(this.targetLookAt);
  }

  public onRotate(deltaX: number, deltaY: number) {
    this.targetTheta -= deltaX * 0.0055;
    this.targetPhi = THREE.MathUtils.clamp(
      this.targetPhi - deltaY * 0.0055,
      this.minPhi,
      this.maxPhi
    );
  }

  public onZoom(delta: number) {
    this.targetDistance = THREE.MathUtils.clamp(
      this.targetDistance + delta * 0.003,
      this.minDistance,
      this.maxDistance
    );
  }

  public update(charRootPos?: THREE.Vector3) {
    // Smooth interpolation (lerp)
    this.theta += (this.targetTheta - this.theta) * this.dampingFactor;
    this.phi += (this.targetPhi - this.phi) * this.dampingFactor;
    this.distance += (this.targetDistance - this.distance) * this.dampingFactor;

    // Follow character position if provided
    const lookCenter = this.targetLookAt.clone();
    if (charRootPos) {
      lookCenter.x += charRootPos.x;
      lookCenter.z += charRootPos.z;
    }
    this.target.lerp(lookCenter, this.dampingFactor);

    // Convert spherical coordinates to Cartesian (x, y, z)
    const sinPhi = Math.sin(this.phi);
    const cosPhi = Math.cos(this.phi);
    const sinTheta = Math.sin(this.theta);
    const cosTheta = Math.cos(this.theta);

    this.camera.position.set(
      this.target.x + this.distance * sinPhi * sinTheta,
      this.target.y + this.distance * cosPhi,
      this.target.z + this.distance * sinPhi * cosTheta
    );

    this.camera.lookAt(this.target);
  }
}
