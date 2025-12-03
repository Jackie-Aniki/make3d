import { PerspectiveCamera, Vector3 } from 'three'
import { Level } from '../level'
import { Math_Half_PI, maxLevelHeight, state } from '../state'
import { DeviceDetector } from '../utils/detect-mobile'
import { Billboard } from '../view/billboard'

const MIN_HEIGHT = maxLevelHeight / 2

export class Camera extends PerspectiveCamera {
  static getFar() {
    return state.renderer.camera.far / Camera.FAR
  }

  static readonly HEIGHT = 0.75
  static readonly DISTANCE = 2
  static readonly LERP_RATIO = 0.004
  static readonly FOV = 75
  static readonly NEAR = 0.01
  static readonly FAR = DeviceDetector.HIGH_END ? 32 : 16
  static readonly cameraGoal = new Vector3(0, MIN_HEIGHT + Camera.HEIGHT, 0)
  static readonly cameraLookAt = new Vector3(0, MIN_HEIGHT, 0)
  static readonly projection = new Vector3()

  target?: Billboard

  protected distance = Camera.DISTANCE

  constructor(fov = Camera.FOV, near = Camera.NEAR, far = Camera.FAR) {
    super(fov, innerWidth / innerHeight, near, far)

    this.position.copy(Camera.cameraGoal)
    this.lookAt(Camera.cameraLookAt)
  }

  onResize(width: number, height: number) {
    this.aspect = width / height
    this.distance = Camera.DISTANCE / this.aspect
    this.updateProjectionMatrix()
  }

  update(ms = 0) {
    if (!ms) return

    this.updateGoal()
    this.lerpToGoal(ms)
    this.updateLookAt()
    this.lookAt(Camera.cameraLookAt)
  }

  setLevel(level: Level) {
    this.getFloor = (x, y) => level.getFloor(x, y)
  }

  setTarget(target: Billboard) {
    this.target = target
  }

  protected getFloor(_x: number, _y: number) {
    return 0
  }

  protected getPositionBehind({ x = 0, y = 0, angle = 0 } = {}) {
    const adjustedAngle = Math_Half_PI - angle
    const offsetX = Math.sin(adjustedAngle) * this.distance
    const offsetY = Math.cos(adjustedAngle) * this.distance
    const cameraX = x - offsetX
    const cameraY = y - offsetY

    return [cameraX, cameraY]
  }

  protected updateLookAt() {
    if (this.target) {
      Camera.cameraLookAt.set(
        this.target.body.x,
        this.target.z + Camera.HEIGHT,
        this.target.body.y
      )
    }
  }

  protected updateGoal() {
    if (this.target) {
      const [x, y] = this.getPositionBehind(this.target.body)
      const from = this.getFloor(x, y) / 2

      Camera.cameraGoal.set(x, Math.max(from, this.target.z) + Camera.HEIGHT, y)
    }
  }

  protected lerpToGoal(ms: number) {
    this.position.lerp(Camera.cameraGoal, ms * Camera.LERP_RATIO)
  }
}
