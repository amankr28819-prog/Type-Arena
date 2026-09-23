import * as THREE from 'three';
import { SecondaryDynamicsEngine } from '../physics/SecondaryDynamics';

export type AppearanceMode = 'full' | 'revealing' | 'unclothed';
export type FacialExpression = 'smile' | 'confident' | 'blush' | 'fierce';

export interface CostumeLayers {
  haori: boolean;
  jacket: boolean;
  skirt: boolean;
  stockings: boolean;
  belt: boolean;
  sword: boolean;
  swordInHand: boolean;
}

export class AnimeHeroine3D {
  public root: THREE.Group;
  public dynamics: SecondaryDynamicsEngine;

  // Appearance State
  public appearanceMode: AppearanceMode = 'full';
  public layers: CostumeLayers = {
    haori: true,
    jacket: true,
    skirt: true,
    stockings: true,
    belt: true,
    sword: true,
    swordInHand: false,
  };
  public expression: FacialExpression = 'smile';
  public skinSheen: number = 0.35;

  // Hierarchical Body Nodes
  public pelvisNode: THREE.Group;
  public spineNode: THREE.Group;
  public chestNode: THREE.Group;
  public neckNode: THREE.Group;
  public headNode: THREE.Group;

  // Limbs
  public leftThighNode: THREE.Group;
  public leftShinNode: THREE.Group;
  public rightThighNode: THREE.Group;
  public rightShinNode: THREE.Group;
  public leftUpperArmNode: THREE.Group;
  public leftForearmNode: THREE.Group;
  public rightUpperArmNode: THREE.Group;
  public rightForearmNode: THREE.Group;
  public rightHandNode: THREE.Group;

  // Soft Dynamics Bust Meshes (Teardrop Anatomical Sculpture)
  public leftBustGroup: THREE.Group;
  public rightBustGroup: THREE.Group;
  public leftBustBareMesh!: THREE.Mesh;
  public rightBustBareMesh!: THREE.Mesh;
  public leftBustClothedMesh!: THREE.Mesh;
  public rightBustClothedMesh!: THREE.Mesh;

  // Hair Segments (Volumetric Braids & Strands)
  public leftBraidSegments: THREE.Group[] = [];
  public rightBraidSegments: THREE.Group[] = [];
  public backHairGroup: THREE.Group;

  // Costume Mesh Groups
  private haoriGroup: THREE.Group;
  private jacketGroup: THREE.Group;
  private skirtGroup: THREE.Group;
  private stockingsGroup: THREE.Group;
  private beltGroup: THREE.Group;
  private swordSheathedGroup: THREE.Group;
  private swordHandGroup: THREE.Group;

  // Bare Anatomical Meshes
  public bareTorsoMesh!: THREE.Mesh;

  // Realistic Materials (MeshPhysicalMaterial with SSS & Micro-Pores)
  public skinMaterial!: THREE.MeshPhysicalMaterial;
  private hairMaterial!: THREE.MeshStandardMaterial;
  private faceMaterial!: THREE.MeshPhysicalMaterial;
  private eyeCorneaMaterial!: THREE.MeshPhysicalMaterial;
  private irisMaterial!: THREE.MeshBasicMaterial;
  private darkFabricMaterial!: THREE.MeshStandardMaterial;
  private whiteFabricMaterial!: THREE.MeshStandardMaterial;
  private goldAccentMaterial!: THREE.MeshStandardMaterial;
  private stockingsMaterial!: THREE.MeshStandardMaterial;
  private bladeMaterial!: THREE.MeshStandardMaterial;

  constructor(dynamics: SecondaryDynamicsEngine) {
    this.dynamics = dynamics;
    this.root = new THREE.Group();
    this.root.name = 'AnimeHeroineRoot';

    // 1. Initialize Advanced Multi-Tone Physical Materials
    this.initRealisticMaterials();

    // 2. Build Rigged Skeleton & Anatomical Hierarchy
    this.pelvisNode = new THREE.Group();
    this.pelvisNode.position.y = 0.98;
    this.root.add(this.pelvisNode);

    this.spineNode = new THREE.Group();
    this.spineNode.position.y = 0.12;
    this.pelvisNode.add(this.spineNode);

    this.chestNode = new THREE.Group();
    this.chestNode.position.y = 0.20;
    this.spineNode.add(this.chestNode);

    this.neckNode = new THREE.Group();
    this.neckNode.position.y = 0.23;
    this.chestNode.add(this.neckNode);

    this.headNode = new THREE.Group();
    this.headNode.position.y = 0.09;
    this.neckNode.add(this.headNode);

    // Limbs Hierarchy
    this.leftThighNode = new THREE.Group();
    this.leftThighNode.position.set(-0.115, -0.06, 0);
    this.pelvisNode.add(this.leftThighNode);

    this.leftShinNode = new THREE.Group();
    this.leftShinNode.position.set(0, -0.45, 0);
    this.leftThighNode.add(this.leftShinNode);

    this.rightThighNode = new THREE.Group();
    this.rightThighNode.position.set(0.115, -0.06, 0);
    this.pelvisNode.add(this.rightThighNode);

    this.rightShinNode = new THREE.Group();
    this.rightShinNode.position.set(0, -0.45, 0);
    this.rightThighNode.add(this.rightShinNode);

    this.leftUpperArmNode = new THREE.Group();
    this.leftUpperArmNode.position.set(-0.22, 0.17, 0);
    this.chestNode.add(this.leftUpperArmNode);

    this.leftForearmNode = new THREE.Group();
    this.leftForearmNode.position.set(0, -0.28, 0);
    this.leftUpperArmNode.add(this.leftForearmNode);

    this.rightUpperArmNode = new THREE.Group();
    this.rightUpperArmNode.position.set(0.22, 0.17, 0);
    this.chestNode.add(this.rightUpperArmNode);

    this.rightForearmNode = new THREE.Group();
    this.rightForearmNode.position.set(0, -0.28, 0);
    this.rightUpperArmNode.add(this.rightForearmNode);

    this.rightHandNode = new THREE.Group();
    this.rightHandNode.position.set(0, -0.27, 0);
    this.rightForearmNode.add(this.rightHandNode);

    // Groups
    this.haoriGroup = new THREE.Group();
    this.jacketGroup = new THREE.Group();
    this.skirtGroup = new THREE.Group();
    this.stockingsGroup = new THREE.Group();
    this.beltGroup = new THREE.Group();
    this.swordSheathedGroup = new THREE.Group();
    this.swordHandGroup = new THREE.Group();
    this.leftBustGroup = new THREE.Group();
    this.rightBustGroup = new THREE.Group();
    this.backHairGroup = new THREE.Group();

    // 3. Construct the Realistic 3D Character
    this.buildOrganicAnatomy();
    this.buildSculptedHeadAndHair();
    this.buildCostume();
    this.buildNichirinSword();

    // 4. Apply Initial Appearance State
    this.setAppearanceMode('full');
  }

  // =========================================================================
  // MATERIAL SYSTEM: Realistic Physical Skin with Multi-Tone Dermal Flushing
  // =========================================================================
  private initRealisticMaterials() {
    // 1. Procedural Micro-Pore Bump Texture (Eliminates flat plastic/wood look)
    const poreCanvas = document.createElement('canvas');
    poreCanvas.width = 512;
    poreCanvas.height = 512;
    const pCtx = poreCanvas.getContext('2d')!;
    pCtx.fillStyle = '#808080';
    pCtx.fillRect(0, 0, 512, 512);

    const imgData = pCtx.getImageData(0, 0, 512, 512);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 32;
      const v = Math.min(255, Math.max(0, 128 + noise));
      data[i] = v;
      data[i + 1] = v;
      data[i + 2] = v;
    }
    pCtx.putImageData(imgData, 0, 0);

    const poreTexture = new THREE.CanvasTexture(poreCanvas);
    poreTexture.wrapS = THREE.RepeatWrapping;
    poreTexture.wrapT = THREE.RepeatWrapping;
    poreTexture.repeat.set(16, 16);

    // 2. Multi-Tone Dermal Flush Texture (Warmth on extremities & soft ambient occlusion in folds)
    const skinMapCanvas = document.createElement('canvas');
    skinMapCanvas.width = 512;
    skinMapCanvas.height = 512;
    const sCtx = skinMapCanvas.getContext('2d')!;

