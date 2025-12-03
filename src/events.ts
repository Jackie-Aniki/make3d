import { mouse } from './core/mouse'
import { keys } from './state'

export const setKey = (value: boolean) => {
  return (event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowLeft':
        keys.left = value
        break
      case 'ArrowRight':
        keys.right = value
        break
      case 'ArrowUp':
        keys.up = value
        break
      case 'ArrowDown':
        keys.down = value
        break
      case ' ':
        keys.space = value
        break
      default:
        // console.log(event.key);
        break
    }
  }
}

export class Events {
  static addEventListeners() {
    if (Events.eventListenersAdded) return
    Events.eventListenersAdded = true

    const options = { passive: false }
    Object.entries(Events.events).forEach(([event, action]) => {
      window.addEventListener(event, action, options)
    })

    window.addEventListener('keydown', Events.keyDown, { passive: true })
    window.addEventListener('keyup', Events.keyUp, { passive: true })
  }

  static removeEventListeners() {
    if (!Events.eventListenersAdded) return
    Events.eventListenersAdded = false

    Object.entries(Events.events).forEach(([event, action]) => {
      window.removeEventListener(event, action)
    })

    window.removeEventListener('keydown', Events.keyDown)
    window.removeEventListener('keyup', Events.keyUp)
  }

  protected static readonly keyDown = setKey(true)
  protected static readonly keyUp = setKey(false)
  protected static readonly click = mouse.onPointerDown.bind(
    mouse
  ) as EventListener
  protected static readonly release = mouse.onPointerUp.bind(
    mouse
  ) as EventListener
  protected static readonly move = mouse.onPointerMove.bind(
    mouse
  ) as EventListener
  protected static readonly cancel = mouse.preventEvent.bind(
    mouse
  ) as EventListener
  protected static readonly events = {
    pointerdown: Events.click,
    pointermove: Events.move,
    pointerup: Events.release,
    touchstart: Events.cancel,
    touchend: Events.cancel,
    touchmove: Events.cancel,
    dragstart: Events.cancel,
    contextmenu: Events.cancel
  }

  protected static eventListenersAdded = false
}
