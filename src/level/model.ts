import { Texture } from 'three'
import { SkyboxProps } from '../view/skybox'

export type LevelObjectName = string

export interface LevelObject {
  fill?: number
  chance?: number
  minHeight?: number
  maxHeight?: number
  iterations?: number
  spread?: number
}

export type LevelObjects = Record<LevelObjectName, LevelObject>

export type LevelPropsKeys = 'ocean' | 'floor' | 'sides' | 'tree' | 'bush'

export interface LevelCreateProps<T = string> extends Partial<
  Record<LevelPropsKeys, T>
> {
  objects?: LevelObjects
}

export interface LevelProps<T = Texture> extends LevelCreateProps<T> {
  textures: Texture[]
  canvas?: HTMLCanvasElement
  skybox?: SkyboxProps
}
