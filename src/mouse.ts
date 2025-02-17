import { Vector2 } from 'three';
import { doubleClickTime, state } from './state';

export class Mouse extends Vector2 {
  pageX = innerWidth / 2;
  pageY = innerWidth / 2;
  lastClickTime = 0;

  onPointerMove(event: MouseEvent | TouchEvent) {
    const pointer = event instanceof TouchEvent ? event.touches[0] : event;
    if (pointer && state.player) {
      event.preventDefault();

      this.pageX = pointer.pageX;
      this.pageY = pointer.pageY;
    }
  }

  updateMouseXY() {
    const min = 2 / Math.min(innerWidth, innerHeight);
    const centerY = state.player.getScreenPosition().y;

    this.x = Math.max(
      -1,
      Math.min(1, (this.pageX - innerWidth / 2) * min * 1.33)
    );
    this.y = Math.max(-1, Math.min(1, (this.pageY - centerY) * min * 2));
  }

  preventEvent(event: PointerEvent | MouseEvent) {
    event.preventDefault();
  }

  onPointerDown(event: PointerEvent) {
    const clickTime = Date.now();
    if (clickTime - this.lastClickTime < doubleClickTime) {
      state.keys.space = true;
      setTimeout(() => {
        state.keys.space = false;
      }, 100);
    }

    this.lastClickTime = clickTime;
    state.mouseDown = true;

    this.preventEvent(event);
    this.onPointerMove(event);
  }

  onPointerUp(event: PointerEvent | TouchEvent) {
    event.preventDefault();
    state.mouseDown = false;
    state.keys.up = false;
    state.keys.down = false;
    state.keys.left = false;
    state.keys.right = false;
  }
}
