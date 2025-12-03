import { Level } from '../level'
import { Billboard } from './billboard'

export class Tree extends Billboard {
  static readonly DEFAULT_PROPS = {
    textureName: 'tree',
    scale: 2
  }

  constructor(level: Level, x?: number, y?: number) {
    super({ ...Tree.DEFAULT_PROPS, level, x, y })
  }
}
