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
  public skinSheen: number = 0.28;

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

  // Soft Dynamics Meshes
  public leftBustGroup: THREE.Group;
  public rightBustGroup: THREE.Group;
  public leftBustClothedMesh!: THREE.Mesh;
  public rightBustClothedMesh!: THREE.Mesh;
  public leftBustBareMesh!: THREE.Mesh;
  public rightBustBareMesh!: THREE.Mesh;

  // Hair Segments
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

  // Bare Body Mesh Groups (for artistic unclothed study)
  public bareTorsoMesh!: THREE.Mesh;

  // Shared Materials
  private skinMaterial!: THREE.MeshStandardMaterial;
  private hairMaterial!: THREE.MeshStandardMaterial;
  private faceMaterial!: THREE.MeshStandardMaterial;
  private darkFabricMaterial!: THREE.MeshStandardMaterial;
  private whiteFabricMaterial!: THREE.MeshStandardMaterial;
  private goldAccentMaterial!: THREE.MeshStandardMaterial;
  private stockingsMaterial!: THREE.MeshStandardMaterial;
  private bladeMaterial!: THREE.MeshStandardMaterial;

  constructor(dynamics: SecondaryDynamicsEngine) {
    this.dynamics = dynamics;
    this.root = new THREE.Group();
    this.root.name = 'AnimeHeroineRoot';

    // Initialize Shared Materials & Textures
    this.initMaterials();

    // Build Rigged Skeleton & Anatomical Groups
    this.pelvisNode = new THREE.Group();
    this.pelvisNode.position.y = 0.98;
    this.root.add(this.pelvisNode);

    this.spineNode = new THREE.Group();
    this.spineNode.position.y = 0.12;
    this.pelvisNode.add(this.spineNode);

    this.chestNode = new THREE.Group();
    this.chestNode.position.y = 0.18;
    this.spineNode.add(this.chestNode);

    this.neckNode = new THREE.Group();
    this.neckNode.position.y = 0.22;
    this.chestNode.add(this.neckNode);

    this.headNode = new THREE.Group();
    this.headNode.position.y = 0.08;
    this.neckNode.add(this.headNode);

    // Limbs nodes
    this.leftThighNode = new THREE.Group();
    this.leftThighNode.position.set(-0.11, -0.05, 0);
    this.pelvisNode.add(this.leftThighNode);

    this.leftShinNode = new THREE.Group();
    this.leftShinNode.position.set(0, -0.44, 0);
    this.leftThighNode.add(this.leftShinNode);

    this.rightThighNode = new THREE.Group();
    this.rightThighNode.position.set(0.11, -0.05, 0);
    this.pelvisNode.add(this.rightThighNode);

    this.rightShinNode = new THREE.Group();
    this.rightShinNode.position.set(0, -0.44, 0);
    this.rightThighNode.add(this.rightShinNode);

    this.leftUpperArmNode = new THREE.Group();
    this.leftUpperArmNode.position.set(-0.21, 0.16, 0);
    this.chestNode.add(this.leftUpperArmNode);

    this.leftForearmNode = new THREE.Group();
    this.leftForearmNode.position.set(0, -0.28, 0);
    this.leftUpperArmNode.add(this.leftForearmNode);

    this.rightUpperArmNode = new THREE.Group();
    this.rightUpperArmNode.position.set(0.21, 0.16, 0);
    this.chestNode.add(this.rightUpperArmNode);

    this.rightForearmNode = new THREE.Group();
    this.rightForearmNode.position.set(0, -0.28, 0);
    this.rightUpperArmNode.add(this.rightForearmNode);

    this.rightHandNode = new THREE.Group();
    this.rightHandNode.position.set(0, -0.26, 0);
    this.rightForearmNode.add(this.rightHandNode);

    // Costume & Body groups
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

    // Construct the 3D Character
    this.buildAnatomy();
    this.buildHairAndHead();
    this.buildCostume();
    this.buildSword();

    // Apply initial appearance state
    this.setAppearanceMode('full');
  }

  // --- MATERIAL INITIALIZATION ---
  private initMaterials() {
    // 1. Anime Skin Material: Soft, warm porcelain with gentle peach undertones & rim fresnel
    this.skinMaterial = new THREE.MeshStandardMaterial({
      color: 0xffdfd2,
      roughness: 0.62,
      metalness: 0.04,
      envMapIntensity: 0.5,
    });

    // 2. Hair Texture: Radiant Sakura Pink to Lime Green Gradient
    const hairCanvas = document.createElement('canvas');
    hairCanvas.width = 128;
    hairCanvas.height = 512;
    const hCtx = hairCanvas.getContext('2d')!;
    const hGrad = hCtx.createLinearGradient(0, 0, 0, 512);
    hGrad.addColorStop(0.0, '#ff9ec2'); // Light pastel pink roots
    hGrad.addColorStop(0.45, '#f45a90'); // Rich vibrant blossom pink
    hGrad.addColorStop(0.72, '#9bd852'); // Transition lime yellow
    hGrad.addColorStop(1.0, '#66ca25'); // Electric anime lime green tips
    hCtx.fillStyle = hGrad;
    hCtx.fillRect(0, 0, 128, 512);

    // Add subtle hair strand highlights
    hCtx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    for (let i = 0; i < 20; i++) {
      hCtx.fillRect(Math.random() * 128, 0, 2, 512);
    }
    const hairTexture = new THREE.CanvasTexture(hairCanvas);

    this.hairMaterial = new THREE.MeshStandardMaterial({
      map: hairTexture,
      roughness: 0.45,
      metalness: 0.08,
      bumpScale: 0.02,
    });

    // 3. Face Texture: Expressive anime eyes with gradient green irises, eyelashes, blush, and twin beauty marks
    this.faceMaterial = this.createFaceMaterial('smile');

    // 4. Fabric Materials
    this.darkFabricMaterial = new THREE.MeshStandardMaterial({
      color: 0x181c24, // Midnight obsidian combat cloth
      roughness: 0.75,
      metalness: 0.08,
    });

    this.whiteFabricMaterial = new THREE.MeshStandardMaterial({
      color: 0xf8faff, // Crisp silk haori
      roughness: 0.55,
      metalness: 0.05,
      side: THREE.DoubleSide,
    });

    this.goldAccentMaterial = new THREE.MeshStandardMaterial({
      color: 0xf5b53b, // Gilded buttons & belt buckle
      roughness: 0.28,
      metalness: 0.85,
    });

    // 5. Stockings Texture: Striped lime green & navy
    const sockCanvas = document.createElement('canvas');
    sockCanvas.width = 64;
    sockCanvas.height = 256;
    const sCtx = sockCanvas.getContext('2d')!;
    sCtx.fillStyle = '#6bc82a'; // Lime green base
    sCtx.fillRect(0, 0, 64, 256);
    sCtx.fillStyle = '#1e2430'; // Navy stripes
    for (let y = 0; y < 256; y += 32) {
      sCtx.fillRect(0, y, 64, 14);
    }
    const sockTexture = new THREE.CanvasTexture(sockCanvas);
    sockTexture.wrapS = THREE.RepeatWrapping;
    sockTexture.wrapT = THREE.RepeatWrapping;
    sockTexture.repeat.set(1, 2);

    this.stockingsMaterial = new THREE.MeshStandardMaterial({
      map: sockTexture,
      roughness: 0.6,
      metalness: 0.05,
    });

    // 6. Blade Material: Polished steel with pink/cyan sheen
    this.bladeMaterial = new THREE.MeshStandardMaterial({
      color: 0xf0f4f8,
      roughness: 0.18,
      metalness: 0.95,
      envMapIntensity: 1.2,
    });
  }

  private createFaceMaterial(expr: FacialExpression): THREE.MeshStandardMaterial {
    const fCanvas = document.createElement('canvas');
    fCanvas.width = 512;
    fCanvas.height = 512;
    const ctx = fCanvas.getContext('2d')!;

    // Base skin tone
    ctx.fillStyle = '#ffdfd2';
    ctx.fillRect(0, 0, 512, 512);

    // Warm rosy cheek blush
    const leftBlush = ctx.createRadialGradient(160, 310, 5, 160, 310, 48);
    leftBlush.addColorStop(0, expr === 'blush' ? 'rgba(255, 90, 130, 0.6)' : 'rgba(255, 110, 140, 0.38)');
    leftBlush.addColorStop(1, 'rgba(255, 223, 210, 0)');
    ctx.fillStyle = leftBlush;
    ctx.beginPath();
    ctx.arc(160, 310, 48, 0, Math.PI * 2);
    ctx.fill();

    const rightBlush = ctx.createRadialGradient(352, 310, 5, 352, 310, 48);
    rightBlush.addColorStop(0, expr === 'blush' ? 'rgba(255, 90, 130, 0.6)' : 'rgba(255, 110, 140, 0.38)');
    rightBlush.addColorStop(1, 'rgba(255, 223, 210, 0)');
    ctx.fillStyle = rightBlush;
    ctx.beginPath();
    ctx.arc(352, 310, 48, 0, Math.PI * 2);
    ctx.fill();

    // Dual beauty marks under each eye (iconic signature from references!)
    ctx.fillStyle = '#5c3832';
    ctx.beginPath();
    ctx.arc(148, 332, 3.2, 0, Math.PI * 2);
    ctx.arc(172, 335, 3.2, 0, Math.PI * 2);
    ctx.arc(340, 335, 3.2, 0, Math.PI * 2);
    ctx.arc(364, 332, 3.2, 0, Math.PI * 2);
    ctx.fill();

    // Large Anime Eyes
    const drawEye = (cx: number, cy: number, isLeft: boolean) => {
      // Sclera (White)
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(cx, cy, 42, 48, 0, 0, Math.PI * 2);
      ctx.fill();

      // Iris gradient: Emerald green to golden yellow
      const irisGrad = ctx.createLinearGradient(cx, cy - 40, cx, cy + 40);
      irisGrad.addColorStop(0, '#156b2e'); // Deep emerald
      irisGrad.addColorStop(0.5, '#4cd660'); // Bright leaf green
      irisGrad.addColorStop(1, '#b0e932'); // Golden yellow-green
      ctx.fillStyle = irisGrad;
      ctx.beginPath();
      ctx.ellipse(cx, cy + 2, 33, 40, 0, 0, Math.PI * 2);
      ctx.fill();

      // Pupil
      ctx.fillStyle = '#0a2e16';
      ctx.beginPath();
      ctx.ellipse(cx, cy + 4, 15, 20, 0, 0, Math.PI * 2);
      ctx.fill();

      // Bright specular shine
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.beginPath();
      ctx.ellipse(cx - 10, cy - 12, 11, 14, -0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx + 12, cy + 14, 6, 0, Math.PI * 2);
      ctx.fill();

      // Eyelashes & Upper Lid Liner
      ctx.strokeStyle = '#2b1d1a';
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(cx, cy + 5, 43, Math.PI * 1.15, Math.PI * 1.85);
      ctx.stroke();

      // Outer lash wing
      ctx.beginPath();
      if (isLeft) {
        ctx.moveTo(cx - 36, cy - 18);
        ctx.lineTo(cx - 48, cy - 26);
      } else {
        ctx.moveTo(cx + 36, cy - 18);
        ctx.lineTo(cx + 48, cy - 26);
      }
      ctx.stroke();
    };

    drawEye(165, 260, true);
    drawEye(347, 260, false);

    // Eyebrows
    ctx.strokeStyle = '#d94b7e';
    ctx.lineWidth = 4;
    ctx.beginPath();
    if (expr === 'fierce') {
      ctx.moveTo(125, 200);
      ctx.lineTo(205, 215);
      ctx.moveTo(387, 200);
      ctx.lineTo(307, 215);
    } else {
      ctx.moveTo(125, 208);
      ctx.quadraticCurveTo(165, 195, 205, 206);
      ctx.moveTo(307, 206);
      ctx.quadraticCurveTo(347, 195, 387, 208);
    }
    ctx.stroke();

    // Cute nose highlight / soft shadow
    ctx.fillStyle = '#e8a892';
    ctx.beginPath();
    ctx.arc(256, 315, 3, 0, Math.PI * 2);
    ctx.fill();

    // Expressive Mouth & Lips
    ctx.strokeStyle = '#c43d5b';
    ctx.fillStyle = '#ff6b8b';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    if (expr === 'smile' || expr === 'blush') {
      ctx.arc(256, 360, 22, 0.15, Math.PI - 0.15);
      ctx.stroke();
      ctx.fillStyle = '#fca5a5';
      ctx.fill();
    } else if (expr === 'confident') {
      ctx.moveTo(236, 365);
      ctx.quadraticCurveTo(256, 375, 280, 360);
      ctx.stroke();
    } else {
      ctx.moveTo(242, 365);
      ctx.lineTo(270, 365);
      ctx.stroke();
    }

    const tex = new THREE.CanvasTexture(fCanvas);
    return new THREE.MeshStandardMaterial({
      map: tex,
      roughness: 0.58,
      metalness: 0.04,
    });
  }

  // --- ANATOMICAL BODY BUILDER ---
  private buildAnatomy() {
    // 1. Pelvis / Hips (curvaceous adult silhouette)
    const pelvisGeo = new THREE.CylinderGeometry(0.19, 0.17, 0.22, 24);
    pelvisGeo.scale(1.15, 1, 0.95);
    const pelvisMesh = new THREE.Mesh(pelvisGeo, this.skinMaterial);
    pelvisMesh.castShadow = true;
    pelvisMesh.receiveShadow = true;
    this.pelvisNode.add(pelvisMesh);

    // Glute / Hip contour curves
    const hipLeft = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), this.skinMaterial);
    hipLeft.position.set(-0.12, -0.04, -0.02);
    hipLeft.scale.set(1.05, 1.15, 1.25);
    this.pelvisNode.add(hipLeft);

    const hipRight = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), this.skinMaterial);
    hipRight.position.set(0.12, -0.04, -0.02);
    hipRight.scale.set(1.05, 1.15, 1.25);
    this.pelvisNode.add(hipRight);

    // 2. Waist / Lower Torso (narrow waist with subtle hourglass flare)
    const waistGeo = new THREE.CylinderGeometry(0.145, 0.18, 0.2, 24);
    waistGeo.scale(1.05, 1, 0.88);
    this.bareTorsoMesh = new THREE.Mesh(waistGeo, this.skinMaterial);
    this.bareTorsoMesh.position.y = 0.04;
    this.bareTorsoMesh.castShadow = true;
    this.spineNode.add(this.bareTorsoMesh);

    // Navel indention
    const navel = new THREE.Mesh(
      new THREE.SphereGeometry(0.012, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0xc88272 })
    );
    navel.position.set(0, 0.02, 0.128);
    this.spineNode.add(navel);

    // 3. Ribcage / Upper Chest
    const ribcageGeo = new THREE.CylinderGeometry(0.17, 0.145, 0.2, 24);
    ribcageGeo.scale(1.1, 1, 0.9);
    const ribcageMesh = new THREE.Mesh(ribcageGeo, this.skinMaterial);
    ribcageMesh.castShadow = true;
    this.chestNode.add(ribcageMesh);

    // Clavicles / Collarbones
    const collarLeft = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.15, 8), this.skinMaterial);
    collarLeft.rotation.z = 1.35;
    collarLeft.position.set(-0.09, 0.14, 0.08);
    this.chestNode.add(collarLeft);

    const collarRight = collarLeft.clone();
    collarRight.rotation.z = -1.35;
    collarRight.position.set(0.09, 0.14, 0.08);
    this.chestNode.add(collarRight);

    // 4. BUST GEOMETRY WITH DUAL DYNAMICS NODES (Full adult fantasy proportions)
    // Left Bust Group
    this.leftBustGroup.position.set(-0.088, 0.04, 0.135);
    this.chestNode.add(this.leftBustGroup);

    // Bare bust sphere (for artistic study)
    const bustGeo = new THREE.SphereGeometry(0.115, 24, 24);
    bustGeo.scale(1.0, 1.15, 1.25);
    this.leftBustBareMesh = new THREE.Mesh(bustGeo, this.skinMaterial);
    this.leftBustBareMesh.rotation.x = -0.15;
    this.leftBustBareMesh.castShadow = true;
    this.leftBustGroup.add(this.leftBustBareMesh);

    // Clothed bust sphere (with open uniform cleavage seam & dark fabric)
    this.leftBustClothedMesh = new THREE.Mesh(bustGeo.clone(), this.darkFabricMaterial);
    this.leftBustClothedMesh.rotation.x = -0.15;
    this.leftBustClothedMesh.castShadow = true;
    this.leftBustGroup.add(this.leftBustClothedMesh);

    // Right Bust Group
    this.rightBustGroup.position.set(0.088, 0.04, 0.135);
    this.chestNode.add(this.rightBustGroup);

    this.rightBustBareMesh = new THREE.Mesh(bustGeo.clone(), this.skinMaterial);
    this.rightBustBareMesh.rotation.x = -0.15;
    this.rightBustBareMesh.castShadow = true;
    this.rightBustGroup.add(this.rightBustBareMesh);

    this.rightBustClothedMesh = new THREE.Mesh(bustGeo.clone(), this.darkFabricMaterial);
    this.rightBustClothedMesh.rotation.x = -0.15;
    this.rightBustClothedMesh.castShadow = true;
    this.rightBustGroup.add(this.rightBustClothedMesh);

    // 5. Neck
    const neckGeo = new THREE.CylinderGeometry(0.065, 0.075, 0.14, 16);
    const neckMesh = new THREE.Mesh(neckGeo, this.skinMaterial);
    neckMesh.castShadow = true;
    this.neckNode.add(neckMesh);

    // 6. Limbs: Shapely Legs (Thighs, Knees, Calves)
    // Left Thigh
    const thighGeo = new THREE.CylinderGeometry(0.105, 0.072, 0.44, 20);
    const leftThighMesh = new THREE.Mesh(thighGeo, this.skinMaterial);
    leftThighMesh.position.y = -0.22;
    leftThighMesh.castShadow = true;
    this.leftThighNode.add(leftThighMesh);

    // Left Shin & Calf
    const calfGeo = new THREE.CylinderGeometry(0.072, 0.048, 0.44, 20);
    const leftCalfMesh = new THREE.Mesh(calfGeo, this.skinMaterial);
    leftCalfMesh.position.y = -0.22;
    leftCalfMesh.castShadow = true;
    this.leftShinNode.add(leftCalfMesh);

    // Left Foot
    const footGeo = new THREE.BoxGeometry(0.08, 0.06, 0.18);
    const leftFootMesh = new THREE.Mesh(footGeo, this.skinMaterial);
    leftFootMesh.position.set(0, -0.44, 0.04);
    leftFootMesh.castShadow = true;
    this.leftShinNode.add(leftFootMesh);

    // Right Thigh
    const rightThighMesh = new THREE.Mesh(thighGeo.clone(), this.skinMaterial);
    rightThighMesh.position.y = -0.22;
    rightThighMesh.castShadow = true;
    this.rightThighNode.add(rightThighMesh);

    // Right Shin & Calf
    const rightCalfMesh = new THREE.Mesh(calfGeo.clone(), this.skinMaterial);
    rightCalfMesh.position.y = -0.22;
    rightCalfMesh.castShadow = true;
    this.rightShinNode.add(rightCalfMesh);

    // Right Foot
    const rightFootMesh = new THREE.Mesh(footGeo.clone(), this.skinMaterial);
    rightFootMesh.position.set(0, -0.44, 0.04);
    rightFootMesh.castShadow = true;
    this.rightShinNode.add(rightFootMesh);

    // 7. Limbs: Arms & Hands
    const upperArmGeo = new THREE.CylinderGeometry(0.052, 0.044, 0.28, 16);
    const forearmGeo = new THREE.CylinderGeometry(0.044, 0.036, 0.26, 16);
    const handGeo = new THREE.BoxGeometry(0.06, 0.08, 0.03);

    // Left Arm
    const leftUpperArmMesh = new THREE.Mesh(upperArmGeo, this.skinMaterial);
    leftUpperArmMesh.position.y = -0.14;
    leftUpperArmMesh.castShadow = true;
    this.leftUpperArmNode.add(leftUpperArmMesh);

    const leftForearmMesh = new THREE.Mesh(forearmGeo, this.skinMaterial);
    leftForearmMesh.position.y = -0.13;
    leftForearmMesh.castShadow = true;
    this.leftForearmNode.add(leftForearmMesh);

    const leftHandMesh = new THREE.Mesh(handGeo, this.skinMaterial);
    leftHandMesh.position.set(0, -0.04, 0);
    this.leftForearmNode.add(leftHandMesh);

    // Right Arm
    const rightUpperArmMesh = new THREE.Mesh(upperArmGeo.clone(), this.skinMaterial);
    rightUpperArmMesh.position.y = -0.14;
    rightUpperArmMesh.castShadow = true;
    this.rightUpperArmNode.add(rightUpperArmMesh);

    const rightForearmMesh = new THREE.Mesh(forearmGeo.clone(), this.skinMaterial);
    rightForearmMesh.position.y = -0.13;
    rightForearmMesh.castShadow = true;
    this.rightForearmNode.add(rightForearmMesh);

    const rightHandMesh = new THREE.Mesh(handGeo.clone(), this.skinMaterial);
    rightHandMesh.position.set(0, -0.04, 0);
    this.rightHandNode.add(rightHandMesh);
  }

  // --- HEAD, FACE & BRAIDED HAIR BUILDER ---
  private buildHairAndHead() {
    // 1. Head Face Oval
    const headGeo = new THREE.SphereGeometry(0.14, 24, 24);
    headGeo.scale(0.92, 1.08, 0.96);
    const headMesh = new THREE.Mesh(headGeo, this.faceMaterial);
    headMesh.position.set(0, 0.11, 0);
    headMesh.castShadow = true;
    this.headNode.add(headMesh);

    // Chin taper
    const chinGeo = new THREE.ConeGeometry(0.085, 0.12, 16);
    chinGeo.scale(1, 1, 0.7);
    const chinMesh = new THREE.Mesh(chinGeo, this.skinMaterial);
    chinMesh.rotation.x = Math.PI;
    chinMesh.position.set(0, 0.02, 0.035);
    this.headNode.add(chinMesh);

    // 2. Hair Crown / Scalp (Voluminous Anime Hair)
    const hairCrownGeo = new THREE.SphereGeometry(0.155, 24, 24);
    hairCrownGeo.scale(0.98, 1.05, 1.08);
    const hairCrown = new THREE.Mesh(hairCrownGeo, this.hairMaterial);
    hairCrown.position.set(0, 0.13, -0.025);
    hairCrown.castShadow = true;
    this.headNode.add(hairCrown);

    // Center Bangs & Forehead Strands (Lime tips)
    const bangGeo = new THREE.ConeGeometry(0.04, 0.16, 12);
    const centerBang = new THREE.Mesh(bangGeo, this.hairMaterial);
    centerBang.rotation.x = -2.8;
    centerBang.position.set(0, 0.19, 0.14);
    this.headNode.add(centerBang);

    const leftBang = new THREE.Mesh(bangGeo, this.hairMaterial);
    leftBang.rotation.set(-2.6, 0, 0.35);
    leftBang.position.set(-0.065, 0.18, 0.13);
    this.headNode.add(leftBang);

    const rightBang = new THREE.Mesh(bangGeo, this.hairMaterial);
    rightBang.rotation.set(-2.6, 0, -0.35);
    rightBang.position.set(0.065, 0.18, 0.13);
    this.headNode.add(rightBang);

    // 3. Thick Braided Twintails (Segmented chains for real-time spring physics)
    // Left Braid Chain (4 interconnected joint nodes)
    let parentNode: THREE.Group = this.headNode;
    this.leftBraidSegments = [];
    const braidBaseLeft = new THREE.Group();
    braidBaseLeft.position.set(-0.13, 0.08, 0.04);
    this.headNode.add(braidBaseLeft);
    parentNode = braidBaseLeft;

    for (let i = 0; i < 4; i++) {
      const segGroup = new THREE.Group();
      segGroup.position.set(0, i === 0 ? 0 : -0.11, 0);

      // Stylized braided woven sphere pod
      const pod = new THREE.Mesh(new THREE.SphereGeometry(0.06 - i * 0.008, 16, 16), this.hairMaterial);
      pod.scale.set(1.1, 1.4, 0.95);
      pod.castShadow = true;
      segGroup.add(pod);

      parentNode.add(segGroup);
      this.leftBraidSegments.push(segGroup);
      parentNode = segGroup;
    }

    // Right Braid Chain
    this.rightBraidSegments = [];
    const braidBaseRight = new THREE.Group();
    braidBaseRight.position.set(0.13, 0.08, 0.04);
    this.headNode.add(braidBaseRight);
    parentNode = braidBaseRight;

    for (let i = 0; i < 4; i++) {
      const segGroup = new THREE.Group();
      segGroup.position.set(0, i === 0 ? 0 : -0.11, 0);

      const pod = new THREE.Mesh(new THREE.SphereGeometry(0.06 - i * 0.008, 16, 16), this.hairMaterial);
      pod.scale.set(1.1, 1.4, 0.95);
      pod.castShadow = true;
      segGroup.add(pod);

      parentNode.add(segGroup);
      this.rightBraidSegments.push(segGroup);
      parentNode = segGroup;
    }

    // Back Hair Flow (Drapes down the back)
    this.backHairGroup.position.set(0, 0.08, -0.11);
    const backHairGeo = new THREE.CylinderGeometry(0.11, 0.14, 0.35, 16);
    backHairGeo.scale(1.2, 1, 0.6);
    const backHairMesh = new THREE.Mesh(backHairGeo, this.hairMaterial);
    backHairMesh.position.y = -0.14;
    backHairMesh.castShadow = true;
    this.backHairGroup.add(backHairMesh);
    this.headNode.add(this.backHairGroup);
  }

  // --- COSTUME LAYERS BUILDER ---
  private buildCostume() {
    // 1. HAORI (Outer white cape with flowing sleeves)
    this.haoriGroup.name = 'HaoriLayer';
    const capeGeo = new THREE.CylinderGeometry(0.24, 0.36, 0.72, 20, 1, true, 0.5, Math.PI * 1.6);
    const haoriCape = new THREE.Mesh(capeGeo, this.whiteFabricMaterial);
    haoriCape.position.set(0, -0.15, -0.04);
    haoriCape.castShadow = true;
    this.haoriGroup.add(haoriCape);

    // Left Haori Hanging Sleeve
    const sleeveGeo = new THREE.CylinderGeometry(0.09, 0.13, 0.38, 16);
    const leftSleeve = new THREE.Mesh(sleeveGeo, this.whiteFabricMaterial);
    leftSleeve.position.set(0, -0.14, 0);
    leftSleeve.castShadow = true;
    this.leftUpperArmNode.add(leftSleeve);

    const rightSleeve = new THREE.Mesh(sleeveGeo.clone(), this.whiteFabricMaterial);
    rightSleeve.position.set(0, -0.14, 0);
    rightSleeve.castShadow = true;
    this.rightUpperArmNode.add(rightSleeve);

    this.chestNode.add(this.haoriGroup);

    // 2. UNIFORM JACKET (Demon-slayer style black combat uniform with open chest neckline & gold buttons)
    this.jacketGroup.name = 'JacketLayer';
    const jacketTorsoGeo = new THREE.CylinderGeometry(0.175, 0.15, 0.22, 24);
    jacketTorsoGeo.scale(1.12, 1, 0.92);
    const jacketTorso = new THREE.Mesh(jacketTorsoGeo, this.darkFabricMaterial);
    this.jacketGroup.add(jacketTorso);

    // White shirt collar around neck
    const collarGeo = new THREE.CylinderGeometry(0.082, 0.095, 0.06, 20);
    const collar = new THREE.Mesh(collarGeo, this.whiteFabricMaterial);
    collar.position.y = 0.11;
    this.jacketGroup.add(collar);

    // Golden embossed buttons along the side of the open placket
    for (let i = 0; i < 3; i++) {
      const btnLeft = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.008, 12), this.goldAccentMaterial);
      btnLeft.rotation.x = Math.PI / 2;
      btnLeft.position.set(-0.11, 0.05 - i * 0.06, 0.12);
      this.jacketGroup.add(btnLeft);

      const btnRight = btnLeft.clone();
      btnRight.position.x = 0.11;
      this.jacketGroup.add(btnRight);
    }

    this.chestNode.add(this.jacketGroup);

    // 3. PLEATED MINI SKIRT
    this.skirtGroup.name = 'SkirtLayer';
    const skirtGeo = new THREE.ConeGeometry(0.29, 0.24, 24, 1, true);
    skirtGeo.scale(1.15, 1, 0.95);
    const skirtMesh = new THREE.Mesh(skirtGeo, this.darkFabricMaterial);
    skirtMesh.position.y = -0.08;
    skirtMesh.castShadow = true;
    this.skirtGroup.add(skirtMesh);
    this.pelvisNode.add(this.skirtGroup);

    // 4. WHITE LEATHER BELT & SILVER BUCKLE
    this.beltGroup.name = 'BeltLayer';
    const beltGeo = new THREE.CylinderGeometry(0.185, 0.185, 0.05, 24);
    beltGeo.scale(1.1, 1, 0.92);
    const beltMesh = new THREE.Mesh(beltGeo, this.whiteFabricMaterial);
    beltMesh.position.y = 0.08;
    this.beltGroup.add(beltMesh);

    // Polished Silver Buckle
    const buckle = new THREE.Mesh(
      new THREE.BoxGeometry(0.045, 0.055, 0.015),
      new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.2, metalness: 0.9 })
    );
    buckle.position.set(0, 0.08, 0.178);
    this.beltGroup.add(buckle);
    this.pelvisNode.add(this.beltGroup);

    // 5. THIGH-HIGH STRIPED STOCKINGS (Lime green & navy)
    this.stockingsGroup.name = 'StockingsLayer';
    const sockThighGeo = new THREE.CylinderGeometry(0.108, 0.075, 0.32, 20);
    const leftSockThigh = new THREE.Mesh(sockThighGeo, this.stockingsMaterial);
    leftSockThigh.position.y = -0.28;
    this.leftThighNode.add(leftSockThigh);

    const rightSockThigh = new THREE.Mesh(sockThighGeo.clone(), this.stockingsMaterial);
    rightSockThigh.position.y = -0.28;
    this.rightThighNode.add(rightSockThigh);

    // Calves stockings
    const sockCalfGeo = new THREE.CylinderGeometry(0.075, 0.052, 0.44, 20);
    const leftSockCalf = new THREE.Mesh(sockCalfGeo, this.stockingsMaterial);
    leftSockCalf.position.y = -0.22;
    this.leftShinNode.add(leftSockCalf);

    const rightSockCalf = new THREE.Mesh(sockCalfGeo.clone(), this.stockingsMaterial);
    rightSockCalf.position.y = -0.22;
    this.rightShinNode.add(rightSockCalf);

    // Pink Ribbon Laces around ankles/calves
    const ribbonMat = new THREE.MeshStandardMaterial({ color: 0xf43f5e, roughness: 0.5 });
    const laceRing = new THREE.Mesh(new THREE.TorusGeometry(0.065, 0.008, 8, 20), ribbonMat);
    laceRing.rotation.x = Math.PI / 2;
    laceRing.position.y = -0.38;
    this.leftShinNode.add(laceRing);

    const laceRingRight = laceRing.clone();
    this.rightShinNode.add(laceRingRight);
  }

  // --- NICHIRIN SWORD & SCABBARD BUILDER ---
  private buildSword() {
    // 1. Sheathed Katana at Hip (Default state)
    this.swordSheathedGroup.position.set(-0.21, 0.02, 0.02);
    this.swordSheathedGroup.rotation.set(0.3, 0.2, 0.7);

    // Scabbard (Black with pink lotus motifs)
    const scabbardGeo = new THREE.BoxGeometry(0.032, 0.75, 0.016);
    const scabbard = new THREE.Mesh(
      scabbardGeo,
      new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.4, metalness: 0.3 })
    );
    scabbard.position.y = -0.32;
    scabbard.castShadow = true;
    this.swordSheathedGroup.add(scabbard);

    // Four-Leaf Heart Tsuba / Guard (Iconic pink & lime green guard from references!)
    const tsuba = new THREE.Mesh(
      new THREE.CylinderGeometry(0.048, 0.048, 0.012, 16),
      new THREE.MeshStandardMaterial({ color: 0xf43f5e, roughness: 0.3, metalness: 0.7 })
    );
    tsuba.position.y = 0.05;
    this.swordSheathedGroup.add(tsuba);

    // Tsuka (Hilt with woven lime wrap)
    const tsukaGeo = new THREE.CylinderGeometry(0.018, 0.018, 0.22, 12);
    const tsuka = new THREE.Mesh(
      tsukaGeo,
      new THREE.MeshStandardMaterial({ color: 0x84cc16, roughness: 0.6 })
    );
    tsuka.position.y = 0.16;
    this.swordSheathedGroup.add(tsuka);

    this.pelvisNode.add(this.swordSheathedGroup);

    // 2. Unsheathed Sword (When drawn in hand)
    this.swordHandGroup.position.set(0, -0.06, 0.05);
    this.swordHandGroup.rotation.x = -Math.PI / 2;

    // Full Flexible Nichirin Blade
    const bladeGeo = new THREE.BoxGeometry(0.024, 0.88, 0.008);
    const blade = new THREE.Mesh(bladeGeo, this.bladeMaterial);
    blade.position.y = 0.44;
    blade.castShadow = true;
    this.swordHandGroup.add(blade);

    // Tsuba & Hilt in hand
    const handTsuba = tsuba.clone();
    handTsuba.position.y = 0;
    this.swordHandGroup.add(handTsuba);

    const handTsuka = tsuka.clone();
    handTsuka.position.y = -0.11;
    this.swordHandGroup.add(handTsuka);

    this.rightHandNode.add(this.swordHandGroup);
    this.swordHandGroup.visible = false; // Initially sheathed
  }

  // --- APPEARANCE & COSTUME CONTROLS ---
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
      this.layers.haori = false; // Removed outer haori
      this.layers.jacket = true;  // Open jacket
      this.layers.skirt = true;   // Mini skirt
      this.layers.stockings = true;
      this.layers.belt = true;
      this.layers.sword = true;
    } else if (mode === 'unclothed') {
      // Artistic unclothed full-body study
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

    // Toggle bust mesh representation
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

    // Toggle stockings
    const showSocks = this.layers.stockings;
    this.leftThighNode.children.forEach((c) => {
      if (c.name === 'StockingsLayer' || (c as any).material === this.stockingsMaterial) {
        c.visible = showSocks;
      }
    });
    this.rightThighNode.children.forEach((c) => {
      if (c.name === 'StockingsLayer' || (c as any).material === this.stockingsMaterial) {
        c.visible = showSocks;
      }
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
    this.faceMaterial = this.createFaceMaterial(expr);
    // Find head mesh and update material
    this.headNode.children.forEach((c) => {
      if (c instanceof THREE.Mesh && (c.material === oldMat || (c.material as any).map)) {
        c.material = this.faceMaterial;
      }
    });
  }

  public setSkinSheen(val: number) {
    this.skinSheen = val;
    this.skinMaterial.roughness = THREE.MathUtils.lerp(0.72, 0.22, val);
    this.skinMaterial.metalness = THREE.MathUtils.lerp(0.02, 0.18, val);
  }

  // --- DYNAMIC UPDATE IN ANIMATION LOOP ---
  public updatePhysics(_dt: number) {
    // 1. Apply dual-mass soft-body bust offsets
    const leftOffset = this.dynamics.getLeftBustOffset();
    const rightOffset = this.dynamics.getRightBustOffset();

    this.leftBustGroup.position.set(
      -0.088 + leftOffset.x,
      0.04 + leftOffset.y,
      0.135 + leftOffset.z
    );

    this.rightBustGroup.position.set(
      0.088 + rightOffset.x,
      0.04 + rightOffset.y,
      0.135 + rightOffset.z
    );

    // 2. Apply spring chain rotation to hair braids
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

    // 3. Haori sleeves flutter with wind
    const wind = this.dynamics.currentWindVector;
    this.haoriGroup.rotation.x = -wind.z * 0.25;
    this.haoriGroup.rotation.z = wind.x * 0.25;
    this.skirtGroup.rotation.x = -wind.z * 0.15;
    this.skirtGroup.rotation.z = wind.x * 0.15;
  }
}
