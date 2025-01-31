import { LoadingManager, Texture, TextureLoader } from 'three';
import { FBXLoader } from './vendor/three-loaders/FBXLoader';
export declare class Loader extends LoadingManager {
  textureLoader: TextureLoader;
  fbxLoader: FBXLoader;
  constructor(
    onLoad?: () => void,
    onProgress?: (url: string, loaded: number, total: number) => void,
    onError?: (url: string) => void
  );
  load(path: string): Promise<Texture | any>;
}
//# sourceMappingURL=loader.d.ts.map
