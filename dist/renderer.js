'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.Renderer = void 0;
const three_1 = require('three');
const camera_1 = require('./camera');
const state_1 = require('./state');
class Renderer extends three_1.WebGLRenderer {
  constructor() {
    super({ antialias: true, powerPreference: 'high-performance' });
    this.now = Date.now();
    this.scene = new three_1.Scene();
    this.camera = new camera_1.Camera();
    this.animations = [];
    this.setSize(innerWidth, innerHeight);
    this.setAnimationLoop(this.animation.bind(this));
    this.outputColorSpace = three_1.LinearSRGBColorSpace;
    this.scene.add(new three_1.AmbientLight(0xffeecc, 0.5));
    const loader = new three_1.CubeTextureLoader();
    const skyBox = loader.load(Array.from({ length: 6 }, () => 'skybox.jpg'));
    this.scene.background = skyBox;
    document.body.appendChild(this.domElement);
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }
  animation() {
    const now = Date.now();
    const time = now - this.now;
    this.now = Date.now();
    this.animations.forEach((animation) => animation(time));
    this.render(this.scene, this.camera);
  }
  resize() {
    this.camera.aspect = innerWidth / innerHeight;
    this.camera.updateProjectionMatrix();
    this.setSize(innerWidth, innerHeight);
  }
  async loadMesh(path) {
    return new Promise((resolve) => {
      state_1.state.fbxLoader.load(path, (object) => {
        resolve(object);
      });
    });
  }
}
exports.Renderer = Renderer;
