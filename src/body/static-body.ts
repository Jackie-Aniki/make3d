import { floors } from '../state'
import { BaseBody } from '../model'

export class StaticBody implements BaseBody {
  x!: number
  y!: number
  group = floors[0]
  angle = 0

  constructor(x: number, y: number) {
    this.setPosition(x, y)
  }

  setPosition(x: number, y: number) {
    this.x = x
    this.y = y
  }
}
