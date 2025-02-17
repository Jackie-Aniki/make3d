import { doubleClickTime, keys, mouse, state } from './state';
import { normalize } from './utils';

export const onPointerMove = (event: MouseEvent | TouchEvent) => {
  const pointer = event instanceof TouchEvent ? event.touches[0] : event;
  const max = 1 / Math.max(innerWidth, innerHeight);

  if (pointer && state.player) {
    event.preventDefault();
    mouse.x = normalize(2 * max * (pointer.pageX - innerWidth / 2));
    mouse.y = normalize(3 * max * (pointer.pageY - innerHeight * 0.8));
  }
};

export const setKey = (value: boolean) => {
  return (event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowLeft':
        keys.left = value;
        break;
      case 'ArrowRight':
        keys.right = value;
        break;
      case 'ArrowUp':
        keys.up = value;
        break;
      case 'ArrowDown':
        keys.down = value;
        break;
      case ' ':
        keys.space = value;
        break;
      default:
        // console.log(event.key);
        break;
    }
  };
};

let lastClickTime = 0;

export const preventEvent = (event: PointerEvent | MouseEvent) =>
  event.preventDefault();

export const onPointerDown = (event: PointerEvent) => {
  const clickTime = Date.now();
  if (clickTime - lastClickTime < doubleClickTime) {
    keys.space = true;
    setTimeout(() => (keys.space = false), 100);
  }

  lastClickTime = clickTime;

  state.mouseDown = true;

  preventEvent(event);
  onPointerMove(event);
};

export const onPointerUp = (event: PointerEvent | TouchEvent) => {
  event.preventDefault();
  state.mouseDown = false;
  keys.up = false;
  keys.down = false;
  keys.left = false;
  keys.right = false;
};

export const addEventListeners = () => {
  window.addEventListener('keydown', setKey(true), { passive: true });
  window.addEventListener('keyup', setKey(false), { passive: true });
  window.addEventListener('pointerdown', onPointerDown, { passive: false });
  window.addEventListener('pointermove', onPointerMove, { passive: false });
  window.addEventListener('touchmove', onPointerMove, { passive: false });
  window.addEventListener('pointerup', onPointerUp, { passive: false });
  window.addEventListener('touchend', onPointerUp, { passive: false });
  window.addEventListener('dblclick', preventEvent, { passive: false });
  window.addEventListener('dragstart', preventEvent, { passive: false });
  window.addEventListener('contextmenu', preventEvent, { passive: false });
};
