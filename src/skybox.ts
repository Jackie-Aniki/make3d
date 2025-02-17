import * as THREE from 'three';
import { loader as loadingManager, renderer } from './state';
import { mapCubeTextures, pixelate } from './utils';
import { CubeDirections } from './model';

export class Skybox {
  constructor(
    textures: Record<CubeDirections, string> = {
      left: 'skybox/posy.webp',
      right: 'skybox/negy.webp',
      up: 'skybox/posz.webp',
      down: 'skybox/negz.webp',
      front: 'skybox/posx.webp',
      back: 'skybox/negx.webp'
    }
  ) {
    const loader = new THREE.CubeTextureLoader(loadingManager);
    const skyboxTextures = mapCubeTextures(textures);
    const skyBox = loader.load(skyboxTextures, () => {
      pixelate(skyBox);
      renderer.scene.background = skyBox;
    });
  }
}
