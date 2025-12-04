import { Circle } from 'check2d'
import { Level } from '../level'
import { BaseBody, BodyUserData } from '../model'
import { Math_Double_PI } from '../state'
import { AbstractBody } from './abstract-body'

export class DynamicBody extends Circle<BodyUserData> implements BaseBody {
  protected static readonly RADIUS = 0.2
  protected static readonly PADDING = 0.1
  protected static readonly SEPARATION = 0.33

  z = 0
  angle = Math.random() * Math_Double_PI
  userData!: BodyUserData

  constructor(
    x: number,
    y: number,
    level: Level,
    radius: number = DynamicBody.RADIUS,
    padding: number = DynamicBody.PADDING
  ) {
    super({ x, y }, radius, { padding, userData: { level } })
  }

  separate(scale: number) {
    const diffs: number[] = []

    this.system?.checkOne(this, ({ b, overlapV: { x, y } }) => {
      if (b.isStatic) {
        const wallStep = AbstractBody.stepToZ(b.userData.step)
        if (this.z < wallStep) {
          this.setPosition(this.x - x * scale, this.y - y * scale)
          diffs.push(wallStep - this.z)
        }
      } else {
        const c = scale / 2
        this.setPosition(this.x - x * c, this.y - y * c)
        b.setPosition(b.x + x * c, b.y + y * c)
      }
    })

    return diffs
  }
}
