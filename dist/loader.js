'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.Loader = void 0;
const three_1 = require('three');
const FBXLoader_1 = require('./vendor/three-loaders/FBXLoader');
const TGALoader_1 = require('./vendor/three-loaders/TGALoader');
class Loader extends three_1.LoadingManager {
  constructor(onLoad, onProgress, onError) {
    super(onLoad, onProgress, onError);
    this.addHandler(/\.tga$/i, new TGALoader_1.TGALoader());
    this.textureLoader = new three_1.TextureLoader(this);
    this.fbxLoader = new FBXLoader_1.FBXLoader(this);
  }
  async load(path) {
    if (path.toLowerCase().endsWith('.fbx')) {
      return this.fbxLoader.load(path, () => Promise.resolve());
    }
    return this.textureLoader.load(path, () => Promise.resolve());
  }
}
exports.Loader = Loader;
