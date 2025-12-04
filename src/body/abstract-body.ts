import { AbstractLevel } from '../level/abstract-level'
import { BaseBody } from '../model'
import { groups } from '../state'

export class AbstractBody {
  static getZ(body: BaseBody, x = body.x, y = body.y) {
    return body.userData.level.getZ(x, y)
  }

  static zToGroup(z = 0) {
    const step = AbstractBody.zToStep(z)
    return AbstractBody.stepToGroup(step)
  }

  static zToStep(z = 0) {
    return Math.round(z / AbstractLevel.STEP)
  }

  static stepToZ(step = 0) {
    return step * AbstractLevel.STEP
  }

  static stepToGroup(step = 0) {
    return groups[Math.max(0, step)]
  }
}
