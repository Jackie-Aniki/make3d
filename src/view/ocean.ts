import {
  CircleGeometry,
  Group,
  Mesh,
  MeshBasicMaterial,
  RepeatWrapping,
  Texture,
  Vector3
} from 'three'
import { AbstractLevel } from '../level/abstract-level'
import { Math_Half_PI, alphaMaterialProps, state } from '../state'

export class Ocean {
  static readonly DEEP_WATER_Z = -0.2

  readonly mesh = new Group()

  protected readonly animations: Array<(time: number) => void> = []
  protected readonly cols: number
  protected readonly rows: number

  protected startTime = Date.now()

  constructor(texture: Texture, scale = AbstractLevel.STEP * 2) {
    this.cols = AbstractLevel.COLS
    this.rows = AbstractLevel.ROWS

    texture.wrapS = RepeatWrapping
    texture.wrapT = RepeatWrapping
    texture.repeat.set(this.cols * scale, this.rows * scale)
    texture.updateMatrix()

    this.mesh.add(this.createWater(texture, 0))
    this.mesh.add(this.createWater(texture, 1))

    state.renderer.add(this)
  }

  update(ms = 0) {
    const { x, y } = state.renderer.camera?.target?.body || { x: 0, y: 0 }

    this.mesh.position.set(x, Ocean.DEEP_WATER_Z, y)
    this.animations.forEach((animation) => animation(ms))
  }

  protected createWater(
    texture: Texture,
    level = 0,
    opacity = level ? 0.7 : 1
  ) {
    const radius = Math.hypot(this.cols, this.rows) / 2
    const geometry = new CircleGeometry(radius)
    const map = texture.clone()
    const material = new MeshBasicMaterial({
      ...alphaMaterialProps,
      alphaTest: opacity,
      opacity,
      map
    })

    const mesh = new Mesh(geometry, material)
    const scale = level + 1
    mesh.setRotationFromAxisAngle(new Vector3(1, 0, 0), -Math_Half_PI)
    mesh.position.set(0, -0.25 + 0.25 * level, 0)
    mesh.scale.set(scale, scale, scale)
    mesh.renderOrder = level

    const move = 0.5 / scale
    this.animations.push(() => {
      map.offset.x = this.mesh.position.x * move
      map.offset.y = -this.mesh.position.z * move
      map.updateMatrix()
    })

    return mesh
  }
}
