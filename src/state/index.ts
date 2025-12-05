import { System } from 'check2d'
import { AppState } from '../model'

export const physics = new System()

export const state: AppState = {
  keys: {},
  renderer: null as any,
  mouse: null as any,
  player: null as any,
  npcs: []
}
