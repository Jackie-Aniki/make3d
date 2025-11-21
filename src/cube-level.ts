import { Texture } from 'three'
import { Ocean } from './ocean'
import { Skybox, SkyboxProps } from './skybox'
import { mapCubeTextures } from './utils'
import { ViewLevel } from './view-level'

export interface CubeLevelProps {
  floor: Texture
  sides: Texture
  ocean: Texture
  skybox?: SkyboxProps
}

export class CubeLevel extends ViewLevel {
  constructor(
    canvas: HTMLCanvasElement,
    { floor, sides, ocean, skybox }: CubeLevelProps
  ) {
    super(
      mapCubeTextures({
        up: floor,
        down: floor,
        left: sides,
        right: sides,
        front: sides,
        back: sides
      }),
      {
        ocean: () => new Ocean(ocean),
        skybox: () => new Skybox(skybox),
        canvas
      }
    )
  }
}
