import { Vector2 } from 'three'
import { doubleClickTime, state } from '../state'

export class Mouse extends Vector2 {
  protected pageX = innerWidth / 2
  protected pageY = innerWidth / 2
  protected lastClickTime = 0

  onPointerDown(event: PointerEvent) {
    const clickTime = Date.now()
    if (clickTime - this.lastClickTime < doubleClickTime) {
      state.keys.space = true
      setTimeout(() => {
        state.keys.space = false
      }, 100)
    }

    this.lastClickTime = clickTime
    state.mouseDown = true

    this.preventEvent(event)
    this.onPointerMove(event)
  }

  onPointerUp(event: PointerEvent | TouchEvent) {
    event.preventDefault()
    state.mouseDown = false
    state.keys.up = false
    state.keys.down = false
    state.keys.left = false
    state.keys.right = false
  }

  onPointerMove(event: MouseEvent | TouchEvent) {
    const pointer = event instanceof TouchEvent ? event.touches[0] : event
    if (pointer) {
      event.preventDefault()

      this.pageX = pointer.pageX
      this.pageY = pointer.pageY

      const HALF_WIDTH = innerWidth / 2
      const HALF_HEIGHT = innerHeight / 2
      const playerY = state.player?.getWorldY() || 0
      const y = (playerY + 1) * HALF_HEIGHT

      this.x = this.clampNumber((this.pageX - HALF_WIDTH) / HALF_WIDTH)
      this.y = this.clampNumber((this.pageY - y) / HALF_HEIGHT)
    }
  }

  preventEvent(event: Event) {
    event.preventDefault()
  }

  clampNumber(n: number, multiply = 2) {
    return Math.max(-1, Math.min(1, n * multiply))
  }
}

export const mouse = new Mouse()
