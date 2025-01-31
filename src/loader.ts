import { LoadingManager, Texture, TextureLoader } from 'three';
import { FBXLoader } from './vendor/three-loaders/FBXLoader';
import { TGALoader } from './vendor/three-loaders/TGALoader';

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
