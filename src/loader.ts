import { LoadingManager, Texture, TextureLoader } from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { TGALoader } from 'three/examples/jsm/loaders/TGALoader.js';

export class Loader extends LoadingManager {
  textureLoader: TextureLoader;
  fbxLoader: FBXLoader;

  constructor(
    onLoad?: () => void,
    onProgress?: (url: string, loaded: number, total: number) => void,
    onError?: (url: string) => void
  ) {
    super(onLoad, onProgress, onError);

    this.addHandler(/\.tga$/i, new TGALoader());
    this.textureLoader = new TextureLoader(this);
    this.fbxLoader = new FBXLoader(this);
  }

  async load(path: string): Promise<Texture | any> {
    if (path.toLowerCase().endsWith('.fbx')) {
      return this.fbxLoader.load(path, () => Promise.resolve());
    }

    return this.textureLoader.load(path, () => Promise.resolve());
  }
}
