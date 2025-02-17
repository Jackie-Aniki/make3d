import { keys, mouse } from './state';

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

export const addEventListeners = () => {
  window.addEventListener('keydown', setKey(true), { passive: true });
  window.addEventListener('keyup', setKey(false), { passive: true });
  window.addEventListener('pointerdown', mouse.onPointerDown.bind(mouse), {
    passive: false
  });
  window.addEventListener('pointermove', mouse.onPointerMove.bind(mouse), {
    passive: false
  });
  window.addEventListener('touchmove', mouse.onPointerMove.bind(mouse), {
    passive: false
  });
  window.addEventListener('pointerup', mouse.onPointerUp.bind(mouse), {
    passive: false
  });
  window.addEventListener('touchend', mouse.onPointerUp.bind(mouse), {
    passive: false
  });
  window.addEventListener('dblclick', mouse.preventEvent.bind(mouse), {
    passive: false
  });
  window.addEventListener('dragstart', mouse.preventEvent.bind(mouse), {
    passive: false
  });
  window.addEventListener('contextmenu', mouse.preventEvent.bind(mouse), {
    passive: false
  });
};
