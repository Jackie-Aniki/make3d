'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.addEventListeners =
  exports.onPointerUp =
  exports.onPointerDown =
  exports.preventEvent =
  exports.setKey =
  exports.onPointerMove =
    void 0;
const state_1 = require('./state');
const onPointerMove = (event) => {
  const pointer = event instanceof TouchEvent ? event.touches[0] : event;
  if (pointer && state_1.state.player) {
    const CENTER_Y = 0.65;
    const MARGIN_Y = 0.05;
    state_1.mouse.x = (pointer.pageX / innerWidth) * 2 - 1;
    state_1.mouse.y = pointer.pageY / innerHeight - CENTER_Y;
    const ratio = state_1.mouse.y
      ? (state_1.mouse.x * innerWidth) /
        -Math.abs(state_1.mouse.y * innerHeight)
      : Infinity;
    if (state_1.state.mouseDown) {
      state_1.keys.up = state_1.mouse.y < -MARGIN_Y && Math.abs(ratio) < 2;
      state_1.keys.down = state_1.mouse.y > MARGIN_Y && Math.abs(ratio) < 2;
      state_1.keys.left = ratio > 0.5;
      state_1.keys.right = ratio < -0.5;
    }
  }
};
exports.onPointerMove = onPointerMove;
const setKey = (value) => {
  return (event) => {
    switch (event.key) {
      case 'ArrowLeft':
        state_1.keys.left = value;
        break;
      case 'ArrowRight':
        state_1.keys.right = value;
        break;
      case 'ArrowUp':
        state_1.keys.up = value;
        break;
      case 'ArrowDown':
        state_1.keys.down = value;
        break;
      case ' ':
        state_1.keys.space = value;
        break;
      default:
        console.log(event.key);
        break;
    }
  };
};
exports.setKey = setKey;
let lastClickTime = 0;
const preventEvent = (event) => event.preventDefault();
exports.preventEvent = preventEvent;
const onPointerDown = (event) => {
  const clickTime = Date.now();
  if (clickTime - lastClickTime < 200) {
    state_1.keys.space = true;
    setTimeout(() => {
      state_1.keys.space = false;
    }, 200);
  }
  lastClickTime = clickTime;
  state_1.state.mouseDown = true;
  (0, exports.preventEvent)(event);
  (0, exports.onPointerMove)(event);
};
exports.onPointerDown = onPointerDown;
const onPointerUp = () => {
  state_1.state.mouseDown = false;
  state_1.keys.up = false;
  state_1.keys.down = false;
  state_1.keys.left = false;
  state_1.keys.right = false;
};
exports.onPointerUp = onPointerUp;
const addEventListeners = () => {
  window.addEventListener('keydown', (0, exports.setKey)(true), {
    passive: true
  });
  window.addEventListener('keyup', (0, exports.setKey)(false), {
    passive: true
  });
  window.addEventListener('contextmenu', exports.preventEvent, {
    passive: false
  });
  window.addEventListener('pointerdown', exports.onPointerDown, {
    passive: false
  });
  window.addEventListener('pointerup', exports.onPointerUp, { passive: true });
  window.addEventListener('touchend', exports.onPointerUp, { passive: false });
  window.addEventListener('pointermove', exports.onPointerMove, {
    passive: true
  });
  window.addEventListener('touchmove', exports.onPointerMove, {
    passive: true
  });
};
exports.addEventListeners = addEventListeners;
