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

    // 1. Initialize Advanced PBR & Physical Materials
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
  // MATERIAL SYSTEM: Realistic Physical Skin with SSS & Procedural Micro-Pores
  // =========================================================================
  private initRealisticMaterials() {
    // 1. Procedural Micro-Pore Bump & Roughness Texture
    const poreCanvas = document.createElement('canvas');
    poreCanvas.width = 512;
    poreCanvas.height = 512;
    const pCtx = poreCanvas.getContext('2d')!;
    pCtx.fillStyle = '#808080';
    pCtx.fillRect(0, 0, 512, 512);

    // High-frequency skin pores and micro-papillae
    const imgData = pCtx.getImageData(0, 0, 512, 512);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 28;
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

    // 2. Realistic Female Skin Shader (MeshPhysicalMaterial)
    // - Subsurface Scattering (SSS) simulated via warm peach sheen
    // - Clearcoat hydration layer
    // - Micro-pore tactile relief
    this.skinMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffe2d6, // Warm natural porcelain with delicate peach undertone
      roughness: 0.42,
      metalness: 0.0,
      clearcoat: 0.18, // Natural skin hydration
      clearcoatRoughness: 0.32,
      sheen: 0.75, // Soft peach-fuzz vellus hair sheen (SSS emulation)
      sheenColor: new THREE.Color(0xffb2c2),
      bumpMap: poreTexture,
      bumpScale: 0.0028,
    });

    // 3. Hair Texture & Shader (Sakura Pink to Lime Green Gradient + Specular Anisotropy)
    const hairCanvas = document.createElement('canvas');
    hairCanvas.width = 128;
    hairCanvas.height = 512;
    const hCtx = hairCanvas.getContext('2d')!;
    const hGrad = hCtx.createLinearGradient(0, 0, 0, 512);
    hGrad.addColorStop(0.0, '#ffa8cb'); // Soft pastel pink roots
    hGrad.addColorStop(0.48, '#f45d94'); // Blossom pink body
    hGrad.addColorStop(0.74, '#b4e858'); // Luminous lime-yellow transition
    hGrad.addColorStop(1.0, '#62cb22'); // Fresh anime lime green tips
    hCtx.fillStyle = hGrad;
    hCtx.fillRect(0, 0, 128, 512);

    // Soft hair strand specular striations
    hCtx.fillStyle = 'rgba(255, 255, 255, 0.18)';
    for (let i = 0; i < 30; i++) {
      hCtx.fillRect(Math.random() * 128, 0, 1.5, 512);
    }
    const hairTexture = new THREE.CanvasTexture(hairCanvas);

    this.hairMaterial = new THREE.MeshStandardMaterial({
      map: hairTexture,
      roughness: 0.38,
      metalness: 0.12,
    });

    // 4. Detailed 3D Face Material
    this.faceMaterial = this.createRealisticFaceMaterial('smile', poreTexture);

    // 5. Eyeball Materials: Glassy Cornea & Striated Iris
    this.eyeCorneaMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.95,
      opacity: 1,
      transparent: true,
      roughness: 0.04,
      ior: 1.38, // Refractive cornea
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
    });

    const irisCanvas = document.createElement('canvas');
    irisCanvas.width = 256;
    irisCanvas.height = 256;
    const iCtx = irisCanvas.getContext('2d')!;

    // Sclera
    iCtx.fillStyle = '#ffffff';
    iCtx.fillRect(0, 0, 256, 256);

    // Outer limbal ring
    iCtx.fillStyle = '#0d401a';
    iCtx.beginPath();
    iCtx.arc(128, 128, 100, 0, Math.PI * 2);
    iCtx.fill();

    // Emerald to golden iris gradient
    const irisGrad = iCtx.createRadialGradient(128, 128, 15, 128, 128, 96);
    irisGrad.addColorStop(0.0, '#0a2211'); // Dark pupil
    irisGrad.addColorStop(0.28, '#1e7534'); // Deep emerald
    irisGrad.addColorStop(0.68, '#4de065'); // Leaf green
    irisGrad.addColorStop(1.0, '#c2f238'); // Golden amber fringe
    iCtx.fillStyle = irisGrad;
    iCtx.beginPath();
    iCtx.arc(128, 128, 96, 0, Math.PI * 2);
    iCtx.fill();

    // Iris striations
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

    // 6. Fabric Materials (Woven Combat Uniform & Haori Silk)
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

    // 7. Striped Stockings Texture (Lime green and navy)
    const sockCanvas = document.createElement('canvas');
    sockCanvas.width = 64;
    sockCanvas.height = 256;
    const sCtx = sockCanvas.getContext('2d')!;
    sCtx.fillStyle = '#6ac928'; // Vibrant lime green
    sCtx.fillRect(0, 0, 64, 256);
    sCtx.fillStyle = '#1c222e'; // Midnight stripes
    for (let y = 0; y < 256; y += 32) {
      sCtx.fillRect(0, y, 64, 15);
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

    // 8. Steel Nichirin Blade
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

    // Warm soft cheek blush & temple shading
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
      // Eyeliner contour
      ctx.strokeStyle = '#221411';
      ctx.lineWidth = 11;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(cx, cy + 12, 85, Math.PI * 1.15, Math.PI * 1.85);
      ctx.stroke();

      // Winged lash flick
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

      // Lower soft lash line
      ctx.strokeStyle = '#5a3832';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(cx, cy + 12, 82, Math.PI * 0.25, Math.PI * 0.75);
      ctx.stroke();
    };

    drawLashes(330, 520, true);
    drawLashes(694, 520, false);

    // Eyebrows (Arched, elegant rose-pink)
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

    // Sculpted Nose Shadow & Nostril Wells
    ctx.fillStyle = '#e8a994';
    ctx.beginPath();
    ctx.ellipse(512, 630, 8, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#6b3c32';
    ctx.beginPath();
    ctx.arc(498, 638, 3.5, 0, Math.PI * 2);
    ctx.arc(526, 638, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Plump, Glossy Lips with Cupid's Bow
    ctx.fillStyle = '#ff6e8e';
    ctx.strokeStyle = '#c43d5b';
    ctx.lineWidth = 4;
    ctx.beginPath();
    if (expr === 'smile' || expr === 'blush') {
      // Upper lip
      ctx.moveTo(462, 725);
      ctx.quadraticCurveTo(490, 715, 512, 724);
      ctx.quadraticCurveTo(534, 715, 562, 725);
      ctx.quadraticCurveTo(512, 736, 462, 725);
      ctx.fill();
      ctx.stroke();

      // Lower lip
      ctx.fillStyle = '#ff829f';
      ctx.beginPath();
      ctx.moveTo(466, 727);
      ctx.quadraticCurveTo(512, 762, 558, 727);
      ctx.quadraticCurveTo(512, 734, 466, 727);
      ctx.fill();
      ctx.stroke();

      // Gloss reflection
      ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
      ctx.beginPath();
      ctx.ellipse(512, 742, 18, 5, 0, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Confident smirk
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
  // ORGANIC ANATOMY SCULPTING (High-Res Continuous Mesh Generation)
  // =========================================================================
  private buildOrganicAnatomy() {
    // 1. PELVIS & CURVACEOUS HIPS (Smooth anatomical loft)
    // 32-segment loft with rounded gluteal cleft and iliac crest
    const pelvisGeo = new THREE.CylinderGeometry(0.185, 0.165, 0.24, 32);
    pelvisGeo.scale(1.18, 1, 0.98);
    const pelvisMesh = new THREE.Mesh(pelvisGeo, this.skinMaterial);
    pelvisMesh.castShadow = true;
    pelvisMesh.receiveShadow = true;
    this.pelvisNode.add(pelvisMesh);

    // Anatomical Gluteal Sculpt (natural rounded curve with soft sacral hollow)
    const gluteGeo = new THREE.SphereGeometry(0.13, 24, 24);
    gluteGeo.scale(1.08, 1.22, 1.28);
    const gluteLeft = new THREE.Mesh(gluteGeo, this.skinMaterial);
    gluteLeft.position.set(-0.108, -0.05, -0.04);
    gluteLeft.castShadow = true;
    this.pelvisNode.add(gluteLeft);

    const gluteRight = new THREE.Mesh(gluteGeo.clone(), this.skinMaterial);
    gluteRight.position.set(0.108, -0.05, -0.04);
    gluteRight.castShadow = true;
    this.pelvisNode.add(gluteRight);

    // 2. TORSO, NARROW WAIST & RIBCAFE
    const waistGeo = new THREE.CylinderGeometry(0.142, 0.182, 0.22, 32);
    waistGeo.scale(1.06, 1, 0.90);
    this.bareTorsoMesh = new THREE.Mesh(waistGeo, this.skinMaterial);
    this.bareTorsoMesh.position.y = 0.05;
    this.bareTorsoMesh.castShadow = true;
    this.spineNode.add(this.bareTorsoMesh);

    // Sculpted Navel & Abdominal Midline (Linea Alba)
    const navelGeo = new THREE.SphereGeometry(0.014, 12, 12);
    navelGeo.scale(0.8, 1.4, 0.5);
    const navel = new THREE.Mesh(
      navelGeo,
      new THREE.MeshBasicMaterial({ color: 0xc47e6e })
    );
    navel.position.set(0, 0.025, 0.132);
    this.spineNode.add(navel);

    // 3. UPPER CHEST, CLAVICLES & STERNUM
    const ribcageGeo = new THREE.CylinderGeometry(0.172, 0.142, 0.22, 32);
    ribcageGeo.scale(1.12, 1, 0.92);
    const ribcageMesh = new THREE.Mesh(ribcageGeo, this.skinMaterial);
    ribcageMesh.castShadow = true;
    this.chestNode.add(ribcageMesh);

    // Anatomical Clavicle Bones (curving gently towards shoulder joints)
    const clavicleGeo = new THREE.CylinderGeometry(0.011, 0.011, 0.17, 12);
    const clavLeft = new THREE.Mesh(clavicleGeo, this.skinMaterial);
    clavLeft.rotation.set(0.12, 0.15, 1.38);
    clavLeft.position.set(-0.095, 0.14, 0.082);
    this.chestNode.add(clavLeft);

    const clavRight = new THREE.Mesh(clavicleGeo.clone(), this.skinMaterial);
    clavRight.rotation.set(0.12, -0.15, -1.38);
    clavRight.position.set(0.095, 0.14, 0.082);
    this.chestNode.add(clavRight);

    // 4. SOFT-BODY TEARDROP BUST SCULPTURE
    // Instead of simple spheres, we generate an anatomical teardrop projection:
    // - Gentle upper slope transitioning from clavicle
    // - Full, rounded, gravitational lower projection
    // - Outward natural angle (~9 degrees)
    // - Soft cleavage valley
    const createTeardropBust = (isLeft: boolean) => {
      const geo = new THREE.SphereGeometry(0.122, 32, 32);
      const pos = geo.attributes.position;
      // Sculpt teardrop vertex deformation
      for (let i = 0; i < pos.count; i++) {
        const y = pos.getY(i);
        const z = pos.getZ(i);

        // Lower portion (y < 0) expands forward for natural gravitational droop
        if (y < 0.04 && z > 0) {
          pos.setZ(i, z * (1.0 + (0.04 - y) * 1.5));
          pos.setY(i, y * 0.92);
        }
        // Upper slope (y > 0) flattens gently into chest wall
        if (y > 0.02 && z > 0) {
          pos.setZ(i, z * (1.0 - y * 0.7));
        }
      }
      geo.computeVertexNormals();
      const asymmetry = isLeft ? 1.015 : 0.985;
      geo.scale(1.02 * asymmetry, 1.14 * asymmetry, 1.30 * asymmetry);
      return geo;
    };

    // Left Bust Group & Meshes
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

    // Right Bust Group & Meshes
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

    // 5. SCULPTED LIMBS: Arms, Deltoids, Forearms & Articulated Hands
    this.buildSculptedArms();

    // 6. SCULPTED LIMBS: Thighs, Patella Knees, Gastrocnemius Calves & Detailed Feet
    this.buildSculptedLegs();
  }

  // --- SCULPTED ARMS WITH ARTICULATED FINGERS ---
  private buildSculptedArms() {
    // Deltoid Shoulder Caps
    const deltoidGeo = new THREE.SphereGeometry(0.064, 20, 20);
    deltoidGeo.scale(1.05, 1.25, 1.15);

    const leftDelt = new THREE.Mesh(deltoidGeo, this.skinMaterial);
    leftDelt.position.set(0, 0.02, 0);
    leftDelt.castShadow = true;
    this.leftUpperArmNode.add(leftDelt);

    const rightDelt = new THREE.Mesh(deltoidGeo.clone(), this.skinMaterial);
    rightDelt.position.set(0, 0.02, 0);
    rightDelt.castShadow = true;
    this.rightUpperArmNode.add(rightDelt);

    // Upper Arm (Bicep/Tricep Taper)
    const bicepGeo = new THREE.CylinderGeometry(0.051, 0.043, 0.28, 20);
    const leftArmMesh = new THREE.Mesh(bicepGeo, this.skinMaterial);
    leftArmMesh.position.y = -0.14;
    leftArmMesh.castShadow = true;
    this.leftUpperArmNode.add(leftArmMesh);

    const rightArmMesh = new THREE.Mesh(bicepGeo.clone(), this.skinMaterial);
    rightArmMesh.position.y = -0.14;
    rightArmMesh.castShadow = true;
    this.rightUpperArmNode.add(rightArmMesh);

    // Forearm (Pronator muscle taper & wrist bones)
    const forearmGeo = new THREE.CylinderGeometry(0.043, 0.034, 0.27, 20);
    const leftForearmMesh = new THREE.Mesh(forearmGeo, this.skinMaterial);
    leftForearmMesh.position.y = -0.135;
    leftForearmMesh.castShadow = true;
    this.leftForearmNode.add(leftForearmMesh);

    const rightForearmMesh = new THREE.Mesh(forearmGeo.clone(), this.skinMaterial);
    rightForearmMesh.position.y = -0.135;
    rightForearmMesh.castShadow = true;
    this.rightForearmNode.add(rightForearmMesh);

    // ARTICULATED HANDS WITH 5 DETAILED FINGERS
    const createArticulatedHand = (isLeft: boolean) => {
      const handGroup = new THREE.Group();

      // Palm
      const palmGeo = new THREE.BoxGeometry(0.052, 0.068, 0.024);
      const palmMesh = new THREE.Mesh(palmGeo, this.skinMaterial);
      palmMesh.position.y = -0.034;
      palmMesh.castShadow = true;
      handGroup.add(palmMesh);

      // Thumb (opposed angle)
      const thumbGeo = new THREE.CylinderGeometry(0.007, 0.006, 0.038, 8);
      const thumb = new THREE.Mesh(thumbGeo, this.skinMaterial);
      thumb.rotation.z = isLeft ? 0.65 : -0.65;
      thumb.rotation.x = -0.35;
      thumb.position.set(isLeft ? 0.028 : -0.028, -0.024, 0.014);
      handGroup.add(thumb);

      // 4 Fingers (Index, Middle, Ring, Pinky in relaxed organic curve)
      const fingerLengths = [0.044, 0.048, 0.044, 0.036];
      const fingerOffsets = isLeft ? [0.018, 0.006, -0.006, -0.018] : [-0.018, -0.006, 0.006, 0.018];

      for (let i = 0; i < 4; i++) {
        const fGeo = new THREE.CylinderGeometry(0.006, 0.005, fingerLengths[i], 8);
        const finger = new THREE.Mesh(fGeo, this.skinMaterial);
        finger.position.set(fingerOffsets[i], -0.068 - fingerLengths[i] * 0.45, 0.003);
        finger.rotation.x = 0.22 + i * 0.04; // Natural curl
        handGroup.add(finger);
      }

      return handGroup;
    };

    const leftHand = createArticulatedHand(true);
    this.leftForearmNode.add(leftHand);

    const rightHand = createArticulatedHand(false);
    this.rightHandNode.add(rightHand);
  }

  // --- SCULPTED LEGS WITH ANKLES & DETAILED FEET ---
  private buildSculptedLegs() {
    // Thighs (Sculpted quadriceps curve and feminine inner contour)
    const thighGeo = new THREE.CylinderGeometry(0.108, 0.074, 0.45, 24);
    thighGeo.scale(1.08, 1, 1.05);

    const leftThigh = new THREE.Mesh(thighGeo, this.skinMaterial);
    leftThigh.position.y = -0.225;
    leftThigh.castShadow = true;
    this.leftThighNode.add(leftThigh);

    const rightThigh = new THREE.Mesh(thighGeo.clone(), this.skinMaterial);
    rightThigh.position.y = -0.225;
    rightThigh.castShadow = true;
    this.rightThighNode.add(rightThigh);

    // Knee / Patella Plate (Defined anatomical bone contour)
    const patellaGeo = new THREE.SphereGeometry(0.032, 16, 16);
    patellaGeo.scale(1, 1.25, 0.7);

    const leftPatella = new THREE.Mesh(patellaGeo, this.skinMaterial);
    leftPatella.position.set(0, -0.45, 0.052);
    this.leftThighNode.add(leftPatella);

    const rightPatella = new THREE.Mesh(patellaGeo.clone(), this.skinMaterial);
    rightPatella.position.set(0, -0.45, 0.052);
    this.rightThighNode.add(rightPatella);

    // Calves (Gastrocnemius anatomical muscle curve tapering to Achilles tendon)
    const calfGeo = new THREE.CylinderGeometry(0.075, 0.044, 0.45, 24);
    calfGeo.scale(1.04, 1, 1.12);

    const leftCalf = new THREE.Mesh(calfGeo, this.skinMaterial);
    leftCalf.position.y = -0.225;
    leftCalf.castShadow = true;
    this.leftShinNode.add(leftCalf);

    const rightCalf = new THREE.Mesh(calfGeo.clone(), this.skinMaterial);
    rightCalf.position.y = -0.225;
    rightCalf.castShadow = true;
    this.rightShinNode.add(rightCalf);

    // Ankle Malleolus Bones
    const ankleGeo = new THREE.SphereGeometry(0.016, 12, 12);
    const leftAnkleMedial = new THREE.Mesh(ankleGeo, this.skinMaterial);
    leftAnkleMedial.position.set(0.038, -0.42, 0);
    this.leftShinNode.add(leftAnkleMedial);

    const leftAnkleLateral = new THREE.Mesh(ankleGeo, this.skinMaterial);
    leftAnkleLateral.position.set(-0.038, -0.42, 0);
    this.leftShinNode.add(leftAnkleLateral);

    const rightAnkleMedial = new THREE.Mesh(ankleGeo, this.skinMaterial);
    rightAnkleMedial.position.set(-0.038, -0.42, 0);
    this.rightShinNode.add(rightAnkleMedial);

    const rightAnkleLateral = new THREE.Mesh(ankleGeo, this.skinMaterial);
    rightAnkleLateral.position.set(0.038, -0.42, 0);
    this.rightShinNode.add(rightAnkleLateral);

    // DETAILED FEET WITH ARCH & TOES
    const createDetailedFoot = () => {
      const footGroup = new THREE.Group();

      // Heel & Instep Arch
      const instepGeo = new THREE.BoxGeometry(0.074, 0.055, 0.16);
      const instepMesh = new THREE.Mesh(instepGeo, this.skinMaterial);
      instepMesh.position.set(0, -0.445, 0.035);
      instepMesh.castShadow = true;
      footGroup.add(instepMesh);

      // 5 Modeled Toes
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

    // Refined Feminine Chin & Mandible
    const chinGeo = new THREE.ConeGeometry(0.082, 0.13, 24);
    chinGeo.scale(1.0, 1, 0.68);
    const chinMesh = new THREE.Mesh(chinGeo, this.skinMaterial);
    chinMesh.rotation.x = Math.PI;
    chinMesh.position.set(0, 0.025, 0.04);
    this.headNode.add(chinMesh);

    // Sculpted Nose Bridge & Tip
    const noseGeo = new THREE.ConeGeometry(0.018, 0.072, 12);
    const noseMesh = new THREE.Mesh(noseGeo, this.skinMaterial);
    noseMesh.rotation.x = -0.32;
    noseMesh.position.set(0, 0.118, 0.138);
    this.headNode.add(noseMesh);

    // 3. LAYERED 3D EYEBALLS WITH REFRACTIVE CORNEA & IRIS
    const create3DEye = (isLeft: boolean) => {
      const eyeGroup = new THREE.Group();

      // Iris surface
      const irisGeo = new THREE.CircleGeometry(0.028, 24);
      const irisMesh = new THREE.Mesh(irisGeo, this.irisMaterial);
      irisMesh.position.z = 0.028;
      eyeGroup.add(irisMesh);

      // Glassy Cornea Dome
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
    // Scalp & Voluminous Hair Cap
    const hairCrownGeo = new THREE.SphereGeometry(0.162, 32, 32);
    hairCrownGeo.scale(1.02, 1.08, 1.12);
    const hairCrown = new THREE.Mesh(hairCrownGeo, this.hairMaterial);
    hairCrown.position.set(0, 0.135, -0.028);
    hairCrown.castShadow = true;
    this.headNode.add(hairCrown);

    // Layered Curved Fringe Strands & Bangs (Lime Green Tips)
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
    // Interlocking woven link geometry for twin twintails
    const buildWovenBraidChain = (isLeft: boolean): THREE.Group[] => {
      const segments: THREE.Group[] = [];
      const baseGroup = new THREE.Group();
      baseGroup.position.set(isLeft ? -0.135 : 0.135, 0.085, 0.045);
      this.headNode.add(baseGroup);

      let currentParent: THREE.Group = baseGroup;

      for (let i = 0; i < 5; i++) {
        const segGroup = new THREE.Group();
        segGroup.position.set(0, i === 0 ? 0 : -0.115, 0);

        // Volumetric Woven Link (Dual cross-interlocking ellipsoids)
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

    // Wide Kimono/Haori Sleeves
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

    // White shirt inner collar
    const collarGeo = new THREE.CylinderGeometry(0.084, 0.098, 0.065, 24);
    const collar = new THREE.Mesh(collarGeo, this.whiteFabricMaterial);
    collar.position.y = 0.115;
    this.jacketGroup.add(collar);

    // Gilded Embossed Buttons
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

    // Pink Satin Ankle Ribbon Ties
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
    // 1. Sheathed Katana at Hip
    this.swordSheathedGroup.position.set(-0.215, 0.02, 0.025);
    this.swordSheathedGroup.rotation.set(0.3, 0.2, 0.7);

    // Scabbard with pink lacquer finish
    const scabbardGeo = new THREE.BoxGeometry(0.034, 0.78, 0.018);
    const scabbard = new THREE.Mesh(
      scabbardGeo,
      new THREE.MeshStandardMaterial({ color: 0x111622, roughness: 0.32, metalness: 0.45 })
    );
    scabbard.position.y = -0.33;
    scabbard.castShadow = true;
    this.swordSheathedGroup.add(scabbard);

    // Four-Leaf Clover Heart Tsuba (Pink & Lime Green)
    const tsuba = new THREE.Mesh(
      new THREE.CylinderGeometry(0.052, 0.052, 0.014, 20),
      new THREE.MeshStandardMaterial({ color: 0xf43f5e, roughness: 0.28, metalness: 0.75 })
    );
    tsuba.position.y = 0.055;
    this.swordSheathedGroup.add(tsuba);

    // Hilt with lime wrapped ray-skin
    const tsuka = new THREE.Mesh(
      new THREE.CylinderGeometry(0.019, 0.019, 0.23, 14),
      new THREE.MeshStandardMaterial({ color: 0x84cc16, roughness: 0.55 })
    );
    tsuka.position.y = 0.17;
    this.swordSheathedGroup.add(tsuka);

    this.pelvisNode.add(this.swordSheathedGroup);

    // 2. Unsheathed Katana in Hand
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
      this.layers.haori = false; // Haori off
      this.layers.jacket = true;  // Open jacket
      this.layers.skirt = true;   // Mini skirt
      this.layers.stockings = true;
      this.layers.belt = true;
      this.layers.sword = true;
    } else if (mode === 'unclothed') {
      // Artistic Unclothed Full-Body Study (Complete Anatomical Elegance)
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
