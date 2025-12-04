import { Level } from '../level'
import { BaseBody, BodyUserData } from '../model'
import { AbstractBody } from './abstract-body'

export class StaticBody implements BaseBody {
  group!: number
  x!: number
  y!: number
  z = 0
  angle = 0
  userData: BodyUserData

  constructor(x: number, y: number, level: Level) {
    this.userData = { level }
    this.setPosition(x, y)
  }

  setPosition(x: number, y: number) {
    this.x = x
    this.y = y
    this.z = AbstractBody.getZ(this)

    return this
  }
}
