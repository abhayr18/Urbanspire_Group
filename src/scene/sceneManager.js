import * as THREE from 'three';
import { ConstructionScene } from './constructionScene.js';
import { MarineScene } from './marineScene.js';
import { GlobalScene } from './globalScene.js';

export class SceneManager {
  constructor(canvas) {
    this.canvas = canvas;
    this.renderer = null;
    this.scene = null;
    this.camera = null;
    this.clock = new THREE.Clock();

    this.constructionScene = null;
    this.marineScene = null;
    this.globalScene = null;

    this.activeMode = 'overview'; // 'overview', 'construction', 'marine', 'global'

    // Camera targets for smooth lerping
    this.cameraPos = new THREE.Vector3(0, 4, 18);
    this.targetPos = new THREE.Vector3(0, 4, 18);
    this.cameraLook = new THREE.Vector3(0, 0, 0);
    this.targetLook = new THREE.Vector3(0, 0, 0);

    // Mouse parallax
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    this.init();
  }

  init() {
    // 1. Scene setup
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x080b10, 0.025);

    // 2. Camera setup
    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);
    this.camera.position.copy(this.cameraPos);

    // 3. Renderer setup
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.25;

    // 4. Ambient and Key Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.8);
    dirLight.position.set(10, 20, 15);
    this.scene.add(dirLight);

    const blueBacklight = new THREE.DirectionalLight(0x0055ff, 1.2);
    blueBacklight.position.set(-10, -5, -10);
    this.scene.add(blueBacklight);

    // 5. Instantiate child scenes
    this.constructionScene = new ConstructionScene();
    this.marineScene = new MarineScene();
    this.globalScene = new GlobalScene();

    // Position scenes in separate coordinates
    this.constructionScene.group.position.set(0, 0, 0);
    this.marineScene.group.position.set(0, -2, 0);
    this.globalScene.group.position.set(0, 0, 0);

    this.scene.add(this.constructionScene.group);
    this.scene.add(this.marineScene.group);
    this.scene.add(this.globalScene.group);

    // Initial visibility
    this.setMode('overview');

    // Events
    window.addEventListener('resize', this.onResize.bind(this));
    window.addEventListener('mousemove', this.onMouseMove.bind(this));

    // Start loop
    this.animate();
  }

  setMode(mode) {
    this.activeMode = mode;

    if (mode === 'overview') {
      this.targetPos.set(0, 5, 20);
      this.targetLook.set(0, 1, 0);
      this.constructionScene.group.visible = true;
      this.marineScene.group.visible = false;
      this.globalScene.group.visible = false;
    } else if (mode === 'construction') {
      this.targetPos.set(0, 4, 13);
      this.targetLook.set(0, 3, 0);
      this.constructionScene.group.visible = true;
      this.marineScene.group.visible = false;
      this.globalScene.group.visible = false;
    } else if (mode === 'marine') {
      this.targetPos.set(0, 3.5, 9);
      this.targetLook.set(0, 0, 0);
      this.constructionScene.group.visible = false;
      this.marineScene.group.visible = true;
      this.globalScene.group.visible = false;
    } else if (mode === 'global') {
      this.targetPos.set(0, 2, 14);
      this.targetLook.set(0, 0, 0);
      this.constructionScene.group.visible = false;
      this.marineScene.group.visible = false;
      this.globalScene.group.visible = true;
    }
  }

  setPontoonExploded(isExploded) {
    if (this.marineScene) {
      this.marineScene.setExploded(isExploded);
    }
  }

  onMouseMove(e) {
    this.mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
    this.mouse.targetY = -(e.clientY / window.innerHeight - 0.5) * 2;
  }

  onResize() {
    if (!this.camera || !this.renderer) return;
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    const time = this.clock.getElapsedTime();

    // Mouse smoothing
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

    // Camera smoothing (lerp)
    this.cameraPos.lerp(this.targetPos, 0.04);
    this.cameraLook.lerp(this.targetLook, 0.04);

    this.camera.position.x = this.cameraPos.x + this.mouse.x * 0.8;
    this.camera.position.y = this.cameraPos.y + this.mouse.y * 0.5;
    this.camera.position.z = this.cameraPos.z;
    this.camera.lookAt(this.cameraLook);

    // Update active subscenes
    if (this.constructionScene.group.visible) {
      this.constructionScene.update(time);
    }
    if (this.marineScene.group.visible) {
      this.marineScene.update(time);
    }
    if (this.globalScene.group.visible) {
      this.globalScene.update(time);
    }

    this.renderer.render(this.scene, this.camera);
  }
}
