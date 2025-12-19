import { BaseLevel } from '../level/base-level'
import { BaseBody } from '../model'

export abstract class AbstractBody {
  static getZ(body: BaseBody, x = body.x, y = body.y) {
    return body.userData.level.getZ(x, y)
  }

  static stepToZ(step = 0) {
    return step * BaseLevel.STEP
  }
}
