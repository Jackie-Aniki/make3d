export class Debug {
  protected static instance: HTMLDivElement

  static set(innerHTML: string) {
    Debug.get().innerHTML = innerHTML
  }

  protected static get() {
    if (!Debug.instance) {
      Debug.instance = Debug.create()
    }

    return Debug.instance
  }

  protected static create() {
    const debug = document.createElement('div')
    debug.id = 'debug'
    debug.style = 'position: fixed; top: 0; left: 0;'
    document.body.appendChild(debug)
    return debug
  }
}
