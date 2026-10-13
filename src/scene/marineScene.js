import * as THREE from 'three';

export class MarineScene {
  constructor() {
    this.group = new THREE.Group();
    this.name = "marine";
    this.waterMesh = null;
    this.pontoonAssembly = null;
    this.pontoonCore = null;
    this.pontoonShell = null;
    this.pontoonRebar = null;
    this.exploded = false;
    this.explodedOffset = 0;
    this.init();
  }

  init() {
    // 1. Ocean Water Plane with custom vertex wave animation
    const waterGeo = new THREE.PlaneGeometry(36, 36, 64, 64);
    waterGeo.rotateX(-Math.PI / 2);

    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x05445e,
      roughness: 0.15,
      metalness: 0.85,
      transparent: true,
      opacity: 0.85,
      flatShading: true
    });

    this.waterMesh = new THREE.Mesh(waterGeo, waterMat);
    this.waterMesh.position.y = -0.4;
    this.group.add(this.waterMesh);

    // 2. Pontoon Assembly (Heavy Concrete Pontoon)
    this.pontoonAssembly = new THREE.Group();
    this.pontoonAssembly.position.set(0, 0, 0);

    const pontoonWidth = 7.0;
    const pontoonDepth = 3.6;
    const pontoonHeight = 1.4;

    // A. Concrete Outer Shell
    const concreteMat = new THREE.MeshStandardMaterial({
      color: 0x78808a, // High-density M60 Marine Concrete
      roughness: 0.88,
      metalness: 0.1
    });

    const deckMat = new THREE.MeshStandardMaterial({
      color: 0x9ba2ac,
      roughness: 0.95,
      metalness: 0.05
    });

    this.pontoonShell = new THREE.Group();

    // Bottom and side walls
    const baseGeo = new THREE.BoxGeometry(pontoonWidth, 0.18, pontoonDepth);
    const baseMesh = new THREE.Mesh(baseGeo, concreteMat);
    baseMesh.position.y = -pontoonHeight / 2 + 0.09;
    this.pontoonShell.add(baseMesh);

    // Deck top
    const deckGeo = new THREE.BoxGeometry(pontoonWidth, 0.18, pontoonDepth);
    const deckMesh = new THREE.Mesh(deckGeo, deckMat);
    deckMesh.position.y = pontoonHeight / 2 - 0.09;
    this.pontoonShell.add(deckMesh);

    // End walls & side walls
    const wallSideGeo = new THREE.BoxGeometry(pontoonWidth, pontoonHeight - 0.36, 0.18);
    const wallSide1 = new THREE.Mesh(wallSideGeo, concreteMat);
    wallSide1.position.set(0, 0, pontoonDepth / 2 - 0.09);
    const wallSide2 = new THREE.Mesh(wallSideGeo, concreteMat);
    wallSide2.position.set(0, 0, -pontoonDepth / 2 + 0.09);
    this.pontoonShell.add(wallSide1, wallSide2);

    const wallEndGeo = new THREE.BoxGeometry(0.18, pontoonHeight - 0.36, pontoonDepth);
    const wallEnd1 = new THREE.Mesh(wallEndGeo, concreteMat);
    wallEnd1.position.set(pontoonWidth / 2 - 0.09, 0, 0);
    const wallEnd2 = new THREE.Mesh(wallEndGeo, concreteMat);
    wallEnd2.position.set(-pontoonWidth / 2 + 0.09, 0, 0);
    this.pontoonShell.add(wallEnd1, wallEnd2);

    // Fenders along edges (Marine Rubber D-Fenders)
    const fenderMat = new THREE.MeshStandardMaterial({ color: 0x111317, roughness: 0.9 });
    for (let f = -1; f <= 1; f += 2) {
      const fenderGeo = new THREE.CylinderGeometry(0.1, 0.1, pontoonWidth, 12);
      fenderGeo.rotateZ(Math.PI / 2);
      const fender = new THREE.Mesh(fenderGeo, fenderMat);
      fender.position.set(0, pontoonHeight / 2 - 0.2, (f * pontoonDepth) / 2 + (f * 0.08));
      this.pontoonShell.add(fender);
    }

    // Heavy Bollards / Mooring Cleats on Deck
    const bollardMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37, // Polished Marine Bronze
      metalness: 0.9,
      roughness: 0.25
    });

    const bollardPositions = [
      [-pontoonWidth / 2 + 0.6, pontoonDepth / 2 - 0.4],
      [pontoonWidth / 2 - 0.6, pontoonDepth / 2 - 0.4],
      [-pontoonWidth / 2 + 0.6, -pontoonDepth / 2 + 0.4],
      [pontoonWidth / 2 - 0.6, -pontoonDepth / 2 + 0.4]
    ];

    bollardPositions.forEach(([bx, bz]) => {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.35, 12), bollardMat);
      post.position.set(bx, pontoonHeight / 2 + 0.17, bz);
      const cross = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.4, 8), bollardMat);
      cross.rotation.z = Math.PI / 2;
      cross.position.set(bx, pontoonHeight / 2 + 0.28, bz);
      this.pontoonShell.add(post, cross);
    });

    this.pontoonAssembly.add(this.pontoonShell);

    // B. Internal Non-Sinkable EPS Core (Virgin Expanded Polystyrene Block)
    const coreGeo = new THREE.BoxGeometry(pontoonWidth - 0.4, pontoonHeight - 0.4, pontoonDepth - 0.4);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x00c0f0, // Distinct High-Tech EPS Core Cyan
      roughness: 0.4,
      metalness: 0.1,
      transparent: true,
      opacity: 0.9
    });
    this.pontoonCore = new THREE.Mesh(coreGeo, coreMat);
    this.pontoonCore.position.set(0, 0, 0);
    this.pontoonAssembly.add(this.pontoonCore);

    // C. Internal Reinforcement Cage (Rebar Mesh)
    const rebarMat = new THREE.MeshBasicMaterial({
      color: 0xff6b00,
      wireframe: true,
      transparent: true,
      opacity: 0.5
    });
    const rebarGeo = new THREE.BoxGeometry(pontoonWidth - 0.25, pontoonHeight - 0.25, pontoonDepth - 0.25);
    this.pontoonRebar = new THREE.Mesh(rebarGeo, rebarMat);
    this.pontoonAssembly.add(this.pontoonRebar);

    // D. Mooring Chains plunging into ocean
    const chainMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8, roughness: 0.5 });
    for (let c = 0; c < 4; c++) {
      const chainGeo = new THREE.CylinderGeometry(0.03, 0.03, 5, 6);
      const chain = new THREE.Mesh(chainGeo, chainMat);
      const cx = (c % 2 === 0 ? 1 : -1) * (pontoonWidth / 2 - 0.4);
      const cz = (c < 2 ? 1 : -1) * (pontoonDepth / 2 - 0.4);
      chain.position.set(cx + cx * 0.3, -2.5, cz + cz * 0.3);
      chain.rotation.x = (cz > 0 ? 1 : -1) * 0.25;
      chain.rotation.z = (cx > 0 ? -1 : 1) * 0.25;
      this.pontoonAssembly.add(chain);
    }

    this.group.add(this.pontoonAssembly);

    // Marine Lighting
    const marineCyanLight = new THREE.PointLight(0x00e5ff, 25, 20);
    marineCyanLight.position.set(0, 4, 3);
    this.group.add(marineCyanLight);

    const sunGlance = new THREE.DirectionalLight(0xffffff, 2.5);
    sunGlance.position.set(6, 12, 8);
    this.group.add(sunGlance);
  }

  setExploded(isExploded) {
    this.exploded = isExploded;
  }

  update(time) {
    // 1. Water Wave Vertex Displacement
    if (this.waterMesh) {
      const pos = this.waterMesh.geometry.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const u = pos.getX(i);
        const v = pos.getZ(i);
        const wave =
          Math.sin(u * 0.4 + time * 1.5) * 0.18 +
          Math.cos(v * 0.5 + time * 1.2) * 0.14 +
          Math.sin((u + v) * 0.3 + time * 0.8) * 0.1;
        pos.setY(i, wave);
      }
      pos.needsUpdate = true;
      this.waterMesh.geometry.computeVertexNormals();
    }

    // 2. Pontoon Hydrodynamic Buoyancy (pitch, roll, heave)
    if (this.pontoonAssembly) {
      const waveHeave = Math.sin(time * 1.4) * 0.12 + Math.cos(time * 0.9) * 0.06;
      const waveRoll = Math.sin(time * 1.1) * 0.035;
      const wavePitch = Math.cos(time * 0.8) * 0.02;

      this.pontoonAssembly.position.y = waveHeave;
      this.pontoonAssembly.rotation.z = waveRoll;
      this.pontoonAssembly.rotation.x = wavePitch;
    }

    // 3. Exploded Inspection View Interpolation
    const targetOffset = this.exploded ? 2.2 : 0.0;
    this.explodedOffset += (targetOffset - this.explodedOffset) * 0.08;

    if (this.pontoonShell && this.pontoonCore && this.pontoonRebar) {
      this.pontoonShell.position.y = this.explodedOffset;
      this.pontoonRebar.position.y = -this.explodedOffset * 0.4;
      this.pontoonCore.position.y = 0;
      this.pontoonCore.scale.set(
        1 + this.explodedOffset * 0.05,
        1 + this.explodedOffset * 0.05,
        1 + this.explodedOffset * 0.05
      );
    }
  }
}
