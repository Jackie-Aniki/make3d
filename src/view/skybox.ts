import * as THREE from 'three'
import { CubeDirections } from '../model'
import { state } from '../state'
import { TextureUtils } from '../utils/texture-utils'

export type SkyboxProps<T = string> = Record<CubeDirections, T>

export class Skybox {
  static readonly DEFAULT_CALLBACK = (skyBox: THREE.Texture) => {
    TextureUtils.pixelate(skyBox)
    state.renderer.scene.background = skyBox
  }

  static readonly DEFAULT_TEXTURES = {
    up: 'skybox/posz.webp',
    down: 'skybox/negz.webp',
    left: 'skybox/negx.webp',
    right: 'skybox/posx.webp',
    front: 'skybox/posy.webp',
    back: 'skybox/negy.webp'
  }

  constructor(
    textures = Skybox.DEFAULT_TEXTURES,
    callback = Skybox.DEFAULT_CALLBACK
  ) {
    const loader = new THREE.CubeTextureLoader(TextureUtils.loader)
    const skyboxTextures = TextureUtils.mapToCube(textures)

    loader.load(skyboxTextures, callback)
  }
}
