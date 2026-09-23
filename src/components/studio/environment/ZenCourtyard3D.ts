import * as THREE from 'three';

export type LightingMood = 'twilight' | 'sunset' | 'moonlight' | 'studio';

export class ZenCourtyard3D {
  public root: THREE.Group;
  public floorMesh: THREE.Mesh;
  public lightingMood: LightingMood = 'twilight';

  // Lights
  public dirLight: THREE.DirectionalLight;
  public ambientLight: THREE.AmbientLight;
  public rimLight: THREE.DirectionalLight;
  public lanternLights: THREE.PointLight[] = [];

  // Falling Sakura Petal Particles
  private petalParticles: THREE.Points;
  private petalCount: number = 220;
  private petalPositions: Float32Array;
  private petalVelocities: Float32Array;
  private petalRotations: Float32Array;

  constructor() {
    this.root = new THREE.Group();
    this.root.name = 'ZenCourtyardEnvironment';

    // 1. ARENA FLOOR (Circular Japanese Courtyard Stone Flagstones)
    const floorCanvas = document.createElement('canvas');
    floorCanvas.width = 512;
    floorCanvas.height = 512;
    const fCtx = floorCanvas.getContext('2d')!;

    // Dark slate stone base
    fCtx.fillStyle = '#171c26';
    fCtx.fillRect(0, 0, 512, 512);

    // Stone flagstone cobblestone grid lines
    fCtx.strokeStyle = '#232b3a';
    fCtx.lineWidth = 3;
    for (let x = 0; x < 512; x += 64) {
      fCtx.beginPath();
      fCtx.moveTo(x, 0);
      fCtx.lineTo(x, 512);
      fCtx.stroke();
    }
    for (let y = 0; y < 512; y += 64) {
      fCtx.beginPath();
      fCtx.moveTo(0, y);
      fCtx.lineTo(512, y);
      fCtx.stroke();
    }

    // Concentric Arena Runes & Blossom Emblems
    fCtx.strokeStyle = 'rgba(244, 63, 94, 0.4)'; // Sakura pink ring
    fCtx.lineWidth = 4;
    fCtx.beginPath();
    fCtx.arc(256, 256, 210, 0, Math.PI * 2);
    fCtx.stroke();

    fCtx.strokeStyle = 'rgba(56, 189, 248, 0.35)'; // Cyan inner ring
    fCtx.lineWidth = 2.5;
    fCtx.beginPath();
    fCtx.arc(256, 256, 130, 0, Math.PI * 2);
    fCtx.stroke();

    // Center Blossom Emblem
    fCtx.fillStyle = 'rgba(244, 63, 94, 0.25)';
    for (let i = 0; i < 5; i++) {
      const angle = (i * Math.PI * 2) / 5;
      const px = 256 + Math.cos(angle) * 36;
      const py = 256 + Math.sin(angle) * 36;
      fCtx.beginPath();
      fCtx.ellipse(px, py, 22, 14, angle, 0, Math.PI * 2);
      fCtx.fill();
    }

    const floorTexture = new THREE.CanvasTexture(floorCanvas);
    floorTexture.wrapS = THREE.RepeatWrapping;
    floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(1, 1);

    const floorGeo = new THREE.CylinderGeometry(8.5, 8.5, 0.3, 48);
    const floorMat = new THREE.MeshStandardMaterial({
      map: floorTexture,
      roughness: 0.82,
      metalness: 0.15,
    });
    this.floorMesh = new THREE.Mesh(floorGeo, floorMat);
    this.floorMesh.position.y = -0.15;
    this.floorMesh.receiveShadow = true;
    this.root.add(this.floorMesh);

    // Decorative outer stone rim
    const rimGeo = new THREE.TorusGeometry(8.5, 0.25, 12, 48);
    const rimMesh = new THREE.Mesh(
      rimGeo,
      new THREE.MeshStandardMaterial({ color: 0x222a38, roughness: 0.7 })
    );
    rimMesh.rotation.x = Math.PI / 2;
    rimMesh.position.y = -0.05;
    this.root.add(rimMesh);

    // 2. JAPANESE STONE LANTERNS (Toro)
    const lanternPositions = [
      { x: -4.8, z: -4.8 },
      { x: 4.8, z: -4.8 },
      { x: -4.8, z: 4.8 },
      { x: 4.8, z: 4.8 },
    ];

    lanternPositions.forEach((pos) => {
      const lanternGroup = this.createStoneLantern();
      lanternGroup.position.set(pos.x, 0, pos.z);
      this.root.add(lanternGroup);

      const light = new THREE.PointLight(0xff9944, 1.2, 7.5, 1.5);
      light.position.set(pos.x, 1.2, pos.z);
      this.lanternLights.push(light);
      this.root.add(light);
    });

    // 3. FALLING SAKURA CHERRY BLOSSOM PETALS
    const pGeo = new THREE.BufferGeometry();
    this.petalPositions = new Float32Array(this.petalCount * 3);
    this.petalVelocities = new Float32Array(this.petalCount * 3);
    this.petalRotations = new Float32Array(this.petalCount * 3);

    for (let i = 0; i < this.petalCount; i++) {
      const idx = i * 3;
      this.petalPositions[idx] = (Math.random() - 0.5) * 16;
      this.petalPositions[idx + 1] = Math.random() * 8 + 0.2;
      this.petalPositions[idx + 2] = (Math.random() - 0.5) * 16;

      this.petalVelocities[idx] = (Math.random() - 0.5) * 0.4;
      this.petalVelocities[idx + 1] = -(Math.random() * 0.45 + 0.25);
      this.petalVelocities[idx + 2] = Math.random() * 0.4 + 0.1;

      this.petalRotations[idx] = Math.random() * Math.PI * 2;
    }

    pGeo.setAttribute('position', new THREE.BufferAttribute(this.petalPositions, 3));

    // Petal texture canvas
    const petCanvas = document.createElement('canvas');
    petCanvas.width = 64;
    petCanvas.height = 64;
    const pCtx = petCanvas.getContext('2d')!;
    pCtx.fillStyle = '#ff709b';
    pCtx.beginPath();
    pCtx.ellipse(32, 32, 28, 16, 0.4, 0, Math.PI * 2);
    pCtx.fill();
    pCtx.fillStyle = '#ffb3c9';
    pCtx.beginPath();
    pCtx.ellipse(30, 30, 20, 10, 0.4, 0, Math.PI * 2);
    pCtx.fill();

    const petTex = new THREE.CanvasTexture(petCanvas);
    const pMat = new THREE.PointsMaterial({
      size: 0.16,
      map: petTex,
      transparent: true,
      opacity: 0.85,
      blending: THREE.NormalBlending,
      depthWrite: false,
    });

    this.petalParticles = new THREE.Points(pGeo, pMat);
    this.root.add(this.petalParticles);

    // 4. LIGHTING RIG
    this.ambientLight = new THREE.AmbientLight(0xd4e2f5, 0.65);
    this.root.add(this.ambientLight);

    this.dirLight = new THREE.DirectionalLight(0xffe8d6, 1.4);
    this.dirLight.position.set(4, 7, 5);
    this.dirLight.castShadow = true;
    this.dirLight.shadow.mapSize.width = 1024;
    this.dirLight.shadow.mapSize.height = 1024;
    this.dirLight.shadow.camera.near = 0.5;
    this.dirLight.shadow.camera.far = 20;
    this.dirLight.shadow.camera.left = -3.5;
    this.dirLight.shadow.camera.right = 3.5;
    this.dirLight.shadow.camera.top = 3.5;
    this.dirLight.shadow.camera.bottom = -3.5;
    this.dirLight.shadow.bias = -0.001;
    this.root.add(this.dirLight);

    // Rim light (highlights curves and silhouette from behind)
    this.rimLight = new THREE.DirectionalLight(0xf43f5e, 1.1);
    this.rimLight.position.set(-4, 5, -5);
    this.root.add(this.rimLight);

    // Apply default mood
    this.setLightingMood('twilight');
  }

