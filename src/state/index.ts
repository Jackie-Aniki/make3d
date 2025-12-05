import { System } from 'check2d'
import {
  FrontSide,
  MeshBasicMaterial,
  MeshBasicMaterialParameters,
  Texture
} from 'three'
import { Loader } from '../loader'
import { AppState, Direction, Key } from '../model'
import { DeviceDetector } from '../utils/detect-mobile'
import { queryParams } from '../utils/query-params'

export const minLevelHeight = DeviceDetector.HIGH_END ? 8 : 6

export const maxLevelHeight =
  'height' in queryParams
    ? Number(queryParams.height)
    : DeviceDetector.HIGH_END
      ? 16
      : 12

export const waterZ = 0.5

export const keys: Partial<Record<Key, boolean>> = {}

export const loadedTextures: Record<string, Texture> = {}

export const physics = new System()

export const loader = new Loader()

export const state: AppState = {
  keys,
  mouse: null,
  renderer: null,
  player: null,
  npcs: []
} as any

export const materialProps: MeshBasicMaterialParameters = {
  side: FrontSide
}

export const alphaMaterialProps: MeshBasicMaterialParameters = {
  ...materialProps,
  transparent: true,
  alphaTest: 1
}

export const directions: Direction[] = ['up', 'right', 'down', 'left']

export const Math_Half_PI = Math.PI * 0.5

export const Math_Double_PI = Math.PI * 2

export const materials: Record<string, MeshBasicMaterial> = {}

export const defaultNPCsCount =
  'limit' in queryParams
    ? Number(queryParams.limit)
    : DeviceDetector.HIGH_END
      ? 64
      : 48
