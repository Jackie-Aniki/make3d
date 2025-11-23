import { Level } from '../level'
import { Billboard } from './billboard'

export class Tree extends Billboard {
  static DEFAULT_PROPS = {
    textureName: 'tree',
    scale: 3
  }

  constructor(level: Level, x?: number, y?: number) {
    super({ ...Tree.DEFAULT_PROPS, level, x, y })
  }
}