  private createStoneLantern(): THREE.Group {
    const lantern = new THREE.Group();
    const stoneMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.85 });
    const woodRoofMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.7 });

    // Base pedestal
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.42, 0.2, 8), stoneMat);
    base.position.y = 0.1;
    lantern.add(base);

    // Pillar
    const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 0.8, 8), stoneMat);
    pillar.position.y = 0.55;
    lantern.add(pillar);

    // Fire chamber (glowing paper lattice)
    const chamber = new THREE.Mesh(
      new THREE.BoxGeometry(0.42, 0.38, 0.42),
      new THREE.MeshBasicMaterial({ color: 0xffaa44, transparent: true, opacity: 0.75 })
    );
    chamber.position.y = 1.15;
    lantern.add(chamber);

    // Pagoda roof
    const roof = new THREE.Mesh(new THREE.ConeGeometry(0.55, 0.32, 4), woodRoofMat);
    roof.rotation.y = Math.PI / 4;
    roof.position.y = 1.48;
    lantern.add(roof);

    return lantern;
  }

  public setLightingMood(mood: LightingMood) {
    this.lightingMood = mood;

    switch (mood) {
      case 'twilight':
        this.ambientLight.color.setHex(0xb2c7e0);
        this.ambientLight.intensity = 0.65;
        this.dirLight.color.setHex(0xffdfd0);
        this.dirLight.intensity = 1.35;
        this.rimLight.color.setHex(0xf43f5e); // Sakura pink rim glow
        this.rimLight.intensity = 1.1;
        this.lanternLights.forEach((l) => (l.intensity = 1.3));
        break;

      case 'sunset':
        this.ambientLight.color.setHex(0x5a3434);
        this.ambientLight.intensity = 0.55;
        this.dirLight.color.setHex(0xffaa55); // Rich golden hour
        this.dirLight.intensity = 1.6;
        this.rimLight.color.setHex(0xff5533);
        this.rimLight.intensity = 1.3;
        this.lanternLights.forEach((l) => (l.intensity = 1.5));
        break;

      case 'moonlight':
        this.ambientLight.color.setHex(0x1a2d4b);
        this.ambientLight.intensity = 0.45;
        this.dirLight.color.setHex(0x9bd8ff); // Cool cyan moonbeam
        this.dirLight.intensity = 1.1;
        this.rimLight.color.setHex(0x38bdf8);
        this.rimLight.intensity = 1.4;
        this.lanternLights.forEach((l) => (l.intensity = 1.8));
        break;

      case 'studio':
        this.ambientLight.color.setHex(0xffffff);
        this.ambientLight.intensity = 0.85;
        this.dirLight.color.setHex(0xffffff);
        this.dirLight.intensity = 1.5;
        this.rimLight.color.setHex(0xe0f2fe);
        this.rimLight.intensity = 0.6;
        this.lanternLights.forEach((l) => (l.intensity = 0.4));
        break;
    }
  }

  public update(dt: number, windVector: THREE.Vector3) {
    // 1. Animate Falling Sakura Petals
    const pos = this.petalPositions;
    for (let i = 0; i < this.petalCount; i++) {
      const idx = i * 3;
      // Drift with wind
      pos[idx] += (windVector.x * 0.8 + this.petalVelocities[idx]) * dt;
      pos[idx + 1] += this.petalVelocities[idx + 1] * dt;
      pos[idx + 2] += (windVector.z * 0.8 + this.petalVelocities[idx + 2]) * dt;

      // Recycle petals when hitting ground or drifting too far
      if (pos[idx + 1] < 0 || Math.abs(pos[idx]) > 9 || Math.abs(pos[idx + 2]) > 9) {
        pos[idx] = (Math.random() - 0.5) * 16;
        pos[idx + 1] = Math.random() * 3 + 5;
        pos[idx + 2] = (Math.random() - 0.5) * 16;
      }
    }
    this.petalParticles.geometry.attributes.position.needsUpdate = true;

    // 2. Subtle Lantern Light Flickering
    const flicker = Math.sin(Date.now() * 0.008) * 0.12;
    this.lanternLights.forEach((l) => {
      l.intensity = Math.max(0.2, l.intensity + flicker * 0.05);
    });
  }
}
