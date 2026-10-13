import * as THREE from 'three';

export class GlobalScene {
  constructor() {
    this.group = new THREE.Group();
    this.name = "global";
    this.globe = null;
    this.rings = [];
    this.skyline = null;
    this.tradeArcs = [];
    this.particles = null;
    this.init();
  }

  init() {
    // 1. Digital 3D Globe with Wireframe and Landmass Dots
    const globeRadius = 3.6;
    const globeGeo = new THREE.SphereGeometry(globeRadius, 40, 40);
    const globeMat = new THREE.MeshStandardMaterial({
      color: 0x0c111c,
      roughness: 0.7,
      metalness: 0.3
    });
    this.globe = new THREE.Mesh(globeGeo, globeMat);
    this.globe.position.set(-2, 0, 0);

    // Wireframe overlay
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xd4af37, // Dubai Gold
      wireframe: true,
      transparent: true,
      opacity: 0.18
    });
    const wireSphere = new THREE.Mesh(new THREE.SphereGeometry(globeRadius + 0.04, 32, 32), wireMat);
    this.globe.add(wireSphere);

    // 2. Hub Pins (Pune, Mumbai, Dubai)
    // Spherical coordinate converter
    const latLongToVector3 = (lat, lon, radius) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);
      return new THREE.Vector3(
        -(radius * Math.sin(phi) * Math.cos(theta)),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta)
      );
    };

    const hubs = [
      { name: "Pune", lat: 18.5204, lon: 73.8567, color: 0xff6b00 },
      { name: "Mumbai", lat: 18.922, lon: 72.8347, color: 0x00e5ff },
      { name: "Dubai", lat: 25.2048, lon: 55.2708, color: 0xffd700 }
    ];

    const hubVectors = {};
    hubs.forEach(h => {
      const pos = latLongToVector3(h.lat, h.lon, globeRadius + 0.1);
      hubVectors[h.name] = pos;

      const pinGeo = new THREE.SphereGeometry(0.12, 12, 12);
      const pinMat = new THREE.MeshBasicMaterial({ color: h.color });
      const pin = new THREE.Mesh(pinGeo, pinMat);
      pin.position.copy(pos);
      this.globe.add(pin);

      // Glowing aura
      const auraGeo = new THREE.RingGeometry(0.18, 0.28, 16);
      const auraMat = new THREE.MeshBasicMaterial({
        color: h.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8
      });
      const aura = new THREE.Mesh(auraGeo, auraMat);
      aura.position.copy(pos);
      aura.lookAt(new THREE.Vector3(0, 0, 0));
      this.globe.add(aura);
    });

    // 3. Curved Flight & Supply Arcs (Pune -> Dubai & Mumbai -> Dubai)
    const createArc = (v1, v2, color) => {
      const mid = v1.clone().add(v2).multiplyScalar(0.5);
      const distance = v1.distanceTo(v2);
      mid.normalize().multiplyScalar(globeRadius + distance * 0.45);

      const curve = new THREE.QuadraticBezierCurve3(v1, mid, v2);
      const points = curve.getPoints(50);
      const arcGeo = new THREE.BufferGeometry().setFromPoints(points);
      const arcMat = new THREE.LineBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.85,
        linewidth: 2
      });
      const line = new THREE.Line(arcGeo, arcMat);
      return line;
    };

    if (hubVectors["Pune"] && hubVectors["Dubai"]) {
      this.globe.add(createArc(hubVectors["Pune"], hubVectors["Dubai"], 0xffa048));
    }
    if (hubVectors["Mumbai"] && hubVectors["Dubai"]) {
      this.globe.add(createArc(hubVectors["Mumbai"], hubVectors["Dubai"], 0x00e5ff));
    }

    this.group.add(this.globe);

    // 4. Futuristic Dubai Skyline Silhouette (Right side)
    const skylineGroup = new THREE.Group();
    skylineGroup.position.set(4.5, -2.5, 0);

    // Burj Spire representation
    const spireGeo = new THREE.ConeGeometry(0.65, 8.5, 6);
    const spireMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.9,
      roughness: 0.2,
      wireframe: true
    });
    const spire = new THREE.Mesh(spireGeo, spireMat);
    spire.position.set(0, 4.25, 0);
    skylineGroup.add(spire);

    // Flanking Towers
    const towerMat = new THREE.MeshStandardMaterial({
      color: 0x1f2937,
      roughness: 0.4,
      metalness: 0.8
    });
    const t1 = new THREE.Mesh(new THREE.BoxGeometry(1.2, 5.2, 1.2), towerMat);
    t1.position.set(-1.8, 2.6, 0.5);
    const t2 = new THREE.Mesh(new THREE.BoxGeometry(1.4, 6.0, 1.4), towerMat);
    t2.position.set(1.8, 3.0, -0.5);
    skylineGroup.add(t1, t2);

    this.skyline = skylineGroup;
    this.group.add(skylineGroup);

    // 5. Orbiting Golden Data Rings
    for (let r = 0; r < 2; r++) {
      const ringGeo = new THREE.RingGeometry(globeRadius + 1.2 + r * 0.8, globeRadius + 1.24 + r * 0.8, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xd4af37,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.25 - r * 0.1
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.copy(this.globe.position);
      ring.rotation.x = Math.PI / 3 + r * 0.4;
      ring.rotation.y = r * 0.6;
      this.group.add(ring);
      this.rings.push(ring);
    }

    // Dubai Gold Lighting
    const goldLight = new THREE.PointLight(0xffd700, 30, 25);
    goldLight.position.set(3, 4, 4);
    this.group.add(goldLight);
  }

  update(time) {
    if (this.globe) {
      this.globe.rotation.y = time * 0.15;
    }
    this.rings.forEach((ring, idx) => {
      ring.rotation.z = time * (0.05 + idx * 0.03);
    });
    if (this.skyline) {
      this.skyline.position.y = -2.5 + Math.sin(time * 0.8) * 0.08;
    }
  }
}
