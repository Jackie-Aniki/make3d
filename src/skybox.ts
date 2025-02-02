import { CubeTexture, CubeTextureLoader } from 'three';
import { renderer } from './state';
import { pixelate } from './utils';

export class Skybox {
  constructor() {
    this.init().then((skyBox) => {
      renderer.scene.background = skyBox;
    });
  }

  init(): Promise<CubeTexture> {
    return new Promise((resolve) => {
      const loader = new CubeTextureLoader();
      const skyBox = loader.load(
        Array.from(
          { length: 6 },
          (_: unknown, index: number) => `skybox/skybox-${index + 1}.webp`
        ),
        () => {
          pixelate(skyBox);
          resolve(skyBox);
        }
      );
    });
  }
}
