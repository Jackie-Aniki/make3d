import { LoadingManager, Texture, TextureLoader } from 'three';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { TGALoader } from 'three/examples/jsm/loaders/TGALoader.js';

export class Loader extends LoadingManager {
  static readonly DRACO_LOADER_PATH =
    'https://www.gstatic.com/draco/versioned/decoders/1.5.7/';

  textureLoader?: TextureLoader;
  gltfLoader?: GLTFLoader;
  fbxLoader?: FBXLoader;
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
        case 'glb':
          if (!this.gltfLoader) {
            const dracoLoader = new DRACOLoader();
            dracoLoader.setDecoderPath(Loader.DRACO_LOADER_PATH);

            this.gltfLoader = new GLTFLoader();
            this.gltfLoader.setDRACOLoader(dracoLoader);
          }

          return this.gltfLoader.load(path, resolve);

        case 'fbx':
          if (!this.fbxLoader) {
            this.fbxLoader = new FBXLoader(this);
          }

          return this.fbxLoader.load(path, resolve);

        case 'tga':
          if (!this.tgaLoader) {
            this.tgaLoader = true;
            this.addHandler(/\.tga$/i, new TGALoader());
          }

          break;
      }

      if (!this.textureLoader) {
        this.textureLoader = new TextureLoader(this);
      }

      return this.textureLoader.load(path, resolve);
    });
  }
}
