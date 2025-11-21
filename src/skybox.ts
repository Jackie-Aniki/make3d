import * as THREE from 'three';
import { loader as loadingManager, state } from './state';
import { mapCubeTextures, pixelate } from './utils';
import { CubeDirections } from './model';

export class Skybox {
  constructor(
    textures: Record<CubeDirections, string> = {
      front: 'skybox/posy.webp',
      back: 'skybox/negy.webp',
      up: 'skybox/posz.webp',
      down: 'skybox/negz.webp',
      right: 'skybox/posx.webp',
      left: 'skybox/negx.webp'
    }
  ) {
    const loader = new THREE.CubeTextureLoader(loadingManager);
    const skyboxTextures = mapCubeTextures(textures);
    const skyBox = loader.load(skyboxTextures, () => {
      pixelate(skyBox);
      state.renderer.scene.background = skyBox;
    });
  }
}
