import * as THREE from 'three';
import { loader as loadingManager, renderer } from './state';
import { mapCubeTextures, pixelate } from './utils';
import { CubeDirections } from './model';

export class Skybox {
  constructor(
    textures: Record<CubeDirections, string> = {
      left: 'skybox/left.webp',
      right: 'skybox/right.webp',
      up: 'skybox/up.webp',
      down: 'skybox/down.webp',
      front: 'skybox/front.webp',
      back: 'skybox/back.webp'
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
