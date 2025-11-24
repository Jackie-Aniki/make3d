import { Level } from '../level'
import { BillboardProps, Direction, SpriteState } from '../model'
import { state } from '../state'
import { BillboardCreateProps } from './billboard'
import { Sprite } from './sprite'

export interface PlayerProps
  extends Omit<BillboardProps, 'level' | 'textureName'> {
  texture: string
}

export class Player extends Sprite {
  static readonly DIRECTIONS: Direction[] = ['left', 'right', 'down', 'up']
  static readonly DEFAULT_PROPS = {
    textureName: 'player',
    scale: 1.25,
    totalFrames: 3,
    cols: 3,
    rows: 4,
    directionsToRows: {
      down: 0,
      left: 1,
      up: 2,
      right: 3
    }
  }

  static async create(
    level: Level,
    props: BillboardCreateProps = { texture: 'player.webp' }
  ) {
    return super.create(level, props)
  }

  readonly state: SpriteState

  constructor({ level, ...props }: BillboardProps, setTarget = true) {
    super({ ...Player.DEFAULT_PROPS, level, ...props }, state)

    if (setTarget) {
      state.player = this
      state.renderer.setTarget(this)
    }
  }

  update(ms: number) {
    state.mouse.updateMouseXY()
    super.update(ms)
  }

  protected spawn(level: Level) {
    super.spawn(level, 0, 0)
  }

  protected getDirection() {
    return (
      Player.DIRECTIONS.find((direction) => !!this.state.keys[direction]) ||
      (this.state.mouseDown
        ? Math.abs(this.state.mouse.x) > Math.abs(this.state.mouse.y)
          ? this.state.mouse.x > 0
            ? 'right'
            : 'left'
          : this.state.mouse.y > 0
            ? 'down'
            : 'up'
        : this.direction)
    )
  }
}