    // Base porcelain tone with soft peach warmth
    sCtx.fillStyle = '#ffe2d4';
    sCtx.fillRect(0, 0, 512, 512);

    // Dermal warm flushing (shoulders, knees, elbows, gluteal fold warmth)
    const drawFlushZone = (x: number, y: number, r: number, alpha: number) => {
      const grad = sCtx.createRadialGradient(x, y, 0, x, y, r);
      grad.addColorStop(0, `rgba(255, 120, 140, ${alpha})`);
      grad.addColorStop(1, 'rgba(255, 226, 212, 0)');
      sCtx.fillStyle = grad;
      sCtx.beginPath();
      sCtx.arc(x, y, r, 0, Math.PI * 2);
      sCtx.fill();
    };

    drawFlushZone(128, 128, 90, 0.28);
    drawFlushZone(384, 128, 90, 0.28);
    drawFlushZone(256, 384, 110, 0.22);
    drawFlushZone(128, 420, 75, 0.25);
    drawFlushZone(384, 420, 75, 0.25);

    const skinDiffuseMap = new THREE.CanvasTexture(skinMapCanvas);
    skinDiffuseMap.wrapS = THREE.RepeatWrapping;
    skinDiffuseMap.wrapT = THREE.RepeatWrapping;

    // 3. Realistic Living Female Skin Shader (MeshPhysicalMaterial)
    this.skinMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffdfd2,
      map: skinDiffuseMap,
      roughness: 0.44, // Soft organic skin diffusion
      metalness: 0.0,
      clearcoat: 0.12, // Subtle stratum corneum hydration
      clearcoatRoughness: 0.35,
      sheen: 0.85, // Translucent peach-fuzz backscatter (SSS emulation)
      sheenColor: new THREE.Color(0xffb0be),
      bumpMap: poreTexture,
      bumpScale: 0.0028,
    });

    // 4. Hair Texture (Sakura Pink to Lime Green Gradient + Specular Highlights)
    const hairCanvas = document.createElement('canvas');
    hairCanvas.width = 128;
    hairCanvas.height = 512;
    const hCtx = hairCanvas.getContext('2d')!;
    const hGrad = hCtx.createLinearGradient(0, 0, 0, 512);
    hGrad.addColorStop(0.0, '#ffa8cb'); // Pastel pink roots
    hGrad.addColorStop(0.48, '#f45d94'); // Blossom pink body
    hGrad.addColorStop(0.74, '#b4e858'); // Lime-yellow transition
    hGrad.addColorStop(1.0, '#62cb22'); // Lime green tips
    hCtx.fillStyle = hGrad;
    hCtx.fillRect(0, 0, 128, 512);

    hCtx.fillStyle = 'rgba(255, 255, 255, 0.18)';
    for (let i = 0; i < 30; i++) {
      hCtx.fillRect(Math.random() * 128, 0, 1.5, 512);
    }
    const hairTexture = new THREE.CanvasTexture(hairCanvas);

    this.hairMaterial = new THREE.MeshStandardMaterial({
      map: hairTexture,
      roughness: 0.36,
      metalness: 0.12,
    });

    // 5. Detailed 3D Face Material
    this.faceMaterial = this.createRealisticFaceMaterial('smile', poreTexture);

    // 6. Eyeball Materials: Glassy Cornea & Striated Emerald-to-Gold Iris
    this.eyeCorneaMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.95,
      opacity: 1,
      transparent: true,
      roughness: 0.04,
      ior: 1.38,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
    });

    const irisCanvas = document.createElement('canvas');
    irisCanvas.width = 256;
    irisCanvas.height = 256;
    const iCtx = irisCanvas.getContext('2d')!;

    iCtx.fillStyle = '#ffffff';
    iCtx.fillRect(0, 0, 256, 256);

    // Limbal ring
    iCtx.fillStyle = '#0d401a';
    iCtx.beginPath();
    iCtx.arc(128, 128, 100, 0, Math.PI * 2);
    iCtx.fill();

    // Emerald to golden iris
    const irisGrad = iCtx.createRadialGradient(128, 128, 15, 128, 128, 96);
    irisGrad.addColorStop(0.0, '#0a2211');
    irisGrad.addColorStop(0.28, '#1e7534');
    irisGrad.addColorStop(0.68, '#4de065');
    irisGrad.addColorStop(1.0, '#c2f238');
    iCtx.fillStyle = irisGrad;
    iCtx.beginPath();
    iCtx.arc(128, 128, 96, 0, Math.PI * 2);
    iCtx.fill();

    // Striations
    iCtx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    iCtx.lineWidth = 1.2;
    for (let a = 0; a < Math.PI * 2; a += 0.1) {
      iCtx.beginPath();
      iCtx.moveTo(128 + Math.cos(a) * 35, 128 + Math.sin(a) * 35);
      iCtx.lineTo(128 + Math.cos(a) * 92, 128 + Math.sin(a) * 92);
      iCtx.stroke();
    }

    // Pupil
    iCtx.fillStyle = '#06160b';
    iCtx.beginPath();
    iCtx.arc(128, 128, 36, 0, Math.PI * 2);
    iCtx.fill();

    // Catch lights
    iCtx.fillStyle = '#ffffff';
    iCtx.beginPath();
    iCtx.ellipse(105, 100, 16, 22, -0.3, 0, Math.PI * 2);
    iCtx.fill();
    iCtx.beginPath();
    iCtx.arc(148, 148, 8, 0, Math.PI * 2);
    iCtx.fill();

    const irisTex = new THREE.CanvasTexture(irisCanvas);
    this.irisMaterial = new THREE.MeshBasicMaterial({ map: irisTex });

    // 7. Fabric Materials (Woven Combat Uniform & Silk Haori)
    this.darkFabricMaterial = new THREE.MeshStandardMaterial({
      color: 0x161a22,
      roughness: 0.72,
      metalness: 0.06,
    });

    this.whiteFabricMaterial = new THREE.MeshStandardMaterial({
      color: 0xfbfdff,
      roughness: 0.52,
      metalness: 0.04,
      side: THREE.DoubleSide,
    });

    this.goldAccentMaterial = new THREE.MeshStandardMaterial({
      color: 0xf8be3c,
      roughness: 0.24,
      metalness: 0.88,
    });

    // 8. Striped Stockings Texture (Lime green and navy)
    const sockCanvas = document.createElement('canvas');
    sockCanvas.width = 64;
    sockCanvas.height = 256;
    const sockCtx = sockCanvas.getContext('2d')!;
    sockCtx.fillStyle = '#6ac928';
    sockCtx.fillRect(0, 0, 64, 256);
    sockCtx.fillStyle = '#1c222e';
    for (let y = 0; y < 256; y += 32) {
      sockCtx.fillRect(0, y, 64, 15);
    }
    const sockTexture = new THREE.CanvasTexture(sockCanvas);
    sockTexture.wrapS = THREE.RepeatWrapping;
    sockTexture.wrapT = THREE.RepeatWrapping;
    sockTexture.repeat.set(1, 2);

    this.stockingsMaterial = new THREE.MeshStandardMaterial({
      map: sockTexture,
      roughness: 0.58,
      metalness: 0.05,
    });

    // 9. Steel Nichirin Blade
    this.bladeMaterial = new THREE.MeshStandardMaterial({
      color: 0xf2f6fa,
      roughness: 0.16,
      metalness: 0.96,
      envMapIntensity: 1.4,
    });
  }

  private createRealisticFaceMaterial(
    expr: FacialExpression,
    poreTexture: THREE.Texture
  ): THREE.MeshPhysicalMaterial {
    const fCanvas = document.createElement('canvas');
    fCanvas.width = 1024;
    fCanvas.height = 1024;
    const ctx = fCanvas.getContext('2d')!;

    // Base skin tone
    ctx.fillStyle = '#ffe2d6';
    ctx.fillRect(0, 0, 1024, 1024);

    // Warm rosy cheek blush
    const leftBlush = ctx.createRadialGradient(320, 620, 10, 320, 620, 110);
    leftBlush.addColorStop(0, expr === 'blush' ? 'rgba(255, 80, 125, 0.65)' : 'rgba(255, 110, 145, 0.42)');
    leftBlush.addColorStop(1, 'rgba(255, 226, 214, 0)');
    ctx.fillStyle = leftBlush;
    ctx.beginPath();
    ctx.arc(320, 620, 110, 0, Math.PI * 2);
    ctx.fill();

    const rightBlush = ctx.createRadialGradient(704, 620, 10, 704, 620, 110);
    rightBlush.addColorStop(0, expr === 'blush' ? 'rgba(255, 80, 125, 0.65)' : 'rgba(255, 110, 145, 0.42)');
    rightBlush.addColorStop(1, 'rgba(255, 226, 214, 0)');
    ctx.fillStyle = rightBlush;
    ctx.beginPath();
    ctx.arc(704, 620, 110, 0, Math.PI * 2);
    ctx.fill();

    // Dual beauty marks under each eye (reference signature)
    ctx.fillStyle = '#56322b';
    ctx.beginPath();
    ctx.arc(295, 665, 5.5, 0, Math.PI * 2);
    ctx.arc(345, 672, 5.5, 0, Math.PI * 2);
    ctx.arc(679, 672, 5.5, 0, Math.PI * 2);
    ctx.arc(729, 665, 5.5, 0, Math.PI * 2);
    ctx.fill();

    // Eye outline & lashes
    const drawLashes = (cx: number, cy: number, isLeft: boolean) => {
      ctx.strokeStyle = '#221411';
      ctx.lineWidth = 11;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(cx, cy + 12, 85, Math.PI * 1.15, Math.PI * 1.85);
      ctx.stroke();

      ctx.lineWidth = 8;
      ctx.beginPath();
      if (isLeft) {
        ctx.moveTo(cx - 72, cy - 35);
        ctx.quadraticCurveTo(cx - 98, cy - 50, cx - 110, cy - 44);
      } else {
        ctx.moveTo(cx + 72, cy - 35);
        ctx.quadraticCurveTo(cx + 98, cy - 50, cx + 110, cy - 44);
      }
      ctx.stroke();

      ctx.strokeStyle = '#5a3832';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(cx, cy + 12, 82, Math.PI * 0.25, Math.PI * 0.75);
      ctx.stroke();
    };

    drawLashes(330, 520, true);
    drawLashes(694, 520, false);

    // Eyebrows
    ctx.strokeStyle = '#d4487b';
    ctx.lineWidth = 7;
    ctx.lineCap = 'round';
    ctx.beginPath();
    if (expr === 'fierce') {
      ctx.moveTo(250, 410);
      ctx.lineTo(410, 440);
      ctx.moveTo(774, 410);
      ctx.lineTo(614, 440);
    } else {
      ctx.moveTo(240, 420);
      ctx.quadraticCurveTo(330, 395, 410, 418);
      ctx.moveTo(614, 418);
      ctx.quadraticCurveTo(694, 395, 784, 420);
    }
    ctx.stroke();

    // Nostril shadow
    ctx.fillStyle = '#6b3c32';
    ctx.beginPath();
    ctx.arc(498, 638, 3.5, 0, Math.PI * 2);
    ctx.arc(526, 638, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Plump lips with Cupid's bow
    ctx.fillStyle = '#ff6e8e';
    ctx.strokeStyle = '#c43d5b';
    ctx.lineWidth = 4;
    ctx.beginPath();
    if (expr === 'smile' || expr === 'blush') {
      ctx.moveTo(462, 725);
      ctx.quadraticCurveTo(490, 715, 512, 724);
      ctx.quadraticCurveTo(534, 715, 562, 725);
      ctx.quadraticCurveTo(512, 736, 462, 725);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ff829f';
      ctx.beginPath();
      ctx.moveTo(466, 727);
      ctx.quadraticCurveTo(512, 762, 558, 727);
      ctx.quadraticCurveTo(512, 734, 466, 727);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
      ctx.beginPath();
      ctx.ellipse(512, 742, 18, 5, 0, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.moveTo(470, 735);
      ctx.quadraticCurveTo(512, 748, 568, 725);
      ctx.stroke();
    }

    const tex = new THREE.CanvasTexture(fCanvas);

    return new THREE.MeshPhysicalMaterial({
      map: tex,
      roughness: 0.40,
      metalness: 0.0,
      clearcoat: 0.22,
      sheen: 0.65,
      sheenColor: new THREE.Color(0xffb2c2),
      bumpMap: poreTexture,
      bumpScale: 0.0022,
    });
  }

  // =========================================================================
  // ORGANIC ANATOMY BUILDER (Custom Lofted Meshes — Zero Mannequin Cylinders)
  // =========================================================================
  private buildOrganicAnatomy() {
    // 1. PELVIS & BUTTOCKS WITH NATURAL CLEFT & VOLUMETRIC CREASE
    // Generate an organic pelvis mesh with lumbar lordosis and deep gluteal cleft from the back
    this.buildSculptedPelvisAndGlutes();

    // 2. TORSO, NARROW WAIST, STERNUM & CLAVICLES
    this.buildSculptedTorso();

    // 3. TEARDROP BUST WITH NATURAL WEIGHT & CLEAVAGE
    this.buildSculptedBust();

    // 4. SCULPTED LIMBS: Natural Thighs, Patella Knees, Gastrocnemius Calves & Feet
    this.buildSculptedLegs();

    // 5. SCULPTED ARMS, DELTOIDS & ARTICULATED HANDS
    this.buildSculptedArms();
  }

  // --- SCULPTED PELVIS & GLUTEAL COMPLEX ---
  private buildSculptedPelvisAndGlutes() {
    // Parametric lofted pelvis geometry with 28 vertical rings and 36 radial segments
    // Creates high-resolution organic curves, natural hip flare, and buttocks with gluteal cleft
    const rings = 20;
    const segments = 36;
    const geo = new THREE.BufferGeometry();
    const vertices: number[] = [];
    const indices: number[] = [];
    const uvs: number[] = [];

    const height = 0.26;
    const yStart = 0.10;

    for (let r = 0; r <= rings; r++) {
      const v = r / rings;
      const y = yStart - v * height; // Top (waist) to bottom (groin/thigh junction)

      // Radius profile at height
      // Top: narrower (waist transition). Mid: wide feminine pelvic flare. Bottom: groin taper.
      const widthScale = 0.17 + Math.sin(v * Math.PI) * 0.045; // Lateral width
      const depthScale = 0.15 + (1 - v) * 0.035; // Anterior-posterior depth

      for (let s = 0; s <= segments; s++) {
        const u = s / segments;
        const angle = u * Math.PI * 2;

        let rx = Math.sin(angle) * widthScale * 1.15;
        let rz = Math.cos(angle) * depthScale;

        // Posterior sculpture: Gluteal cleft and volume
        // When angle is around PI (rear view, Z < 0)
        if (rz < 0 && v > 0.15 && v < 0.95) {
          const rearFactor = Math.abs(Math.cos(angle)); // Maximum directly at rear
          const cleftDist = Math.abs(rx); // Distance from center cleft line

          // Buttock volume shelf (expands backward)
          const buttockSwell = Math.sin((v - 0.15) / 0.8 * Math.PI) * 0.048 * rearFactor;
          rz -= buttockSwell;

          // Central Gluteal Cleft (intergluteal fold indentation)
          if (cleftDist < 0.042) {
            const cleftDepth = (1 - cleftDist / 0.042) * buttockSwell * 0.85;
            rz += cleftDepth; // Inset towards center
          }
        }

        // Anterior sculpture: Gentle lower belly curve
        if (rz > 0 && v > 0.2 && v < 0.7) {
          rz += Math.sin((v - 0.2) / 0.5 * Math.PI) * 0.012;
        }

        vertices.push(rx, y, rz);
        uvs.push(u, v);
      }
    }

    // Build triangle indices
    for (let r = 0; r < rings; r++) {
      for (let s = 0; s < segments; s++) {
        const a = r * (segments + 1) + s;
        const b = (r + 1) * (segments + 1) + s;
        const c = (r + 1) * (segments + 1) + (s + 1);
        const d = r * (segments + 1) + (s + 1);

        indices.push(a, b, d);
        indices.push(b, c, d);
      }
    }

    geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geo.setIndex(indices);
    geo.computeVertexNormals();

    const pelvisMesh = new THREE.Mesh(geo, this.skinMaterial);
    pelvisMesh.castShadow = true;
    pelvisMesh.receiveShadow = true;
    this.pelvisNode.add(pelvisMesh);
  }

  // --- SCULPTED TORSO, WAIST & CLAVICLES ---
  private buildSculptedTorso() {
    // Custom lofted torso from narrow waist to clavicles
    const rings = 18;
    const segments = 36;
    const geo = new THREE.BufferGeometry();
    const vertices: number[] = [];
    const indices: number[] = [];
    const uvs: number[] = [];

    const height = 0.24;
    const yStart = -0.04;

    for (let r = 0; r <= rings; r++) {
      const v = r / rings;
      const y = yStart + v * height; // Waist upward to ribcage

      // Waist is narrowest at v=0.2, expands upward into ribcage and clavicles
      const wFactor = 0.142 + Math.pow(v, 1.4) * 0.038;
      const dFactor = 0.125 + Math.pow(v, 1.2) * 0.028;

      for (let s = 0; s <= segments; s++) {
        const u = s / segments;
        const angle = u * Math.PI * 2;

        let rx = Math.sin(angle) * wFactor * 1.1;
        let rz = Math.cos(angle) * dFactor;

        // Front epigastric depression between ribs
        if (rz > 0 && v > 0.4 && Math.abs(rx) < 0.03) {
          rz -= 0.008 * (1 - Math.abs(rx) / 0.03);
        }

        // Back lumbar spine depression
        if (rz < 0 && Math.abs(rx) < 0.025) {
          rz += 0.006 * (1 - Math.abs(rx) / 0.025);
        }

        vertices.push(rx, y, rz);
        uvs.push(u, v);
      }
    }

    for (let r = 0; r < rings; r++) {
      for (let s = 0; s < segments; s++) {
        const a = r * (segments + 1) + s;
        const b = (r + 1) * (segments + 1) + s;
        const c = (r + 1) * (segments + 1) + (s + 1);
        const d = r * (segments + 1) + (s + 1);

        indices.push(a, b, d);
        indices.push(b, c, d);
      }
    }

    geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geo.setIndex(indices);
    geo.computeVertexNormals();

    this.bareTorsoMesh = new THREE.Mesh(geo, this.skinMaterial);
    this.bareTorsoMesh.castShadow = true;
    this.spineNode.add(this.bareTorsoMesh);

    // Sculpted Navel
    const navelGeo = new THREE.SphereGeometry(0.013, 12, 12);
    navelGeo.scale(0.7, 1.5, 0.4);
    const navel = new THREE.Mesh(navelGeo, new THREE.MeshBasicMaterial({ color: 0xba7465 }));
    navel.position.set(0, 0.025, 0.134);
    this.spineNode.add(navel);

    // Clavicles (graceful collarbone ridge curving into shoulders)
    const clavGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.17, 12);
    const clavLeft = new THREE.Mesh(clavGeo, this.skinMaterial);
    clavLeft.rotation.set(0.12, 0.15, 1.38);
    clavLeft.position.set(-0.095, 0.14, 0.082);
    this.chestNode.add(clavLeft);

    const clavRight = new THREE.Mesh(clavGeo.clone(), this.skinMaterial);
    clavRight.rotation.set(0.12, -0.15, -1.38);
    clavRight.position.set(0.095, 0.14, 0.082);
    this.chestNode.add(clavRight);

    // Trapezius Neck-to-Shoulder Slope (Eliminates pipe-in-box look!)
    const trapGeo = new THREE.ConeGeometry(0.24, 0.16, 24, 1, true, 0, Math.PI);
    trapGeo.scale(1.15, 1, 0.7);
    const trapMesh = new THREE.Mesh(trapGeo, this.skinMaterial);
    trapMesh.rotation.y = Math.PI / 2;
    trapMesh.position.set(0, 0.11, -0.01);
    this.chestNode.add(trapMesh);
  }

  // --- SCULPTED TEARDROP BUST ---
  private buildSculptedBust() {
    const createTeardropBust = (isLeft: boolean) => {
      const geo = new THREE.SphereGeometry(0.122, 32, 32);
      const pos = geo.attributes.position;

      for (let i = 0; i < pos.count; i++) {
        const y = pos.getY(i);
        const z = pos.getZ(i);

        // Lower portion expands forward for gravitational hang
        if (y < 0.04 && z > 0) {
          pos.setZ(i, z * (1.0 + (0.04 - y) * 1.55));
          pos.setY(i, y * 0.91);
        }
        // Upper slope flattens smoothly into chest
        if (y > 0.02 && z > 0) {
          pos.setZ(i, z * (1.0 - y * 0.72));
        }
      }
      geo.computeVertexNormals();

      // Organic volume asymmetry
      const asymmetry = isLeft ? 1.015 : 0.985;
      geo.scale(1.02 * asymmetry, 1.14 * asymmetry, 1.30 * asymmetry);
      return geo;
    };

    this.leftBustGroup.position.set(-0.092, 0.035, 0.142);
    this.chestNode.add(this.leftBustGroup);

    const leftBustGeo = createTeardropBust(true);
    this.leftBustBareMesh = new THREE.Mesh(leftBustGeo, this.skinMaterial);
    this.leftBustBareMesh.rotation.set(-0.16, 0.12, -0.06);
    this.leftBustBareMesh.castShadow = true;
    this.leftBustGroup.add(this.leftBustBareMesh);

    this.leftBustClothedMesh = new THREE.Mesh(leftBustGeo.clone(), this.darkFabricMaterial);
    this.leftBustClothedMesh.rotation.set(-0.16, 0.12, -0.06);
    this.leftBustClothedMesh.castShadow = true;
    this.leftBustGroup.add(this.leftBustClothedMesh);

    this.rightBustGroup.position.set(0.092, 0.035, 0.142);
    this.chestNode.add(this.rightBustGroup);

    const rightBustGeo = createTeardropBust(false);
    this.rightBustBareMesh = new THREE.Mesh(rightBustGeo, this.skinMaterial);
    this.rightBustBareMesh.rotation.set(-0.16, -0.12, 0.06);
    this.rightBustBareMesh.castShadow = true;
    this.rightBustGroup.add(this.rightBustBareMesh);

    this.rightBustClothedMesh = new THREE.Mesh(rightBustGeo.clone(), this.darkFabricMaterial);
    this.rightBustClothedMesh.rotation.set(-0.16, -0.12, 0.06);
    this.rightBustClothedMesh.castShadow = true;
    this.rightBustGroup.add(this.rightBustClothedMesh);
  }

  // --- SCULPTED LEGS (NO CYLINDERS, NATURAL MUSCLE CURVES) ---
  private buildSculptedLegs() {
    // Generate organic thigh geometry (quadriceps bulge, inner thigh line, hip junction flare)
    const createOrganicThigh = (isLeft: boolean) => {
      const rings = 20;
      const segments = 32;
      const geo = new THREE.BufferGeometry();
      const vertices: number[] = [];
      const indices: number[] = [];
      const uvs: number[] = [];

      const height = 0.45;

      for (let r = 0; r <= rings; r++) {
        const v = r / rings;
        const y = -v * height; // Top (hip) to bottom (knee)

        // Diameter thickens toward hip
        // Top: ~0.11. Mid: ~0.095 with quad bulge. Bottom: ~0.074.
        const baseRadius = 0.112 - v * 0.038;

        for (let s = 0; s <= segments; s++) {
          const u = s / segments;
          const angle = u * Math.PI * 2;

          let rx = Math.sin(angle) * baseRadius;
          let rz = Math.cos(angle) * baseRadius;

          // Anterior Quadricep Muscle Swell (Z > 0)
          if (rz > 0 && v > 0.15 && v < 0.8) {
            rz += Math.sin((v - 0.15) / 0.65 * Math.PI) * 0.018;
          }

          // Lateral Trochanter Flare (Outer hip, rx < 0 for left, rx > 0 for right)
          const isOuter = isLeft ? rx < 0 : rx > 0;
          if (isOuter && v < 0.35) {
            rx *= 1.15;
          }

          // Vastus Medialis (Teardrop muscle right above inner knee)
          const isInner = isLeft ? rx > 0 : rx < 0;
          if (isInner && v > 0.65 && v < 0.95) {
            rx *= 1.12;
            rz += 0.008;
          }

          vertices.push(rx, y, rz);
          uvs.push(u, v);
        }
      }

      for (let r = 0; r < rings; r++) {
        for (let s = 0; s < segments; s++) {
          const a = r * (segments + 1) + s;
          const b = (r + 1) * (segments + 1) + s;
          const c = (r + 1) * (segments + 1) + (s + 1);
          const d = r * (segments + 1) + (s + 1);

          indices.push(a, b, d);
          indices.push(b, c, d);
        }
      }

      geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
      geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
      geo.setIndex(indices);
      geo.computeVertexNormals();
      return geo;
    };

    const leftThighGeo = createOrganicThigh(true);
    const leftThigh = new THREE.Mesh(leftThighGeo, this.skinMaterial);
    leftThigh.castShadow = true;
    this.leftThighNode.add(leftThigh);

    const rightThighGeo = createOrganicThigh(false);
    const rightThigh = new THREE.Mesh(rightThighGeo, this.skinMaterial);
    rightThigh.castShadow = true;
    this.rightThighNode.add(rightThigh);

    // Sculpted Knee: Patella plate & infrapatellar fat pad
    const patellaGeo = new THREE.SphereGeometry(0.034, 16, 16);
    patellaGeo.scale(1.0, 1.3, 0.65);

    const leftPatella = new THREE.Mesh(patellaGeo, this.skinMaterial);
    leftPatella.position.set(0, -0.448, 0.054);
    this.leftThighNode.add(leftPatella);

    const rightPatella = new THREE.Mesh(patellaGeo.clone(), this.skinMaterial);
    rightPatella.position.set(0, -0.448, 0.054);
    this.rightThighNode.add(rightPatella);

    // Sculpted Calf: Gastrocnemius Double Belly & Achilles Taper
    const createOrganicCalf = (isLeft: boolean) => {
      const rings = 20;
      const segments = 32;
      const geo = new THREE.BufferGeometry();
      const vertices: number[] = [];
      const indices: number[] = [];
      const uvs: number[] = [];

      const height = 0.45;

      for (let r = 0; r <= rings; r++) {
        const v = r / rings;
        const y = -v * height;

        // Knee joint: ~0.072. Muscle belly at v=0.3-0.5: ~0.082. Ankle at bottom: ~0.042.
        const belly = Math.sin(v * Math.PI) * 0.024;
        const baseRadius = 0.068 + belly - v * 0.032;

        for (let s = 0; s <= segments; s++) {
          const u = s / segments;
          const angle = u * Math.PI * 2;

          let rx = Math.sin(angle) * baseRadius;
          let rz = Math.cos(angle) * baseRadius;

          // Posterior Gastrocnemius Calf Muscle (Z < 0)
          if (rz < 0 && v > 0.15 && v < 0.75) {
            rz -= Math.sin((v - 0.15) / 0.6 * Math.PI) * 0.022;
          }

          // Medial inner belly dips lower than lateral outer belly
          const isInner = isLeft ? rx > 0 : rx < 0;
          if (isInner && rz < 0 && v > 0.35 && v < 0.65) {
            rx *= 1.15;
            rz -= 0.008;
          }

          // Anterior Tibial Crest (Shin bone sharpness)
          if (rz > 0 && Math.abs(rx) < 0.02) {
            rz += 0.005;
          }

          vertices.push(rx, y, rz);
          uvs.push(u, v);
        }
      }

      for (let r = 0; r < rings; r++) {
        for (let s = 0; s < segments; s++) {
          const a = r * (segments + 1) + s;
          const b = (r + 1) * (segments + 1) + s;
          const c = (r + 1) * (segments + 1) + (s + 1);
          const d = r * (segments + 1) + (s + 1);

          indices.push(a, b, d);
          indices.push(b, c, d);
        }
      }

      geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
      geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
      geo.setIndex(indices);
      geo.computeVertexNormals();
      return geo;
    };

    const leftCalfGeo = createOrganicCalf(true);
    const leftCalf = new THREE.Mesh(leftCalfGeo, this.skinMaterial);
    leftCalf.castShadow = true;
    this.leftShinNode.add(leftCalf);

    const rightCalfGeo = createOrganicCalf(false);
    const rightCalf = new THREE.Mesh(rightCalfGeo, this.skinMaterial);
    rightCalf.castShadow = true;
    this.rightShinNode.add(rightCalf);

    // Anatomical Ankle Malleolus Bones
    const ankleGeo = new THREE.SphereGeometry(0.015, 12, 12);
    const leftAnkleMedial = new THREE.Mesh(ankleGeo, this.skinMaterial);
    leftAnkleMedial.position.set(0.036, -0.425, 0);
    this.leftShinNode.add(leftAnkleMedial);

    const leftAnkleLateral = new THREE.Mesh(ankleGeo, this.skinMaterial);
    leftAnkleLateral.position.set(-0.036, -0.435, 0); // Lateral malleolus sits lower
    this.leftShinNode.add(leftAnkleLateral);

    const rightAnkleMedial = new THREE.Mesh(ankleGeo, this.skinMaterial);
    rightAnkleMedial.position.set(-0.036, -0.425, 0);
    this.rightShinNode.add(rightAnkleMedial);

    const rightAnkleLateral = new THREE.Mesh(ankleGeo, this.skinMaterial);
    rightAnkleLateral.position.set(0.036, -0.435, 0);
    this.rightShinNode.add(rightAnkleLateral);

    // Detailed Sculpted Feet with Arch, Heel & Toes
    const createDetailedFoot = () => {
      const footGroup = new THREE.Group();

      const instepGeo = new THREE.BoxGeometry(0.072, 0.054, 0.16);
      const instepMesh = new THREE.Mesh(instepGeo, this.skinMaterial);
      instepMesh.position.set(0, -0.445, 0.035);
      instepMesh.castShadow = true;
      footGroup.add(instepMesh);

      const toeSizes = [0.018, 0.016, 0.015, 0.014, 0.012];
      const toeOffsets = [-0.024, -0.012, 0, 0.012, 0.024];

      for (let i = 0; i < 5; i++) {
        const toeGeo = new THREE.SphereGeometry(toeSizes[i], 10, 10);
        toeGeo.scale(0.85, 0.75, 1.25);
        const toe = new THREE.Mesh(toeGeo, this.skinMaterial);
        toe.position.set(toeOffsets[i], -0.46, 0.118);
        footGroup.add(toe);
      }

      return footGroup;
    };

    this.leftShinNode.add(createDetailedFoot());
    this.rightShinNode.add(createDetailedFoot());
  }

  // --- SCULPTED ARMS & ARTICULATED HANDS ---
  private buildSculptedArms() {
    // Deltoid Shoulder Caps
    const deltoidGeo = new THREE.SphereGeometry(0.065, 20, 20);
    deltoidGeo.scale(1.05, 1.25, 1.15);

    const leftDelt = new THREE.Mesh(deltoidGeo, this.skinMaterial);
    leftDelt.position.set(0, 0.02, 0);
    leftDelt.castShadow = true;
    this.leftUpperArmNode.add(leftDelt);

    const rightDelt = new THREE.Mesh(deltoidGeo.clone(), this.skinMaterial);
    rightDelt.position.set(0, 0.02, 0);
    rightDelt.castShadow = true;
    this.rightUpperArmNode.add(rightDelt);

    // Bicep/Tricep Taper
    const bicepGeo = new THREE.CylinderGeometry(0.050, 0.042, 0.28, 20);
    const leftArmMesh = new THREE.Mesh(bicepGeo, this.skinMaterial);
    leftArmMesh.position.y = -0.14;
    leftArmMesh.castShadow = true;
    this.leftUpperArmNode.add(leftArmMesh);

    const rightArmMesh = new THREE.Mesh(bicepGeo.clone(), this.skinMaterial);
    rightArmMesh.position.y = -0.14;
    rightArmMesh.castShadow = true;
    this.rightUpperArmNode.add(rightArmMesh);

    // Forearm with Brachioradialis Curve & Wrist Transition
    const forearmGeo = new THREE.CylinderGeometry(0.043, 0.033, 0.27, 20);
    const leftForearmMesh = new THREE.Mesh(forearmGeo, this.skinMaterial);
    leftForearmMesh.position.y = -0.135;
    leftForearmMesh.castShadow = true;
    this.leftForearmNode.add(leftForearmMesh);

    const rightForearmMesh = new THREE.Mesh(forearmGeo.clone(), this.skinMaterial);
    rightForearmMesh.position.y = -0.135;
    rightForearmMesh.castShadow = true;
    this.rightForearmNode.add(rightForearmMesh);

    // ARTICULATED HANDS WITH 5 DETAILED FINGERS & PALM PADS
    const createArticulatedHand = (isLeft: boolean) => {
      const handGroup = new THREE.Group();

      // Contoured Palm with thenar pad and knuckles
      const palmGeo = new THREE.BoxGeometry(0.052, 0.068, 0.022);
      const palmMesh = new THREE.Mesh(palmGeo, this.skinMaterial);
      palmMesh.position.y = -0.034;
      palmMesh.castShadow = true;
      handGroup.add(palmMesh);

      // Thenar Eminence (Thumb muscle ball)
      const thenarGeo = new THREE.SphereGeometry(0.016, 12, 12);
      thenarGeo.scale(1.2, 1.4, 0.8);
      const thenar = new THREE.Mesh(thenarGeo, this.skinMaterial);
      thenar.position.set(isLeft ? 0.020 : -0.020, -0.025, 0.012);
      handGroup.add(thenar);

      // Opposed Articulated Thumb
      const thumbGroup = new THREE.Group();
      thumbGroup.position.set(isLeft ? 0.028 : -0.028, -0.024, 0.014);
      thumbGroup.rotation.set(-0.35, 0, isLeft ? 0.65 : -0.65);

      const thumbProximal = new THREE.Mesh(
        new THREE.CylinderGeometry(0.0075, 0.0065, 0.024, 10),
        this.skinMaterial
      );
      thumbProximal.position.y = -0.012;
      thumbGroup.add(thumbProximal);

      const thumbDistal = new THREE.Mesh(
        new THREE.CylinderGeometry(0.0065, 0.0055, 0.020, 10),
        this.skinMaterial
      );
      thumbDistal.position.y = -0.030;
      thumbDistal.rotation.x = 0.25;
      thumbGroup.add(thumbDistal);
      handGroup.add(thumbGroup);

      // 4 Modeled Fingers (Index, Middle, Ring, Pinky in relaxed organic curve)
      const fingerLengths = [0.044, 0.048, 0.044, 0.036];
      const fingerOffsets = isLeft ? [0.018, 0.006, -0.006, -0.018] : [-0.018, -0.006, 0.006, 0.018];

      for (let i = 0; i < 4; i++) {
        const fGroup = new THREE.Group();
        fGroup.position.set(fingerOffsets[i], -0.068, 0.004);
        fGroup.rotation.x = 0.22 + i * 0.04;

        // Knuckle ridge
        const knuckle = new THREE.Mesh(new THREE.SphereGeometry(0.0065, 8, 8), this.skinMaterial);
        fGroup.add(knuckle);

        // Proximal phalanx
        const prox = new THREE.Mesh(
          new THREE.CylinderGeometry(0.006, 0.0055, fingerLengths[i] * 0.55, 10),
          this.skinMaterial
        );
        prox.position.y = -fingerLengths[i] * 0.28;
        fGroup.add(prox);

        // Distal phalanx with pad
        const distal = new THREE.Mesh(
          new THREE.CylinderGeometry(0.0055, 0.0045, fingerLengths[i] * 0.45, 10),
          this.skinMaterial
        );
        distal.position.set(0, -fingerLengths[i] * 0.72, 0.003);
        distal.rotation.x = 0.2;
        fGroup.add(distal);

        handGroup.add(fGroup);
      }

      return handGroup;
    };

    const leftHand = createArticulatedHand(true);
    this.leftForearmNode.add(leftHand);

    const rightHand = createArticulatedHand(false);
    this.rightHandNode.add(rightHand);
  }

  // =========================================================================
  // SCULPTED ADULT FACE & VOLUMETRIC LAYERED HAIR
  // =========================================================================
  private buildSculptedHeadAndHair() {
    // 1. Neck with Sternocleidomastoid Muscle Tone
    const neckGeo = new THREE.CylinderGeometry(0.062, 0.076, 0.15, 24);
    const neckMesh = new THREE.Mesh(neckGeo, this.skinMaterial);
    neckMesh.castShadow = true;
    this.neckNode.add(neckMesh);

    // 2. Sculpted Facial Oval & Jawline
    const headGeo = new THREE.SphereGeometry(0.142, 32, 32);
    headGeo.scale(0.92, 1.08, 0.98);
    const headMesh = new THREE.Mesh(headGeo, this.faceMaterial);
    headMesh.position.set(0, 0.115, 0);
    headMesh.castShadow = true;
    this.headNode.add(headMesh);

    // Feminine Chin & Mandible
    const chinGeo = new THREE.ConeGeometry(0.082, 0.13, 24);
    chinGeo.scale(1.0, 1, 0.68);
    const chinMesh = new THREE.Mesh(chinGeo, this.skinMaterial);
    chinMesh.rotation.x = Math.PI;
    chinMesh.position.set(0, 0.025, 0.04);
    this.headNode.add(chinMesh);

    // Sculpted Nose Bridge & Nostril Wings
    const noseGeo = new THREE.ConeGeometry(0.018, 0.072, 12);
    const noseMesh = new THREE.Mesh(noseGeo, this.skinMaterial);
    noseMesh.rotation.x = -0.32;
    noseMesh.position.set(0, 0.118, 0.138);
    this.headNode.add(noseMesh);

    // 3. LAYERED 3D EYEBALLS WITH REFRACTIVE CORNEA & IRIS
    const create3DEye = (isLeft: boolean) => {
      const eyeGroup = new THREE.Group();

      const irisGeo = new THREE.CircleGeometry(0.028, 24);
      const irisMesh = new THREE.Mesh(irisGeo, this.irisMaterial);
      irisMesh.position.z = 0.028;
      eyeGroup.add(irisMesh);

      const corneaGeo = new THREE.SphereGeometry(0.034, 20, 20);
      const corneaMesh = new THREE.Mesh(corneaGeo, this.eyeCorneaMaterial);
      corneaMesh.scale.set(1, 1, 0.65);
      corneaMesh.position.z = 0.022;
      eyeGroup.add(corneaMesh);

      eyeGroup.position.set(isLeft ? -0.048 : 0.048, 0.132, 0.122);
      return eyeGroup;
    };

    this.headNode.add(create3DEye(true));
    this.headNode.add(create3DEye(false));

    // 4. VOLUMETRIC SCULPTED HAIR & WOVEN BRAIDS
    const hairCrownGeo = new THREE.SphereGeometry(0.162, 32, 32);
    hairCrownGeo.scale(1.02, 1.08, 1.12);
    const hairCrown = new THREE.Mesh(hairCrownGeo, this.hairMaterial);
    hairCrown.position.set(0, 0.135, -0.028);
    hairCrown.castShadow = true;
    this.headNode.add(hairCrown);

    // Layered Curved Fringe Strands (Lime Green Tips)
    const createCurvedBangStrand = (posX: number, rotZ: number, length: number) => {
      const bangGeo = new THREE.ConeGeometry(0.032, length, 16);
      bangGeo.scale(1.2, 1, 0.5);
      const strand = new THREE.Mesh(bangGeo, this.hairMaterial);
      strand.rotation.set(-2.75, 0, rotZ);
      strand.position.set(posX, 0.195, 0.145);
      strand.castShadow = true;
      return strand;
    };

    this.headNode.add(createCurvedBangStrand(0, 0, 0.18));
    this.headNode.add(createCurvedBangStrand(-0.065, 0.38, 0.19));
    this.headNode.add(createCurvedBangStrand(0.065, -0.38, 0.19));
    this.headNode.add(createCurvedBangStrand(-0.11, 0.65, 0.22));
    this.headNode.add(createCurvedBangStrand(0.11, -0.65, 0.22));

    // 5. VOLUMETRIC WOVEN BRAID CHAINS
    const buildWovenBraidChain = (isLeft: boolean): THREE.Group[] => {
      const segments: THREE.Group[] = [];
      const baseGroup = new THREE.Group();
      baseGroup.position.set(isLeft ? -0.135 : 0.135, 0.085, 0.045);
      this.headNode.add(baseGroup);

      let currentParent: THREE.Group = baseGroup;

      for (let i = 0; i < 5; i++) {
        const segGroup = new THREE.Group();
        segGroup.position.set(0, i === 0 ? 0 : -0.115, 0);

        const linkRadius = 0.058 - i * 0.007;
        const linkGeo = new THREE.SphereGeometry(linkRadius, 20, 20);
        linkGeo.scale(1.15, 1.45, 0.95);

        const link1 = new THREE.Mesh(linkGeo, this.hairMaterial);
        link1.rotation.z = (i % 2 === 0 ? 0.35 : -0.35);
        link1.castShadow = true;
        segGroup.add(link1);

        const link2 = new THREE.Mesh(linkGeo.clone(), this.hairMaterial);
        link2.rotation.z = (i % 2 === 0 ? -0.35 : 0.35);
        link2.position.set(0, -0.02, 0.01);
        link2.castShadow = true;
        segGroup.add(link2);

        currentParent.add(segGroup);
        segments.push(segGroup);
        currentParent = segGroup;
      }

      return segments;
    };

    this.leftBraidSegments = buildWovenBraidChain(true);
    this.rightBraidSegments = buildWovenBraidChain(false);

    // Flowing Back Hair Bundle
    this.backHairGroup.position.set(0, 0.08, -0.115);
    const backHairGeo = new THREE.CylinderGeometry(0.115, 0.165, 0.42, 24);
    backHairGeo.scale(1.25, 1, 0.65);
    const backHairMesh = new THREE.Mesh(backHairGeo, this.hairMaterial);
    backHairMesh.position.y = -0.17;
    backHairMesh.castShadow = true;
    this.backHairGroup.add(backHairMesh);
    this.headNode.add(this.backHairGroup);
  }

  // =========================================================================
  // DETAILED COSTUME SYSTEM (Combat Uniform, Haori, Pleated Skirt, Belt)
  // =========================================================================
  private buildCostume() {
    // 1. OUTER FLOWING HAORI (White Silk Robe with Draped Sleeves)
    this.haoriGroup.name = 'HaoriLayer';
    const capeGeo = new THREE.CylinderGeometry(0.245, 0.375, 0.74, 24, 1, true, 0.45, Math.PI * 1.65);
    const haoriCape = new THREE.Mesh(capeGeo, this.whiteFabricMaterial);
    haoriCape.position.set(0, -0.16, -0.045);
    haoriCape.castShadow = true;
    this.haoriGroup.add(haoriCape);

    const sleeveGeo = new THREE.CylinderGeometry(0.092, 0.145, 0.39, 20);
    const leftSleeve = new THREE.Mesh(sleeveGeo, this.whiteFabricMaterial);
    leftSleeve.position.set(0, -0.14, 0);
    leftSleeve.castShadow = true;
    this.leftUpperArmNode.add(leftSleeve);

    const rightSleeve = new THREE.Mesh(sleeveGeo.clone(), this.whiteFabricMaterial);
    rightSleeve.position.set(0, -0.14, 0);
    rightSleeve.castShadow = true;
    this.rightUpperArmNode.add(rightSleeve);

    this.chestNode.add(this.haoriGroup);

    // 2. CORPS COMBAT UNIFORM JACKET (Open Cleavage Placket & Gold Buttons)
    this.jacketGroup.name = 'JacketLayer';
    const jacketTorsoGeo = new THREE.CylinderGeometry(0.178, 0.148, 0.23, 32);
    jacketTorsoGeo.scale(1.14, 1, 0.94);
    const jacketTorso = new THREE.Mesh(jacketTorsoGeo, this.darkFabricMaterial);
    this.jacketGroup.add(jacketTorso);

    const collarGeo = new THREE.CylinderGeometry(0.084, 0.098, 0.065, 24);
    const collar = new THREE.Mesh(collarGeo, this.whiteFabricMaterial);
    collar.position.y = 0.115;
    this.jacketGroup.add(collar);

    for (let i = 0; i < 3; i++) {
      const btnGeo = new THREE.CylinderGeometry(0.013, 0.013, 0.009, 16);
      const btnLeft = new THREE.Mesh(btnGeo, this.goldAccentMaterial);
      btnLeft.rotation.x = Math.PI / 2;
      btnLeft.position.set(-0.112, 0.055 - i * 0.062, 0.125);
      this.jacketGroup.add(btnLeft);

      const btnRight = btnLeft.clone();
      btnRight.position.x = 0.112;
      this.jacketGroup.add(btnRight);
    }

    this.chestNode.add(this.jacketGroup);

    // 3. FLUTED PLEATED MINI SKIRT
    this.skirtGroup.name = 'SkirtLayer';
    const skirtGeo = new THREE.ConeGeometry(0.295, 0.245, 32, 1, true);
    skirtGeo.scale(1.18, 1, 0.98);
    const skirtMesh = new THREE.Mesh(skirtGeo, this.darkFabricMaterial);
    skirtMesh.position.y = -0.085;
    skirtMesh.castShadow = true;
    this.skirtGroup.add(skirtMesh);
    this.pelvisNode.add(this.skirtGroup);

    // 4. WHITE LEATHER BELT & METALLIC BUCKLE
    this.beltGroup.name = 'BeltLayer';
    const beltGeo = new THREE.CylinderGeometry(0.19, 0.19, 0.052, 32);
    beltGeo.scale(1.12, 1, 0.94);
    const beltMesh = new THREE.Mesh(beltGeo, this.whiteFabricMaterial);
    beltMesh.position.y = 0.085;
    this.beltGroup.add(beltMesh);

    const buckle = new THREE.Mesh(
      new THREE.BoxGeometry(0.046, 0.056, 0.016),
      new THREE.MeshStandardMaterial({ color: 0xe6edf5, roughness: 0.18, metalness: 0.92 })
    );
    buckle.position.set(0, 0.085, 0.182);
    this.beltGroup.add(buckle);
    this.pelvisNode.add(this.beltGroup);

    // 5. STRIPED THIGH-HIGH STOCKINGS
    this.stockingsGroup.name = 'StockingsLayer';
    const sockThighGeo = new THREE.CylinderGeometry(0.112, 0.078, 0.33, 24);
    const leftSockThigh = new THREE.Mesh(sockThighGeo, this.stockingsMaterial);
    leftSockThigh.position.y = -0.285;
    this.leftThighNode.add(leftSockThigh);

    const rightSockThigh = new THREE.Mesh(sockThighGeo.clone(), this.stockingsMaterial);
    rightSockThigh.position.y = -0.285;
    this.rightThighNode.add(rightSockThigh);

    const sockCalfGeo = new THREE.CylinderGeometry(0.078, 0.048, 0.45, 24);
    const leftSockCalf = new THREE.Mesh(sockCalfGeo, this.stockingsMaterial);
    leftSockCalf.position.y = -0.225;
    this.leftShinNode.add(leftSockCalf);

    const rightSockCalf = new THREE.Mesh(sockCalfGeo.clone(), this.stockingsMaterial);
    rightSockCalf.position.y = -0.225;
    this.rightShinNode.add(rightSockCalf);

    const ribbonMat = new THREE.MeshStandardMaterial({ color: 0xf43f5e, roughness: 0.42 });
    const laceRing = new THREE.Mesh(new THREE.TorusGeometry(0.066, 0.009, 10, 24), ribbonMat);
    laceRing.rotation.x = Math.PI / 2;
    laceRing.position.y = -0.385;
    this.leftShinNode.add(laceRing);

    const laceRingRight = laceRing.clone();
    this.rightShinNode.add(laceRingRight);
  }

  // =========================================================================
  // NICHIRIN KATANA & FOUR-LEAF CLOVER HEART TSUBA
  // =========================================================================
  private buildNichirinSword() {
    this.swordSheathedGroup.position.set(-0.215, 0.02, 0.025);
    this.swordSheathedGroup.rotation.set(0.3, 0.2, 0.7);

    const scabbardGeo = new THREE.BoxGeometry(0.034, 0.78, 0.018);
    const scabbard = new THREE.Mesh(
      scabbardGeo,
      new THREE.MeshStandardMaterial({ color: 0x111622, roughness: 0.32, metalness: 0.45 })
    );
    scabbard.position.y = -0.33;
    scabbard.castShadow = true;
    this.swordSheathedGroup.add(scabbard);

    const tsuba = new THREE.Mesh(
      new THREE.CylinderGeometry(0.052, 0.052, 0.014, 20),
      new THREE.MeshStandardMaterial({ color: 0xf43f5e, roughness: 0.28, metalness: 0.75 })
    );
    tsuba.position.y = 0.055;
    this.swordSheathedGroup.add(tsuba);

    const tsuka = new THREE.Mesh(
      new THREE.CylinderGeometry(0.019, 0.019, 0.23, 14),
      new THREE.MeshStandardMaterial({ color: 0x84cc16, roughness: 0.55 })
    );
    tsuka.position.y = 0.17;
    this.swordSheathedGroup.add(tsuka);

    this.pelvisNode.add(this.swordSheathedGroup);

    this.swordHandGroup.position.set(0, -0.065, 0.055);
    this.swordHandGroup.rotation.x = -Math.PI / 2;

    const bladeGeo = new THREE.BoxGeometry(0.026, 0.90, 0.009);
    const blade = new THREE.Mesh(bladeGeo, this.bladeMaterial);
    blade.position.y = 0.45;
    blade.castShadow = true;
    this.swordHandGroup.add(blade);

    const handTsuba = tsuba.clone();
    handTsuba.position.y = 0;
    this.swordHandGroup.add(handTsuba);

    const handTsuka = tsuka.clone();
    handTsuka.position.y = -0.115;
    this.swordHandGroup.add(handTsuka);

    this.rightHandNode.add(this.swordHandGroup);
    this.swordHandGroup.visible = false;
  }

  // =========================================================================
  // APPEARANCE MODES: Full Uniform / Revealing / Artistic Unclothed Study
  // =========================================================================
  public setAppearanceMode(mode: AppearanceMode) {
    this.appearanceMode = mode;

    if (mode === 'full') {
      this.layers.haori = true;
      this.layers.jacket = true;
      this.layers.skirt = true;
      this.layers.stockings = true;
      this.layers.belt = true;
      this.layers.sword = true;
    } else if (mode === 'revealing') {
      this.layers.haori = false;
      this.layers.jacket = true;
      this.layers.skirt = true;
      this.layers.stockings = true;
      this.layers.belt = true;
      this.layers.sword = true;
    } else if (mode === 'unclothed') {
      this.layers.haori = false;
      this.layers.jacket = false;
      this.layers.skirt = false;
      this.layers.stockings = false;
      this.layers.belt = false;
      this.layers.sword = false;
    }

    this.applyLayerVisibility();
  }

  public toggleLayer(layerKey: keyof CostumeLayers) {
    this.layers[layerKey] = !this.layers[layerKey];
    this.applyLayerVisibility();
  }

  public setSwordInHand(inHand: boolean) {
    this.layers.swordInHand = inHand;
    this.swordSheathedGroup.visible = this.layers.sword && !inHand;
    this.swordHandGroup.visible = this.layers.sword && inHand;
  }

  public applyLayerVisibility() {
    this.haoriGroup.visible = this.layers.haori;
    this.jacketGroup.visible = this.layers.jacket;
    this.skirtGroup.visible = this.layers.skirt;
    this.beltGroup.visible = this.layers.belt;

    // Toggle Bust Meshes (Bare Teardrop vs Clothed)
    if (this.layers.jacket) {
      this.leftBustClothedMesh.visible = true;
      this.leftBustBareMesh.visible = false;
      this.rightBustClothedMesh.visible = true;
      this.rightBustBareMesh.visible = false;
    } else {
      this.leftBustClothedMesh.visible = false;
      this.leftBustBareMesh.visible = true;
      this.rightBustClothedMesh.visible = false;
      this.rightBustBareMesh.visible = true;
    }

    // Toggle Stockings
    const showSocks = this.layers.stockings;
    this.leftThighNode.children.forEach((c) => {
      if ((c as any).material === this.stockingsMaterial) c.visible = showSocks;
    });
    this.rightThighNode.children.forEach((c) => {
      if ((c as any).material === this.stockingsMaterial) c.visible = showSocks;
    });
    this.leftShinNode.children.forEach((c) => {
      if ((c as any).material === this.stockingsMaterial) c.visible = showSocks;
    });
    this.rightShinNode.children.forEach((c) => {
      if ((c as any).material === this.stockingsMaterial) c.visible = showSocks;
    });

    // Sword state
    this.swordSheathedGroup.visible = this.layers.sword && !this.layers.swordInHand;
    this.swordHandGroup.visible = this.layers.sword && this.layers.swordInHand;
  }

  public setExpression(expr: FacialExpression) {
    this.expression = expr;
    const oldMat = this.faceMaterial;
    this.faceMaterial = this.createRealisticFaceMaterial(expr, oldMat.bumpMap as THREE.Texture);
    this.headNode.children.forEach((c) => {
      if (c instanceof THREE.Mesh && (c.material === oldMat || (c.material as any).map)) {
        c.material = this.faceMaterial;
      }
    });
  }

  public setSkinSheen(val: number) {
    this.skinSheen = val;
    this.skinMaterial.roughness = THREE.MathUtils.lerp(0.55, 0.22, val);
    this.skinMaterial.clearcoat = THREE.MathUtils.lerp(0.08, 0.45, val);
    this.skinMaterial.sheen = THREE.MathUtils.lerp(0.35, 1.0, val);
  }

  // =========================================================================
  // DYNAMIC UPDATE: Organic Soft-Body Deformation & Rotational Tilt
  // =========================================================================
  public updatePhysics(_dt: number) {
    // 1. Dual-Mass Teardrop Bust Soft Dynamics (Position Offset + Rotational Tilt)
    const leftOffset = this.dynamics.getLeftBustOffset();
    const rightOffset = this.dynamics.getRightBustOffset();
    const leftRot = this.dynamics.getLeftBustRotation();
    const rightRot = this.dynamics.getRightBustRotation();

    this.leftBustGroup.position.set(
      -0.092 + leftOffset.x,
      0.035 + leftOffset.y,
      0.142 + leftOffset.z
    );
    this.leftBustGroup.rotation.set(
      -0.16 + leftRot.x,
      0.12 + leftRot.y,
      -0.06 + leftRot.z
    );

    this.rightBustGroup.position.set(
      0.092 + rightOffset.x,
      0.035 + rightOffset.y,
      0.142 + rightOffset.z
    );
    this.rightBustGroup.rotation.set(
      -0.16 + rightRot.x,
      -0.12 + rightRot.y,
      0.06 + rightRot.z
    );

    // 2. Spring Chain Hair Braids
    const leftBraidRots = this.dynamics.getBraidRotations(true);
    for (let i = 0; i < Math.min(this.leftBraidSegments.length, leftBraidRots.length); i++) {
      const seg = this.leftBraidSegments[i];
      seg.rotation.x = leftBraidRots[i].rotX;
      seg.rotation.z = leftBraidRots[i].rotZ;
    }

    const rightBraidRots = this.dynamics.getBraidRotations(false);
    for (let i = 0; i < Math.min(this.rightBraidSegments.length, rightBraidRots.length); i++) {
      const seg = this.rightBraidSegments[i];
      seg.rotation.x = rightBraidRots[i].rotX;
      seg.rotation.z = rightBraidRots[i].rotZ;
    }

    // 3. Fabric Sway in Wind
    const wind = this.dynamics.currentWindVector;
    this.haoriGroup.rotation.x = -wind.z * 0.22;
    this.haoriGroup.rotation.z = wind.x * 0.22;
    this.skirtGroup.rotation.x = -wind.z * 0.12;
    this.skirtGroup.rotation.z = wind.x * 0.12;
  }
}
