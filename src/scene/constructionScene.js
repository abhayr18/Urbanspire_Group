import * as THREE from 'three';

export class ConstructionScene {
  constructor() {
    this.group = new THREE.Group();
    this.name = "construction";
    this.sparks = null;
    this.craneArm = null;
    this.buildingFloors = [];
    this.init();
  }

  init() {
    // 1. Foundation Blueprint Grid
    const gridHelper = new THREE.GridHelper(30, 30, 0xff6b00, 0x222a38);
    gridHelper.position.y = -2;
    this.group.add(gridHelper);

    // 2. High-Rise Tower (Procedural Architectural Slabs & Columns)
    const towerGroup = new THREE.Group();
    towerGroup.position.set(0, -2, 0);

    const floorCount = 18;
    const floorWidth = 4.8;
    const floorDepth = 4.8;
    const floorHeight = 0.55;

    const concreteMat = new THREE.MeshStandardMaterial({
      color: 0x2a303c,
      roughness: 0.85,
      metalness: 0.15
    });

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x4a90e2,
      roughness: 0.1,
      metalness: 0.9,
      transmission: 0.6,
      transparent: true,
      opacity: 0.75
    });

    const wireframeMat = new THREE.MeshBasicMaterial({
      color: 0xff8c2a,
      wireframe: true,
      transparent: true,
      opacity: 0.35
    });

    for (let i = 0; i < floorCount; i++) {
      const slabGeo = new THREE.BoxGeometry(
        floorWidth - i * 0.12,
        0.08,
        floorDepth - i * 0.12
      );
      const slab = new THREE.Mesh(slabGeo, concreteMat);
      slab.position.y = i * floorHeight;
      towerGroup.add(slab);

      // Glass core
      if (i < floorCount - 1) {
        const coreGeo = new THREE.BoxGeometry(
          floorWidth - i * 0.12 - 0.4,
          floorHeight - 0.08,
          floorDepth - i * 0.12 - 0.4
        );
        const core = new THREE.Mesh(coreGeo, i > 12 ? wireframeMat : glassMat);
        core.position.y = i * floorHeight + (floorHeight - 0.08) / 2;
        towerGroup.add(core);

        // Columns at corners
        const colGeo = new THREE.CylinderGeometry(0.06, 0.06, floorHeight - 0.08, 8);
        const halfW = (floorWidth - i * 0.12) / 2 - 0.15;
        const halfD = (floorDepth - i * 0.12) / 2 - 0.15;
        const corners = [
          [-halfW, -halfD],
          [halfW, -halfD],
          [-halfW, halfD],
          [halfW, halfD]
        ];
        corners.forEach(([cx, cz]) => {
          const col = new THREE.Mesh(colGeo, concreteMat);
          col.position.set(cx, i * floorHeight + (floorHeight - 0.08) / 2, cz);
          towerGroup.add(col);
        });
      }

      this.buildingFloors.push(slab);
    }

    // Top Construction Crane
    const craneGroup = new THREE.Group();
    craneGroup.position.set(0.6, floorCount * floorHeight, 0.6);

    const mastGeo = new THREE.BoxGeometry(0.35, 3.2, 0.35);
    const mastMat = new THREE.MeshStandardMaterial({ color: 0xff6b00, roughness: 0.5 });
    const mast = new THREE.Mesh(mastGeo, mastMat);
    mast.position.y = 1.6;
    craneGroup.add(mast);

    const armGeo = new THREE.BoxGeometry(0.25, 0.25, 5.5);
    const arm = new THREE.Mesh(armGeo, mastMat);
    arm.position.set(0, 3.2, 1.2);
    craneGroup.add(arm);
    this.craneArm = craneGroup;

    // Crane beacon light
    const beaconGeo = new THREE.SphereGeometry(0.08, 8, 8);
    const beaconMat = new THREE.MeshBasicMaterial({ color: 0xff1100 });
    const beacon = new THREE.Mesh(beaconGeo, beaconMat);
    beacon.position.set(0, 3.4, 3.8);
    craneGroup.add(beacon);

    towerGroup.add(craneGroup);
    this.group.add(towerGroup);

    // 3. Temple Shikhara Element (Nagara Architecture tribute)
    const templeGroup = new THREE.Group();
    templeGroup.position.set(-6.5, -2, 2.5);

    const plinthGeo = new THREE.BoxGeometry(4.2, 0.4, 4.2);
    const stoneMat = new THREE.MeshStandardMaterial({
      color: 0xc8b28f, // Warm Sandstone
      roughness: 0.9,
      metalness: 0.05
    });
    const plinth = new THREE.Mesh(plinthGeo, stoneMat);
    templeGroup.add(plinth);

    // Stepped Mandapa
    for (let t = 0; t < 6; t++) {
      const stepGeo = new THREE.BoxGeometry(3.6 - t * 0.4, 0.3, 3.6 - t * 0.4);
      const step = new THREE.Mesh(stepGeo, stoneMat);
      step.position.y = 0.35 + t * 0.3;
      templeGroup.add(step);
    }

    // Shikhara (curvilinear tower)
    const shikharaGeo = new THREE.ConeGeometry(1.2, 3.2, 8);
    const shikhara = new THREE.Mesh(shikharaGeo, stoneMat);
    shikhara.position.set(0, 3.2, 0);
    templeGroup.add(shikhara);

    // Kalasha finial
    const kalashGeo = new THREE.SphereGeometry(0.2, 12, 12);
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.8, roughness: 0.2 });
    const kalash = new THREE.Mesh(kalashGeo, goldMat);
    kalash.position.set(0, 4.9, 0);
    templeGroup.add(kalash);

    this.group.add(templeGroup);

    // 4. Government Quarters & Security Compound Wall
    const quartersGroup = new THREE.Group();
    quartersGroup.position.set(6.5, -2, -2.5);

    for (let q = 0; q < 3; q++) {
      const qGeo = new THREE.BoxGeometry(2.4, 3.5, 2.0);
      const qMesh = new THREE.Mesh(qGeo, concreteMat);
      qMesh.position.set(q * 2.8 - 2.8, 1.75, 0);
      quartersGroup.add(qMesh);
    }

    // Compound Wall
    const wallGeo = new THREE.BoxGeometry(16, 1.2, 0.25);
    const wall = new THREE.Mesh(wallGeo, concreteMat);
    wall.position.set(0, 0.6, 5.5);
    this.group.add(wall);

    // 5. Airborne Construction Particle Motifs
    const sparkCount = 80;
    const sparkGeo = new THREE.BufferGeometry();
    const sparkPositions = new Float32Array(sparkCount * 3);
    for (let s = 0; s < sparkCount * 3; s += 3) {
      sparkPositions[s] = (Math.random() - 0.5) * 20;
      sparkPositions[s + 1] = Math.random() * 10 - 1;
      sparkPositions[s + 2] = (Math.random() - 0.5) * 20;
    }
    sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPositions, 3));
    const sparkMat = new THREE.PointsMaterial({
      color: 0xff8c2a,
      size: 0.08,
      transparent: true,
      opacity: 0.8
    });
    this.sparks = new THREE.Points(sparkGeo, sparkMat);
    this.group.add(this.sparks);

    // Lighting specific to construction scene
    const amberSpot = new THREE.SpotLight(0xff6b00, 45, 25, Math.PI / 4, 0.4);
    amberSpot.position.set(5, 12, 6);
    this.group.add(amberSpot);

    const warmFill = new THREE.PointLight(0xffb74d, 15, 20);
    warmFill.position.set(-6, 5, 4);
    this.group.add(warmFill);
  }

  update(time) {
    if (this.craneArm) {
      this.craneArm.rotation.y = Math.sin(time * 0.4) * 0.7;
    }
    if (this.sparks) {
      const positions = this.sparks.geometry.attributes.position.array;
      for (let i = 1; i < positions.length; i += 3) {
        positions[i] += Math.sin(time + positions[i - 1]) * 0.005;
      }
      this.sparks.geometry.attributes.position.needsUpdate = true;
    }
  }
}
