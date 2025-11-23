import { Billboard } from './billboard'
import { Level } from '../level'

export class Bush extends Billboard {
  static readonly DEFAULT_PROPS = {
    textureName: 'bush'
  }

  constructor(level: Level, x?: number, y?: number) {
    super({ ...Bush.DEFAULT_PROPS, level, x, y })
  }
}
