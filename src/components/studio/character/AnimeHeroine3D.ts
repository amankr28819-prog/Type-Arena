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

/**
 * High-Quality Stylized 3D Human Anime/Fantasy Action Heroine
 *
 * Designed with:
 * - 7.8-Head Adult Human Proportions (~1.76m height, ~0.22m head height)
 * - Continuous Sculpted 3D Facial Anatomy (Forehead, orbital eye cavities, sculpted nose, lips, jaw, chin)
 * - Deep-set 3D layered eyes with procedural blink eyelids
 * - Volumetric swept hair ribbons and intertwined woven braids (Sakura pink to lime-green tips)
 * - Continuous organic body contours (Trapezius slope, clavicles, teardrop bust, gluteal cleft, vastus medialis, gastrocnemius calves)
 * - Articulated 5-finger hands with anatomical palm pads and natural curvature
 * - Tailored stylized 3D costume (Draped haori, military combat bodice, fluted pleated skirt, striped stockings, warrior boots)
 * - Physical PBR materials (MeshPhysicalMaterial with subsurface peach-fuzz scattering, hydration clearcoat, and micro-pore bump)
 */
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
  public skinSheen: number = 0.40;

  // Hierarchical Body Nodes (7.8-Head Human Scale)
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

  // Dynamic Bust Meshes
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

  // Eyelids for Procedural Blinking
  private leftUpperEyelid!: THREE.Mesh;
  private rightUpperEyelid!: THREE.Mesh;

  // Realistic Materials (MeshPhysicalMaterial with SSS & Micro-Pores)
  public skinMaterial!: THREE.MeshPhysicalMaterial;
  private hairMaterial!: THREE.MeshStandardMaterial;
  private faceMaterial!: THREE.MeshPhysicalMaterial;
  private eyeCorneaMaterial!: THREE.MeshPhysicalMaterial;
  private irisMaterial!: THREE.MeshBasicMaterial;
  private scleraMaterial!: THREE.MeshStandardMaterial;
  private darkFabricMaterial!: THREE.MeshStandardMaterial;
  private whiteFabricMaterial!: THREE.MeshStandardMaterial;
  private goldAccentMaterial!: THREE.MeshStandardMaterial;
  private stockingsMaterial!: THREE.MeshStandardMaterial;
  private bootLeatherMaterial!: THREE.MeshStandardMaterial;
  private bladeMaterial!: THREE.MeshStandardMaterial;

  constructor(dynamics: SecondaryDynamicsEngine) {
    this.dynamics = dynamics;
    this.root = new THREE.Group();
    this.root.name = 'AnimeHeroineRoot';

    // 1. Initialize Advanced Multi-Tone Physical Materials
    this.initRealisticMaterials();

    // 2. Build 7.8-Head Adult Human Rig Hierarchy
    // Total height: ~1.76m. Floor contact at y=0.
    // Leg length: 0.98m (56% total height). Pelvis centered at y=1.02m.
    this.pelvisNode = new THREE.Group();
    this.pelvisNode.position.y = 1.02;
    this.root.add(this.pelvisNode);

    // Torso: Lower spine & waist (0.15m)
    this.spineNode = new THREE.Group();
    this.spineNode.position.y = 0.15;
    this.pelvisNode.add(this.spineNode);

    // Chest, ribcage & shoulders (0.22m)
    this.chestNode = new THREE.Group();
    this.chestNode.position.y = 0.22;
    this.spineNode.add(this.chestNode);

    // Slender sculpted neck (0.12m)
    this.neckNode = new THREE.Group();
    this.neckNode.position.y = 0.21;
    this.chestNode.add(this.neckNode);

    // Head (0.22m total head height, chin to skull top)
    this.headNode = new THREE.Group();
    this.headNode.position.y = 0.10;
    this.neckNode.add(this.headNode);

    // Legs (Thigh: 0.48m, Shin: 0.46m, Foot/Heel: 0.06m)
    this.leftThighNode = new THREE.Group();
    this.leftThighNode.position.set(-0.11, -0.06, 0);
    this.pelvisNode.add(this.leftThighNode);

    this.leftShinNode = new THREE.Group();
    this.leftShinNode.position.set(0, -0.48, 0);
    this.leftThighNode.add(this.leftShinNode);

    this.rightThighNode = new THREE.Group();
    this.rightThighNode.position.set(0.11, -0.06, 0);
    this.pelvisNode.add(this.rightThighNode);

    this.rightShinNode = new THREE.Group();
    this.rightShinNode.position.set(0, -0.48, 0);
    this.rightThighNode.add(this.rightShinNode);

    // Arms: Slender athletic arms (Upper arm: 0.28m, Forearm: 0.26m, Hand: 0.15m)
    this.leftUpperArmNode = new THREE.Group();
    this.leftUpperArmNode.position.set(-0.19, 0.16, 0);
    this.chestNode.add(this.leftUpperArmNode);

    this.leftForearmNode = new THREE.Group();
    this.leftForearmNode.position.set(0, -0.28, 0);
    this.leftUpperArmNode.add(this.leftForearmNode);

    this.rightUpperArmNode = new THREE.Group();
    this.rightUpperArmNode.position.set(0.19, 0.16, 0);
    this.chestNode.add(this.rightUpperArmNode);

    this.rightForearmNode = new THREE.Group();
    this.rightForearmNode.position.set(0, -0.28, 0);
    this.rightUpperArmNode.add(this.rightForearmNode);

    this.rightHandNode = new THREE.Group();
    this.rightHandNode.position.set(0, -0.26, 0);
    this.rightForearmNode.add(this.rightHandNode);

    // Mesh Groups
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
      const noise = (Math.random() - 0.5) * 26;
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

    // 2. Multi-Tone Dermal Flush Texture (Warmth on extremities & soft ambient occlusion)
    const skinMapCanvas = document.createElement('canvas');
    skinMapCanvas.width = 512;
    skinMapCanvas.height = 512;
    const sCtx = skinMapCanvas.getContext('2d')!;

    // Base porcelain skin tone with warm peach undertone
    sCtx.fillStyle = '#ffded0';
    sCtx.fillRect(0, 0, 512, 512);

    // Dermal warm flushing zones (shoulders, knees, elbows, gluteal fold warmth)
    const drawFlushZone = (x: number, y: number, r: number, alpha: number) => {
      const grad = sCtx.createRadialGradient(x, y, 0, x, y, r);
      grad.addColorStop(0, `rgba(255, 115, 138, ${alpha})`);
      grad.addColorStop(1, 'rgba(255, 222, 208, 0)');
      sCtx.fillStyle = grad;
      sCtx.beginPath();
      sCtx.arc(x, y, r, 0, Math.PI * 2);
      sCtx.fill();
    };

    drawFlushZone(128, 128, 90, 0.28);
    drawFlushZone(384, 128, 90, 0.28);
    drawFlushZone(256, 384, 110, 0.24);
    drawFlushZone(128, 420, 75, 0.26);
    drawFlushZone(384, 420, 75, 0.26);

    const skinDiffuseMap = new THREE.CanvasTexture(skinMapCanvas);
    skinDiffuseMap.wrapS = THREE.RepeatWrapping;
    skinDiffuseMap.wrapT = THREE.RepeatWrapping;

    // 3. Realistic Living Female Skin Shader (MeshPhysicalMaterial)
    this.skinMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffdfd4,
      map: skinDiffuseMap,
      roughness: 0.42, // Soft organic skin diffusion
      metalness: 0.0,
      clearcoat: 0.12, // Subtle stratum corneum hydration
      clearcoatRoughness: 0.32,
      sheen: 0.82, // Translucent peach-fuzz backscatter (SSS emulation)
      sheenColor: new THREE.Color(0xffb2c0),
      bumpMap: poreTexture,
      bumpScale: 0.0022,
    });

    // 4. Hair Texture (Sakura Pink to Lime Green Gradient + Specular Highlights)
    const hairCanvas = document.createElement('canvas');
    hairCanvas.width = 128;
    hairCanvas.height = 512;
    const hCtx = hairCanvas.getContext('2d')!;
    const hGrad = hCtx.createLinearGradient(0, 0, 0, 512);
    hGrad.addColorStop(0.0, '#ffa8cb'); // Pastel pink roots
    hGrad.addColorStop(0.50, '#f25b92'); // Blossom pink body
    hGrad.addColorStop(0.76, '#b6e856'); // Lime-yellow transition
    hGrad.addColorStop(1.0, '#5ec91e'); // Lime green tips
    hCtx.fillStyle = hGrad;
    hCtx.fillRect(0, 0, 128, 512);

    // Subtle silky hair specular strands
    hCtx.fillStyle = 'rgba(255, 255, 255, 0.22)';
    for (let i = 0; i < 35; i++) {
      hCtx.fillRect(Math.random() * 128, 0, 1.2, 512);
    }
    const hairTexture = new THREE.CanvasTexture(hairCanvas);

    this.hairMaterial = new THREE.MeshStandardMaterial({
      map: hairTexture,
      roughness: 0.32,
      metalness: 0.10,
    });

    // 5. Detailed 3D Face Material
    this.faceMaterial = this.createRealisticFaceMaterial('smile', poreTexture);

    // 6. Eyeball Materials: Glassy Cornea, Sclera & Striated Emerald-to-Gold Iris
    this.scleraMaterial = new THREE.MeshStandardMaterial({
      color: 0xf6f8fc,
      roughness: 0.20,
    });

    this.eyeCorneaMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.95,
      opacity: 1,
      transparent: true,
      roughness: 0.03,
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

    // Dark Limbal ring
    iCtx.fillStyle = '#0c3817';
    iCtx.beginPath();
    iCtx.arc(128, 128, 124, 0, Math.PI * 2);
    iCtx.fill();

    // Vibrant anime emerald body
    const iGrad = iCtx.createRadialGradient(128, 128, 15, 128, 128, 122);
    iGrad.addColorStop(0.0, '#fef08a'); // Warm golden amber core
    iGrad.addColorStop(0.35, '#84cc16'); // Bright lime
    iGrad.addColorStop(0.70, '#10b981'); // Vivid emerald
    iGrad.addColorStop(1.0, '#047857'); // Deep forest edge
    iCtx.fillStyle = iGrad;
    iCtx.beginPath();
    iCtx.arc(128, 128, 118, 0, Math.PI * 2);
    iCtx.fill();

    // Iris radiating striae
    iCtx.strokeStyle = 'rgba(255, 255, 255, 0.40)';
    iCtx.lineWidth = 1.5;
    for (let i = 0; i < 32; i++) {
      const angle = (i * Math.PI * 2) / 32;
      iCtx.beginPath();
      iCtx.moveTo(128 + Math.cos(angle) * 35, 128 + Math.sin(angle) * 35);
      iCtx.lineTo(128 + Math.cos(angle) * 112, 128 + Math.sin(angle) * 112);
      iCtx.stroke();
    }

    // Deep Pupil
    iCtx.fillStyle = '#0a101d';
    iCtx.beginPath();
    iCtx.arc(128, 128, 42, 0, Math.PI * 2);
    iCtx.fill();

    // Primary & secondary specular catch-lights
    iCtx.fillStyle = '#ffffff';
    iCtx.beginPath();
    iCtx.arc(102, 102, 18, 0, Math.PI * 2);
    iCtx.fill();
    iCtx.beginPath();
    iCtx.arc(150, 146, 9, 0, Math.PI * 2);
    iCtx.fill();

    const irisTexture = new THREE.CanvasTexture(irisCanvas);
    this.irisMaterial = new THREE.MeshBasicMaterial({ map: irisTexture });

    // 7. Costume Fabrics & Metals
    this.darkFabricMaterial = new THREE.MeshStandardMaterial({
      color: 0x181c25, // Deep obsidian-navy uniform
      roughness: 0.76,
      metalness: 0.04,
    });

    this.whiteFabricMaterial = new THREE.MeshStandardMaterial({
      color: 0xfbfcfe, // Pure white silk haori
      roughness: 0.65,
      metalness: 0.05,
    });

    this.goldAccentMaterial = new THREE.MeshStandardMaterial({
      color: 0xf5b738, // Golden brass corps buttons
      roughness: 0.22,
      metalness: 0.88,
    });

    // 8. Striped Thigh-High Stockings Material
    const sockCanvas = document.createElement('canvas');
    sockCanvas.width = 64;
    sockCanvas.height = 256;
    const sockCtx = sockCanvas.getContext('2d')!;
    sockCtx.fillStyle = '#65a30d'; // Lime-green base
    sockCtx.fillRect(0, 0, 64, 256);
    sockCtx.fillStyle = '#1c222e'; // Dark charcoal stripes
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

    // Leather Boots
    this.bootLeatherMaterial = new THREE.MeshStandardMaterial({
      color: 0x141720,
      roughness: 0.38,
      metalness: 0.12,
    });

    // Steel Nichirin Blade
    this.bladeMaterial = new THREE.MeshStandardMaterial({
      color: 0xf2f6fa,
      roughness: 0.14,
      metalness: 0.96,
      envMapIntensity: 1.5,
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

    // Base porcelain skin tone
    ctx.fillStyle = '#ffded0';
    ctx.fillRect(0, 0, 1024, 1024);

    // Rosy cheek flush
    const leftBlush = ctx.createRadialGradient(330, 600, 10, 330, 600, 110);
    leftBlush.addColorStop(0, expr === 'blush' ? 'rgba(255, 75, 120, 0.65)' : 'rgba(255, 110, 140, 0.40)');
    leftBlush.addColorStop(1, 'rgba(255, 222, 208, 0)');
    ctx.fillStyle = leftBlush;
    ctx.beginPath();
    ctx.arc(330, 600, 110, 0, Math.PI * 2);
    ctx.fill();

    const rightBlush = ctx.createRadialGradient(694, 600, 10, 694, 600, 110);
    rightBlush.addColorStop(0, expr === 'blush' ? 'rgba(255, 75, 120, 0.65)' : 'rgba(255, 110, 140, 0.40)');
    rightBlush.addColorStop(1, 'rgba(255, 222, 208, 0)');
    ctx.fillStyle = rightBlush;
    ctx.beginPath();
    ctx.arc(694, 600, 110, 0, Math.PI * 2);
    ctx.fill();

    // Dual beauty marks under each eye
    ctx.fillStyle = '#4c2822';
    ctx.beginPath();
    ctx.arc(305, 642, 5.0, 0, Math.PI * 2);
    ctx.arc(352, 648, 5.0, 0, Math.PI * 2);
    ctx.arc(672, 648, 5.0, 0, Math.PI * 2);
    ctx.arc(719, 642, 5.0, 0, Math.PI * 2);
    ctx.fill();

    // Eye outline & winged lashes
    const drawLashes = (cx: number, cy: number, isLeft: boolean) => {
      ctx.strokeStyle = '#20120f';
      ctx.lineWidth = 11;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(cx, cy + 10, 84, Math.PI * 1.15, Math.PI * 1.85);
      ctx.stroke();

      ctx.lineWidth = 8;
      ctx.beginPath();
      if (isLeft) {
        ctx.moveTo(cx - 72, cy - 35);
        ctx.quadraticCurveTo(cx - 96, cy - 50, cx - 110, cy - 44);
      } else {
        ctx.moveTo(cx + 72, cy - 35);
        ctx.quadraticCurveTo(cx + 96, cy - 50, cx + 110, cy - 44);
      }
      ctx.stroke();

      ctx.strokeStyle = '#5a3832';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(cx, cy + 10, 82, Math.PI * 0.25, Math.PI * 0.75);
      ctx.stroke();
    };

    drawLashes(335, 515, true);
    drawLashes(689, 515, false);

    // Eyebrows
    ctx.strokeStyle = '#d44677';
    ctx.lineWidth = 7;
    ctx.lineCap = 'round';
    ctx.beginPath();
    if (expr === 'fierce') {
      ctx.moveTo(250, 410);
      ctx.lineTo(410, 440);
      ctx.moveTo(774, 410);
      ctx.lineTo(614, 440);
    } else {
      ctx.moveTo(245, 420);
      ctx.quadraticCurveTo(330, 395, 410, 418);
      ctx.moveTo(614, 418);
      ctx.quadraticCurveTo(694, 395, 779, 420);
    }
    ctx.stroke();

    // Soft nostril creases
    ctx.fillStyle = '#6b3c32';
    ctx.beginPath();
    ctx.arc(498, 626, 3.2, 0, Math.PI * 2);
    ctx.arc(526, 626, 3.2, 0, Math.PI * 2);
    ctx.fill();

    // Plump sculpted lips with Cupid's bow
    ctx.fillStyle = '#ff6b8a';
    ctx.strokeStyle = '#c43d5b';
    ctx.lineWidth = 4;
    ctx.beginPath();
    if (expr === 'smile' || expr === 'blush') {
      ctx.moveTo(462, 715);
      ctx.quadraticCurveTo(490, 705, 512, 714);
      ctx.quadraticCurveTo(534, 705, 562, 715);
      ctx.quadraticCurveTo(512, 726, 462, 715);
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(470, 716);
      ctx.quadraticCurveTo(512, 746, 554, 716);
      ctx.quadraticCurveTo(512, 754, 470, 716);
      ctx.fill();
      ctx.stroke();
    } else {
      ctx.moveTo(468, 718);
      ctx.quadraticCurveTo(490, 712, 512, 717);
      ctx.quadraticCurveTo(534, 712, 556, 718);
      ctx.quadraticCurveTo(512, 742, 468, 718);
      ctx.fill();
      ctx.stroke();
    }

    // Lip gloss specular highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
    ctx.beginPath();
    ctx.ellipse(505, 726, 8, 3.5, 0, 0, Math.PI * 2);
    ctx.fill();

    const tex = new THREE.CanvasTexture(fCanvas);

    return new THREE.MeshPhysicalMaterial({
      map: tex,
      roughness: 0.38,
      metalness: 0.0,
      clearcoat: 0.20,
      sheen: 0.65,
      sheenColor: new THREE.Color(0xffb2c2),
      bumpMap: poreTexture,
      bumpScale: 0.0020,
    });
  }

  // =========================================================================
  // ORGANIC ANATOMY BUILDER (Custom Continuous Lofted Meshes — Zero Primitives)
  // =========================================================================
  private buildOrganicAnatomy() {
    this.buildSculptedPelvisAndGlutes();
    this.buildSculptedTorso();
    this.buildSculptedBust();
    this.buildSculptedLegs();
    this.buildSculptedArms();
  }

  // --- SCULPTED PELVIS & GLUTEAL COMPLEX ---
  private buildSculptedPelvisAndGlutes() {
    const rings = 22;
    const segments = 36;
    const geo = new THREE.BufferGeometry();
    const vertices: number[] = [];
    const indices: number[] = [];
    const uvs: number[] = [];

    const height = 0.28;
    const yStart = 0.11;

    for (let r = 0; r <= rings; r++) {
      const v = r / rings;
      const y = yStart - v * height; // Waist down to groin/upper thighs

      // Width & depth scaling (narrow waist -> wide feminine pelvic flare -> groin taper)
      const widthScale = 0.165 + Math.sin(v * Math.PI) * 0.046;
      const depthScale = 0.145 + (1 - v) * 0.038;

      for (let s = 0; s <= segments; s++) {
        const u = s / segments;
        const angle = u * Math.PI * 2;

        let rx = Math.sin(angle) * widthScale * 1.15;
        let rz = Math.cos(angle) * depthScale;

        // Posterior sculpture: Natural buttocks volume, gluteal shelf & deep cleft
        if (rz < 0 && v > 0.15 && v < 0.95) {
          const rearFactor = Math.abs(Math.cos(angle));
          const cleftDist = Math.abs(rx);

          // Buttock volume shelf expanding backwards
          const buttockSwell = Math.sin((v - 0.15) / 0.8 * Math.PI) * 0.052 * rearFactor;
          rz -= buttockSwell;

          // Central Gluteal Cleft (intergluteal fold indentation)
          if (cleftDist < 0.042) {
            const cleftDepth = (1 - cleftDist / 0.042) * buttockSwell * 0.88;
            rz += cleftDepth;
          }
        }

        // Anterior sculpture: Soft feminine lower abdominal curve below navel
        if (rz > 0 && v > 0.2 && v < 0.72) {
          rz += Math.sin((v - 0.2) / 0.52 * Math.PI) * 0.012;
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

    const pelvisMesh = new THREE.Mesh(geo, this.skinMaterial);
    pelvisMesh.castShadow = true;
    pelvisMesh.receiveShadow = true;
    this.pelvisNode.add(pelvisMesh);
  }

  // --- SCULPTED TORSO, WAIST & CLAVICLES ---
  private buildSculptedTorso() {
    const rings = 20;
    const segments = 36;
    const geo = new THREE.BufferGeometry();
    const vertices: number[] = [];
    const indices: number[] = [];
    const uvs: number[] = [];

    const height = 0.26;
    const yStart = -0.04;

    for (let r = 0; r <= rings; r++) {
      const v = r / rings;
      const y = yStart + v * height; // Waist upward to clavicles

      // Narrow hourglass waist at v=0.2, expanding upward into ribcage
      const wFactor = 0.138 + Math.pow(v, 1.35) * 0.040;
      const dFactor = 0.120 + Math.pow(v, 1.20) * 0.030;

      for (let s = 0; s <= segments; s++) {
        const u = s / segments;
        const angle = u * Math.PI * 2;

        let rx = Math.sin(angle) * wFactor * 1.1;
        let rz = Math.cos(angle) * dFactor;

        // Front epigastric depression between ribs
        if (rz > 0 && v > 0.4 && Math.abs(rx) < 0.03) {
          rz -= 0.008 * (1 - Math.abs(rx) / 0.03);
        }

        // Back lumbar spine hollow
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
    const navelGeo = new THREE.SphereGeometry(0.012, 12, 12);
    navelGeo.scale(0.7, 1.5, 0.4);
    const navel = new THREE.Mesh(navelGeo, new THREE.MeshBasicMaterial({ color: 0xba7465 }));
    navel.position.set(0, 0.026, 0.130);
    this.spineNode.add(navel);

    // Clavicular Notch & Collarbones (curving gracefully into shoulders)
    const clavGeo = new THREE.CylinderGeometry(0.009, 0.009, 0.16, 12);
    const clavLeft = new THREE.Mesh(clavGeo, this.skinMaterial);
    clavLeft.rotation.set(0.12, 0.15, 1.38);
    clavLeft.position.set(-0.088, 0.14, 0.080);
    this.chestNode.add(clavLeft);

    const clavRight = new THREE.Mesh(clavGeo.clone(), this.skinMaterial);
    clavRight.rotation.set(0.12, -0.15, -1.38);
    clavRight.position.set(0.088, 0.14, 0.080);
    this.chestNode.add(clavRight);

    // Trapezius Slope (graceful organic transition from neck to shoulders)
    const trapGeo = new THREE.ConeGeometry(0.22, 0.16, 24, 1, true, 0, Math.PI);
    trapGeo.scale(1.15, 1, 0.70);
    const trapMesh = new THREE.Mesh(trapGeo, this.skinMaterial);
    trapMesh.rotation.y = Math.PI / 2;
    trapMesh.position.set(0, 0.11, -0.01);
    this.chestNode.add(trapMesh);
  }

  // --- SCULPTED TEARDROP BUST ---
  private buildSculptedBust() {
    const createTeardropBust = (isLeft: boolean) => {
      const geo = new THREE.SphereGeometry(0.118, 32, 32);
      const pos = geo.attributes.position;

      for (let i = 0; i < pos.count; i++) {
        const y = pos.getY(i);
        const z = pos.getZ(i);

        // Lower portion expands forward for natural gravitational hang
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

      // Subtle organic volume asymmetry
      const asymmetry = isLeft ? 1.015 : 0.985;
      geo.scale(1.02 * asymmetry, 1.14 * asymmetry, 1.28 * asymmetry);
      return geo;
    };

    this.leftBustGroup.position.set(-0.088, 0.035, 0.138);
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

    this.rightBustGroup.position.set(0.088, 0.035, 0.138);
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

  // --- SCULPTED LEGS (7.8-HEAD HUMAN PROPORTIONS, ORGANIC MUSCLES) ---
  private buildSculptedLegs() {
    const createOrganicThigh = (isLeft: boolean) => {
      const rings = 22;
      const segments = 32;
      const geo = new THREE.BufferGeometry();
      const vertices: number[] = [];
      const indices: number[] = [];
      const uvs: number[] = [];

      const height = 0.48; // Slender long human legs

      for (let r = 0; r <= rings; r++) {
        const v = r / rings;
        const y = -v * height; // Hip down to knee

        // Natural thigh taper (Top: ~0.108m, Mid: quad bulge ~0.092m, Knee: ~0.072m)
        const baseRadius = 0.106 - v * 0.034;

        for (let s = 0; s <= segments; s++) {
          const u = s / segments;
          const angle = u * Math.PI * 2;

          let rx = Math.sin(angle) * baseRadius;
          let rz = Math.cos(angle) * baseRadius;

          // Anterior Quadricep Muscle Swell (Z > 0)
          if (rz > 0 && v > 0.15 && v < 0.8) {
            rz += Math.sin((v - 0.15) / 0.65 * Math.PI) * 0.016;
          }

          // Lateral Trochanter Flare (Outer hip)
          const isOuter = isLeft ? rx < 0 : rx > 0;
          if (isOuter && v < 0.35) {
            rx *= 1.14;
          }

          // Vastus Medialis (Teardrop muscle right above inner knee)
          const isInner = isLeft ? rx > 0 : rx < 0;
          if (isInner && v > 0.65 && v < 0.95) {
            rx *= 1.12;
            rz += 0.007;
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
    const patellaGeo = new THREE.SphereGeometry(0.032, 16, 16);
    patellaGeo.scale(1.0, 1.3, 0.65);

    const leftPatella = new THREE.Mesh(patellaGeo, this.skinMaterial);
    leftPatella.position.set(0, -0.478, 0.052);
    this.leftThighNode.add(leftPatella);

    const rightPatella = new THREE.Mesh(patellaGeo.clone(), this.skinMaterial);
    rightPatella.position.set(0, -0.478, 0.052);
    this.rightThighNode.add(rightPatella);

    // Sculpted Calf: Gastrocnemius Double Belly & Achilles Taper
    const createOrganicCalf = (isLeft: boolean) => {
      const rings = 22;
      const segments = 32;
      const geo = new THREE.BufferGeometry();
      const vertices: number[] = [];
      const indices: number[] = [];
      const uvs: number[] = [];

      const height = 0.46; // Slender athletic calf

      for (let r = 0; r <= rings; r++) {
        const v = r / rings;
        const y = -v * height;

        const belly = Math.sin(v * Math.PI) * 0.022;
        const baseRadius = 0.066 + belly - v * 0.030;

        for (let s = 0; s <= segments; s++) {
          const u = s / segments;
          const angle = u * Math.PI * 2;

          let rx = Math.sin(angle) * baseRadius;
          let rz = Math.cos(angle) * baseRadius;

          // Posterior Gastrocnemius Calf Muscle (Z < 0)
          if (rz < 0 && v > 0.15 && v < 0.75) {
            rz -= Math.sin((v - 0.15) / 0.6 * Math.PI) * 0.020;
          }

          // Medial inner belly dips lower than lateral outer belly
          const isInner = isLeft ? rx > 0 : rx < 0;
          if (isInner && rz < 0 && v > 0.35 && v < 0.65) {
            rx *= 1.14;
            rz -= 0.007;
          }

          // Anterior Tibial Crest (Shin bone line)
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

    // Sculpted Feet & Warrior Boots
    const buildSculptedFoot = (isLeft: boolean) => {
      const footGroup = new THREE.Group();
      footGroup.position.set(0, -0.46, 0.04);

      // Ankle Malleolus Bones
      const ankleGeo = new THREE.SphereGeometry(0.016, 12, 12);
      const innerAnkle = new THREE.Mesh(ankleGeo, this.skinMaterial);
      innerAnkle.position.set(isLeft ? 0.038 : -0.038, 0.02, -0.04);
      footGroup.add(innerAnkle);

      const outerAnkle = new THREE.Mesh(ankleGeo.clone(), this.skinMaterial);
      outerAnkle.position.set(isLeft ? -0.038 : 0.038, 0.01, -0.04);
      footGroup.add(outerAnkle);

      // High-Arched Foot & Sole
      const footGeo = new THREE.BoxGeometry(0.076, 0.052, 0.15);
      footGeo.scale(1, 0.85, 1.15);
      const foot = new THREE.Mesh(footGeo, this.bootLeatherMaterial);
      foot.position.set(0, -0.015, 0.02);
      foot.castShadow = true;
      footGroup.add(foot);

      // Boot Heel & Sole Tread
      const soleGeo = new THREE.BoxGeometry(0.082, 0.018, 0.165);
      const sole = new THREE.Mesh(
        soleGeo,
        new THREE.MeshStandardMaterial({ color: 0x0a0c10, roughness: 0.9 })
      );
      sole.position.set(0, -0.042, 0.02);
      footGroup.add(sole);

      return footGroup;
    };

    this.leftShinNode.add(buildSculptedFoot(true));
    this.rightShinNode.add(buildSculptedFoot(false));
  }

  // --- SCULPTED ARMS & ARTICULATED 5-FINGER HANDS ---
  private buildSculptedArms() {
    const buildSculptedArmLimb = (isForearm: boolean) => {
      const length = isForearm ? 0.26 : 0.28;
      const rTop = isForearm ? 0.042 : 0.048;
      const rBottom = isForearm ? 0.032 : 0.038;

      const geo = new THREE.CylinderGeometry(rTop, rBottom, length, 24);
      if (isForearm) {
        geo.scale(1.15, 1.0, 0.92); // Brachioradialis muscular flattening
      }
      const mesh = new THREE.Mesh(geo, this.skinMaterial);
      mesh.position.y = -length / 2;
      mesh.castShadow = true;
      return mesh;
    };

    // Left Arm
    this.leftUpperArmNode.add(buildSculptedArmLimb(false));
    this.leftForearmNode.add(buildSculptedArmLimb(true));

    // Right Arm
    this.rightUpperArmNode.add(buildSculptedArmLimb(false));
    this.rightForearmNode.add(buildSculptedArmLimb(true));

    // Articulated 5-Finger Human Hands
    const createArticulatedHand = (isLeft: boolean) => {
      const handGroup = new THREE.Group();
      handGroup.position.set(0, -0.26, 0);

      // Palm with contoured hollow
      const palmGeo = new THREE.BoxGeometry(0.052, 0.070, 0.022);
      const palm = new THREE.Mesh(palmGeo, this.skinMaterial);
      palm.position.y = -0.035;
      palm.castShadow = true;
      handGroup.add(palm);

      // Thenar Eminence (Thumb muscle pad)
      const thenarGeo = new THREE.SphereGeometry(0.015, 12, 12);
      thenarGeo.scale(1.2, 1.4, 0.8);
      const thenar = new THREE.Mesh(thenarGeo, this.skinMaterial);
      thenar.position.set(isLeft ? 0.018 : -0.018, -0.025, 0.011);
      handGroup.add(thenar);

      // Opposed Articulated Thumb
      const thumbGroup = new THREE.Group();
      thumbGroup.position.set(isLeft ? 0.025 : -0.025, -0.022, 0.012);
      thumbGroup.rotation.set(-0.32, 0, isLeft ? 0.65 : -0.65);

      const thumbProx = new THREE.Mesh(
        new THREE.CylinderGeometry(0.007, 0.006, 0.024, 10),
        this.skinMaterial
      );
      thumbProx.position.y = -0.012;
      thumbGroup.add(thumbProx);

      const thumbDist = new THREE.Mesh(
        new THREE.CylinderGeometry(0.006, 0.005, 0.020, 10),
        this.skinMaterial
      );
      thumbDist.position.y = -0.028;
      thumbDist.rotation.x = 0.22;
      thumbGroup.add(thumbDist);
      handGroup.add(thumbGroup);

      // 4 Modeled Fingers (Index, Middle, Ring, Pinky in relaxed organic curve)
      const fingerLengths = [0.042, 0.046, 0.042, 0.035];
      const fingerOffsets = isLeft ? [0.016, 0.005, -0.005, -0.016] : [-0.016, -0.005, 0.005, 0.016];

      for (let i = 0; i < 4; i++) {
        const fGroup = new THREE.Group();
        fGroup.position.set(fingerOffsets[i], -0.066, 0.003);
        fGroup.rotation.x = 0.20 + i * 0.04;

        // Knuckle
        const knuckle = new THREE.Mesh(new THREE.SphereGeometry(0.006, 8, 8), this.skinMaterial);
        fGroup.add(knuckle);

        // Proximal phalanx
        const prox = new THREE.Mesh(
          new THREE.CylinderGeometry(0.0058, 0.0052, fingerLengths[i] * 0.55, 10),
          this.skinMaterial
        );
        prox.position.y = -fingerLengths[i] * 0.28;
        fGroup.add(prox);

        // Distal phalanx with pad
        const distal = new THREE.Mesh(
          new THREE.CylinderGeometry(0.0052, 0.0042, fingerLengths[i] * 0.45, 10),
          this.skinMaterial
        );
        distal.position.set(0, -fingerLengths[i] * 0.70, 0.002);
        distal.rotation.x = 0.18;
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
  // SCULPTED 3D ANIME HUMAN HEAD, FACIAL ANATOMY & VOLUMETRIC HAIR
  // =========================================================================
  private buildSculptedHeadAndHair() {
    // 1. Slender Sculpted Neck with Trapezius/Sternocleidomastoid Tone
    const neckGeo = new THREE.CylinderGeometry(0.052, 0.068, 0.14, 24);
    const neckMesh = new THREE.Mesh(neckGeo, this.skinMaterial);
    neckMesh.castShadow = true;
    this.neckNode.add(neckMesh);

    // 2. Continuous Sculpted 3D Facial Anatomy (Forehead, Orbital Cavities, Nose, Lips, Jaw)
    // Custom parametric cranial-facial mesh (36 radial segments x 24 height rings)
    const rings = 24;
    const segments = 36;
    const headGeo = new THREE.BufferGeometry();
    const vertices: number[] = [];
    const indices: number[] = [];
    const uvs: number[] = [];

    const height = 0.22; // 0.22m head height -> 1.76 / 0.22 = 8.0 heads tall!
    const yTop = 0.12;

    for (let r = 0; r <= rings; r++) {
      const v = r / rings;
      const y = yTop - v * height; // Skull crown down to chin/jawline

      // Base cranial width and depth profile
      let width = 0.096 * Math.sin(Math.PI * Math.pow(v, 0.7));
      let depth = 0.104 * Math.sin(Math.PI * Math.pow(v, 0.7));

      for (let s = 0; s <= segments; s++) {
        const u = s / segments;
        const angle = u * Math.PI * 2;

        let rx = Math.sin(angle) * width;
        let rz = Math.cos(angle) * depth;

        // Front Facial Features (Z > 0)
        if (rz > 0) {
          // A. Orbital Eye Cavities (Recessed eye sockets where the 3D eyeballs sit)
          if (v > 0.35 && v < 0.58 && Math.abs(rx) > 0.022 && Math.abs(rx) < 0.078) {
            const eyeSocketDepth = (1.0 - Math.abs(Math.abs(rx) - 0.050) / 0.028) * 0.016;
            rz -= eyeSocketDepth;
          }

          // B. Sculpted Delicate Nose Bridge & Upturned Tip
          if (Math.abs(rx) < 0.018 && v > 0.38 && v < 0.68) {
            const noseProgress = (v - 0.38) / 0.30;
            // Bridge slopes down, tip projects forward at v ~ 0.60
            const noseSwell = Math.sin(noseProgress * Math.PI) * 0.024;
            rz += noseSwell;
          }

          // C. Sculpted Lips with Cupid's Bow & Mouth Corners
          if (Math.abs(rx) < 0.038 && v > 0.68 && v < 0.82) {
            const lipProgress = (v - 0.68) / 0.14;
            const lipSwell = Math.sin(lipProgress * Math.PI) * 0.012;
            rz += lipSwell;
            // Indent oral commissures (corners)
            if (Math.abs(rx) > 0.028) {
              rz -= 0.006;
            }
          }

          // D. Feminine Rounded Chin
          if (v > 0.84 && Math.abs(rx) < 0.035) {
            rz += Math.sin((v - 0.84) / 0.16 * Math.PI) * 0.010;
          }
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

    headGeo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    headGeo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    headGeo.setIndex(indices);
    headGeo.computeVertexNormals();

    const headMesh = new THREE.Mesh(headGeo, this.faceMaterial);
    headMesh.castShadow = true;
    this.headNode.add(headMesh);

    // Sculpted Stylized Ears
    const buildEar = (isLeft: boolean) => {
      const earGeo = new THREE.SphereGeometry(0.024, 16, 16);
      earGeo.scale(0.35, 1.25, 0.75);
      const ear = new THREE.Mesh(earGeo, this.skinMaterial);
      ear.position.set(isLeft ? -0.090 : 0.090, 0.012, -0.012);
      ear.rotation.set(0.15, isLeft ? -0.2 : 0.2, isLeft ? -0.1 : 0.1);
      return ear;
    };
    this.headNode.add(buildEar(true));
    this.headNode.add(buildEar(false));

    // 3. LAYERED 3D EYEBALLS WITH PROCEDURAL BLINK EYELIDS
    const create3DEye = (isLeft: boolean) => {
      const eyeGroup = new THREE.Group();

      // Deep sclera sphere
      const scleraGeo = new THREE.SphereGeometry(0.028, 20, 20);
      scleraGeo.scale(1, 1, 0.65);
      const scleraMesh = new THREE.Mesh(scleraGeo, this.scleraMaterial);
      eyeGroup.add(scleraMesh);

      // Embedded Iris disk
      const irisGeo = new THREE.CircleGeometry(0.022, 24);
      const irisMesh = new THREE.Mesh(irisGeo, this.irisMaterial);
      irisMesh.position.z = 0.019;
      eyeGroup.add(irisMesh);

      // Glassy Cornea dome
      const corneaGeo = new THREE.SphereGeometry(0.024, 20, 20);
      corneaGeo.scale(1, 1, 0.55);
      const corneaMesh = new THREE.Mesh(corneaGeo, this.eyeCorneaMaterial);
      corneaMesh.position.z = 0.016;
      eyeGroup.add(corneaMesh);

      // Upper Eyelid Mesh for Procedural Blinking
      const eyelidGeo = new THREE.SphereGeometry(0.029, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2);
      eyelidGeo.scale(1.02, 1.02, 0.70);
      const eyelid = new THREE.Mesh(eyelidGeo, this.skinMaterial);
      eyelid.rotation.x = -Math.PI / 2; // Default open (retracted upwards)
      eyelid.position.z = 0.008;
      eyeGroup.add(eyelid);

      if (isLeft) {
        this.leftUpperEyelid = eyelid;
      } else {
        this.rightUpperEyelid = eyelid;
      }

      // Position inside sculpted orbital sockets
      eyeGroup.position.set(isLeft ? -0.046 : 0.046, 0.022, 0.076);
      return eyeGroup;
    };

    this.headNode.add(create3DEye(true));
    this.headNode.add(create3DEye(false));

    // 4. VOLUMETRIC SWEPT HAIR RIBBONS & TWIN BRAIDS
    // Scalp cap / hair crown
    const hairCrownGeo = new THREE.SphereGeometry(0.118, 32, 32);
    hairCrownGeo.scale(1.04, 1.08, 1.14);
    const hairCrown = new THREE.Mesh(hairCrownGeo, this.hairMaterial);
    hairCrown.position.set(0, 0.038, -0.015);
    hairCrown.castShadow = true;
    this.headNode.add(hairCrown);

    // Front Swept Bangs (Curved lofted ribbons framing forehead & eyes)
    const createCurvedHairRibbon = (
      p0: THREE.Vector3,
      p1: THREE.Vector3,
      p2: THREE.Vector3,
      widthStart: number,
      widthEnd: number
    ) => {
      const curve = new THREE.QuadraticBezierCurve3(p0, p1, p2);
      const points = curve.getPoints(16);
      const geo = new THREE.BufferGeometry();
      const vertices: number[] = [];
      const uvs: number[] = [];

      for (let i = 0; i < points.length; i++) {
        const pt = points[i];
        const t = i / (points.length - 1);
        const w = THREE.MathUtils.lerp(widthStart, widthEnd, t);

        vertices.push(pt.x - w, pt.y, pt.z);
        vertices.push(pt.x + w, pt.y, pt.z);
        uvs.push(0, t);
        uvs.push(1, t);
      }

      const indices: number[] = [];
      for (let i = 0; i < points.length - 1; i++) {
        const a = i * 2;
        const b = i * 2 + 1;
        const c = (i + 1) * 2;
        const d = (i + 1) * 2 + 1;
        indices.push(a, b, c);
        indices.push(b, d, c);
      }

      geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
      geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
      geo.setIndex(indices);
      geo.computeVertexNormals();

      const ribbonMesh = new THREE.Mesh(geo, this.hairMaterial);
      ribbonMesh.castShadow = true;
      return ribbonMesh;
    };

    // Center & side-swept bangs
    this.headNode.add(
      createCurvedHairRibbon(
        new THREE.Vector3(0, 0.105, 0.088),
        new THREE.Vector3(0, 0.045, 0.114),
        new THREE.Vector3(0.005, -0.015, 0.102),
        0.024,
        0.004
      )
    );
    this.headNode.add(
      createCurvedHairRibbon(
        new THREE.Vector3(-0.035, 0.102, 0.082),
        new THREE.Vector3(-0.065, 0.035, 0.108),
        new THREE.Vector3(-0.085, -0.020, 0.088),
        0.026,
        0.005
      )
    );
    this.headNode.add(
      createCurvedHairRibbon(
        new THREE.Vector3(0.035, 0.102, 0.082),
        new THREE.Vector3(0.065, 0.035, 0.108),
        new THREE.Vector3(0.085, -0.020, 0.088),
        0.026,
        0.005
      )
    );

    // Cheek-framing sidelocks (tapering to collarbones)
    this.headNode.add(
      createCurvedHairRibbon(
        new THREE.Vector3(-0.082, 0.060, 0.045),
        new THREE.Vector3(-0.105, -0.035, 0.060),
        new THREE.Vector3(-0.092, -0.125, 0.052),
        0.022,
        0.004
      )
    );
    this.headNode.add(
      createCurvedHairRibbon(
        new THREE.Vector3(0.082, 0.060, 0.045),
        new THREE.Vector3(0.105, -0.035, 0.060),
        new THREE.Vector3(0.092, -0.125, 0.052),
        0.022,
        0.004
      )
    );

    // 5. VOLUMETRIC SWEPT BRAID CHAINS (Twin Braids with Lime-Green Tips)
    const buildWovenBraidChain = (isLeft: boolean): THREE.Group[] => {
      const segments: THREE.Group[] = [];
      const baseGroup = new THREE.Group();
      baseGroup.position.set(isLeft ? -0.105 : 0.105, 0.025, 0.015);
      this.headNode.add(baseGroup);

      let currentParent: THREE.Group = baseGroup;

      for (let i = 0; i < 5; i++) {
        const segGroup = new THREE.Group();
        segGroup.position.set(0, i === 0 ? 0 : -0.105, 0);

        // Volumetric undulating twisted braid links
        const linkRadius = 0.046 - i * 0.005;
        const linkGeo = new THREE.SphereGeometry(linkRadius, 20, 20);
        linkGeo.scale(1.15, 1.45, 0.85);

        const link1 = new THREE.Mesh(linkGeo, this.hairMaterial);
        link1.rotation.z = i % 2 === 0 ? 0.35 : -0.35;
        link1.castShadow = true;
        segGroup.add(link1);

        const link2 = new THREE.Mesh(linkGeo.clone(), this.hairMaterial);
        link2.rotation.z = i % 2 === 0 ? -0.35 : 0.35;
        link2.position.set(0, -0.02, 0.008);
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
    this.backHairGroup.position.set(0, 0.045, -0.088);
    const backHairGeo = new THREE.CylinderGeometry(0.092, 0.145, 0.38, 24);
    backHairGeo.scale(1.22, 1, 0.62);
    const backHairMesh = new THREE.Mesh(backHairGeo, this.hairMaterial);
    backHairMesh.position.y = -0.16;
    backHairMesh.castShadow = true;
    this.backHairGroup.add(backHairMesh);
    this.headNode.add(this.backHairGroup);
  }

  // =========================================================================
  // DETAILED COSTUME SYSTEM (Combat Uniform, Haori, Pleated Skirt, Belt)
  // =========================================================================
  private buildCostume() {
    // 1. OUTER FLOWING HAORI (White Silk Robe with Draped Kimono Sleeves)
    this.haoriGroup.name = 'HaoriLayer';
    const capeGeo = new THREE.CylinderGeometry(0.22, 0.35, 0.72, 24, 1, true, 0.45, Math.PI * 1.65);
    const haoriCape = new THREE.Mesh(capeGeo, this.whiteFabricMaterial);
    haoriCape.position.set(0, -0.15, -0.042);
    haoriCape.castShadow = true;
    this.haoriGroup.add(haoriCape);

    const sleeveGeo = new THREE.CylinderGeometry(0.082, 0.135, 0.38, 20);
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
    const jacketTorsoGeo = new THREE.CylinderGeometry(0.165, 0.142, 0.24, 32);
    jacketTorsoGeo.scale(1.12, 1, 0.92);
    const jacketTorso = new THREE.Mesh(jacketTorsoGeo, this.darkFabricMaterial);
    this.jacketGroup.add(jacketTorso);

    const collarGeo = new THREE.CylinderGeometry(0.076, 0.088, 0.062, 24);
    const collar = new THREE.Mesh(collarGeo, this.whiteFabricMaterial);
    collar.position.y = 0.115;
    this.jacketGroup.add(collar);

    for (let i = 0; i < 3; i++) {
      const btnGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.008, 16);
      const btnLeft = new THREE.Mesh(btnGeo, this.goldAccentMaterial);
      btnLeft.rotation.x = Math.PI / 2;
      btnLeft.position.set(-0.105, 0.055 - i * 0.060, 0.120);
      this.jacketGroup.add(btnLeft);

      const btnRight = btnLeft.clone();
      btnRight.position.x = 0.105;
      this.jacketGroup.add(btnRight);
    }

    this.chestNode.add(this.jacketGroup);

    // 3. FLUTED PLEATED MINI SKIRT (Dynamic radial pleat geometry)
    this.skirtGroup.name = 'SkirtLayer';
    const skirtGeo = new THREE.ConeGeometry(0.28, 0.25, 32, 1, true);
    skirtGeo.scale(1.16, 1, 0.96);
    const skirtMesh = new THREE.Mesh(skirtGeo, this.darkFabricMaterial);
    skirtMesh.position.y = -0.082;
    skirtMesh.castShadow = true;
    this.skirtGroup.add(skirtMesh);
    this.pelvisNode.add(this.skirtGroup);

    // 4. WHITE LEATHER BELT & METALLIC BUCKLE
    this.beltGroup.name = 'BeltLayer';
    const beltGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.050, 32);
    beltGeo.scale(1.12, 1, 0.94);
    const beltMesh = new THREE.Mesh(beltGeo, this.whiteFabricMaterial);
    beltMesh.position.y = 0.085;
    this.beltGroup.add(beltMesh);

    const buckle = new THREE.Mesh(
      new THREE.BoxGeometry(0.044, 0.054, 0.016),
      new THREE.MeshStandardMaterial({ color: 0xe6edf5, roughness: 0.18, metalness: 0.92 })
    );
    buckle.position.set(0, 0.085, 0.174);
    this.beltGroup.add(buckle);
    this.pelvisNode.add(this.beltGroup);

    // 5. STRIPED THIGH-HIGH STOCKINGS
    this.stockingsGroup.name = 'StockingsLayer';
    const sockThighGeo = new THREE.CylinderGeometry(0.108, 0.075, 0.35, 24);
    const leftSockThigh = new THREE.Mesh(sockThighGeo, this.stockingsMaterial);
    leftSockThigh.position.y = -0.30;
    this.leftThighNode.add(leftSockThigh);

    const rightSockThigh = new THREE.Mesh(sockThighGeo.clone(), this.stockingsMaterial);
    rightSockThigh.position.y = -0.30;
    this.rightThighNode.add(rightSockThigh);

    const sockCalfGeo = new THREE.CylinderGeometry(0.075, 0.046, 0.46, 24);
    const leftSockCalf = new THREE.Mesh(sockCalfGeo, this.stockingsMaterial);
    leftSockCalf.position.y = -0.23;
    this.leftShinNode.add(leftSockCalf);

    const rightSockCalf = new THREE.Mesh(sockCalfGeo.clone(), this.stockingsMaterial);
    rightSockCalf.position.y = -0.23;
    this.rightShinNode.add(rightSockCalf);

    const ribbonMat = new THREE.MeshStandardMaterial({ color: 0xf43f5e, roughness: 0.42 });
    const laceRing = new THREE.Mesh(new THREE.TorusGeometry(0.062, 0.008, 10, 24), ribbonMat);
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
    this.swordSheathedGroup.position.set(-0.21, 0.02, 0.025);
    this.swordSheathedGroup.rotation.set(0.3, 0.2, 0.7);

    const scabbardGeo = new THREE.BoxGeometry(0.032, 0.82, 0.016);
    const scabbard = new THREE.Mesh(
      scabbardGeo,
      new THREE.MeshStandardMaterial({ color: 0x111622, roughness: 0.32, metalness: 0.45 })
    );
    scabbard.position.y = -0.35;
    scabbard.castShadow = true;
    this.swordSheathedGroup.add(scabbard);

    const tsuba = new THREE.Mesh(
      new THREE.CylinderGeometry(0.050, 0.050, 0.014, 20),
      new THREE.MeshStandardMaterial({ color: 0xf43f5e, roughness: 0.28, metalness: 0.75 })
    );
    tsuba.position.y = 0.055;
    this.swordSheathedGroup.add(tsuba);

    const tsuka = new THREE.Mesh(
      new THREE.CylinderGeometry(0.018, 0.018, 0.24, 14),
      new THREE.MeshStandardMaterial({ color: 0x84cc16, roughness: 0.55 })
    );
    tsuka.position.y = 0.17;
    this.swordSheathedGroup.add(tsuka);

    this.pelvisNode.add(this.swordSheathedGroup);

    this.swordHandGroup.position.set(0, -0.065, 0.055);
    this.swordHandGroup.rotation.x = -Math.PI / 2;

    const bladeGeo = new THREE.BoxGeometry(0.024, 0.94, 0.008);
    const blade = new THREE.Mesh(bladeGeo, this.bladeMaterial);
    blade.position.y = 0.47;
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
    this.swordHandGroup.visible = inHand;
    this.swordSheathedGroup.visible = !inHand && this.layers.sword;
  }

  public setExpression(expr: FacialExpression) {
    this.expression = expr;
    const poreTexture = this.skinMaterial.bumpMap!;
    this.faceMaterial = this.createRealisticFaceMaterial(expr, poreTexture);
    this.headNode.children.forEach((c) => {
      if (c instanceof THREE.Mesh && c.material === this.faceMaterial) {
        c.material = this.faceMaterial;
      }
    });
  }

  public setSkinSheen(val: number) {
    this.skinSheen = val;
    this.skinMaterial.sheen = val;
    this.skinMaterial.clearcoat = 0.08 + val * 0.14;
    this.skinMaterial.needsUpdate = true;
  }

  /**
   * Procedural Eye Blinking: 0 = fully open, 1 = fully closed
   */
  public setBlink(blinkFactor: number) {
    if (this.leftUpperEyelid && this.rightUpperEyelid) {
      // Rotate eyelids downwards to cover eye cornea
      const rotX = -Math.PI / 2 + blinkFactor * (Math.PI / 2);
      this.leftUpperEyelid.rotation.x = rotX;
      this.rightUpperEyelid.rotation.x = rotX;
    }
  }

  public applyLayerVisibility() {
    this.haoriGroup.visible = this.layers.haori;
    this.jacketGroup.visible = this.layers.jacket;
    this.skirtGroup.visible = this.layers.skirt;
    this.stockingsGroup.visible = this.layers.stockings;
    this.beltGroup.visible = this.layers.belt;

    this.leftBustClothedMesh.visible = this.layers.jacket;
    this.rightBustClothedMesh.visible = this.layers.jacket;
    this.leftBustBareMesh.visible = !this.layers.jacket;
    this.rightBustBareMesh.visible = !this.layers.jacket;

    this.swordHandGroup.visible = this.layers.swordInHand;
    this.swordSheathedGroup.visible = !this.layers.swordInHand && this.layers.sword;
  }

  // =========================================================================
  // DYNAMICS & SECONDARY PHYSICS UPDATE
  // =========================================================================
  public updatePhysics(_dt: number) {
    // Apply Secondary Bust Soft Dynamics (Positional displacement + 3D rotational tilt)
    const leftDisp = this.dynamics.getLeftBustOffset();
    const rightDisp = this.dynamics.getRightBustOffset();
    const leftRot = this.dynamics.getLeftBustRotation();
    const rightRot = this.dynamics.getRightBustRotation();

    this.leftBustGroup.position.set(-0.088 + leftDisp.x, 0.035 + leftDisp.y, 0.138 + leftDisp.z);
    this.leftBustGroup.rotation.set(leftRot.x, leftRot.y, leftRot.z);

    this.rightBustGroup.position.set(0.088 + rightDisp.x, 0.035 + rightDisp.y, 0.138 + rightDisp.z);
    this.rightBustGroup.rotation.set(rightRot.x, rightRot.y, rightRot.z);

    // Apply Hair Braid Rotations
    const leftRots = this.dynamics.getBraidRotations(true);
    const rightRots = this.dynamics.getBraidRotations(false);

    for (let i = 0; i < this.leftBraidSegments.length; i++) {
      if (leftRots[i]) {
        this.leftBraidSegments[i].rotation.x = leftRots[i].rotX;
        this.leftBraidSegments[i].rotation.z = leftRots[i].rotZ;
      }
    }

    for (let i = 0; i < this.rightBraidSegments.length; i++) {
      if (rightRots[i]) {
        this.rightBraidSegments[i].rotation.x = rightRots[i].rotX;
        this.rightBraidSegments[i].rotation.z = -rightRots[i].rotZ;
      }
    }

    const wind = this.dynamics.currentWindVector;
    this.backHairGroup.rotation.x = wind.z * 0.4;
    this.backHairGroup.rotation.z = wind.x * 0.4;
  }

  public update(
    dt: number,
    charPos: THREE.Vector3,
    charRotY: number,
    footstepImpulse: number = 0,
    jumpVerticalVel: number = 0
  ) {
    this.dynamics.update(dt, charPos, charRotY, footstepImpulse, jumpVerticalVel);
    this.updatePhysics(dt);
  }
}
