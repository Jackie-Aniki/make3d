import { PerspectiveCamera, Vector3 } from 'three'
import { Level } from '../level'
import { Math_Half_PI, maxLevelHeight, state } from '../state'
import { DeviceDetector } from '../utils/detect-mobile'
import { Billboard } from '../view/billboard'

export class Camera extends PerspectiveCamera {
  static getFar() {
    return state.renderer.camera.far / Camera.FAR
  }

  static readonly HEIGHT = 0.75
  static readonly DISTANCE = 2
  static readonly LERP_RATIO = 0.0025
  static readonly FOV = 75
  static readonly NEAR = 0.01
  static readonly FAR = DeviceDetector.HIGH_END ? 32 : 16
  static readonly cameraPosition = new Vector3(
    0,
    maxLevelHeight / 2 + Camera.HEIGHT,
    0
  )
  static readonly cameraTargetPosition = new Vector3(0, maxLevelHeight / 2, 0)
  static readonly cameraProject = new Vector3()

  target?: Billboard

  protected distance = Camera.DISTANCE

  constructor(fov = Camera.FOV, near = Camera.NEAR, far = Camera.FAR) {
    super(fov, innerWidth / innerHeight, near, far)
    this.position.copy(Camera.cameraPosition)
    this.lookAt(Camera.cameraTargetPosition)
  }

  onResize(width: number, height: number) {
    this.aspect = width / height
    this.distance = Camera.DISTANCE / this.aspect
    this.updateProjectionMatrix()
  }

  update(ms = 0) {
    this.updatePosition(ms)
    this.lookAt(Camera.cameraTargetPosition)
  }

  updatePosition(ms = 0) {
    if (!ms || !this.target) return

    this.updateVectors(this.target)
    this.position.lerp(Camera.cameraPosition, ms * Camera.LERP_RATIO)
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

  protected updateVectors({ body, z }: Billboard) {
    Camera.cameraTargetPosition.set(body.x, z, body.y)

    const [x, y] = this.getPositionBehind(body)
    const from = this.getFloor(x, y) / 2
    Camera.cameraPosition.set(x, Math.max(from, z) + Camera.HEIGHT, y)
  }
}
