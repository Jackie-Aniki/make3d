import { LoadingManager, Texture, TextureLoader } from 'three';
import { TGALoader } from 'three/examples/jsm/loaders/TGALoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

export class Loader extends LoadingManager {
  textureLoader?: TextureLoader;
  fbxLoader?: any;
  tgaLoader?: boolean;

  constructor(
    onLoad?: () => void,
    onProgress?: (url: string, loaded: number, total: number) => void,
    onError?: (url: string) => void
  ) {
    super(onLoad, onProgress, onError);
  }

  async load(path: string): Promise<Texture | any> {
    return new Promise(async (resolve) => {
      const extension = path.toLowerCase().split('.').pop();

      switch (extension) {
        case 'tga':
          if (!this.tgaLoader) {
            this.tgaLoader = true;
            this.addHandler(/\.tga$/i, new TGALoader());
          }
          break;

        case 'fbx':
          if (!this.fbxLoader) {
            this.fbxLoader = new FBXLoader(this);
          }

          return this.fbxLoader.load(path, resolve);

        default:
          if (!this.textureLoader) {
            this.textureLoader = new TextureLoader(this);
          }

          return this.textureLoader.load(path, resolve);
      }
    });
  }
}
