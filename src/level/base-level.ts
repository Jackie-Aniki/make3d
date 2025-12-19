import { Map } from 'rot-js'
import { physics } from '../state'
import { DeviceDetector } from '../utils/detect-mobile'
import { queryParams } from '../utils/query-params'

export class BaseLevel {
  static readonly STEP = 0.25
  static readonly COLS = DeviceDetector.HIGH_END ? 32 : 24
  static readonly ROWS = DeviceDetector.HIGH_END ? 32 : 24
  static readonly FILL = 0.5
  static readonly POND = 0.36
  static readonly ITERATIONS = 4
  static readonly HEIGHT_MAX =
    'height' in queryParams
      ? Number(queryParams.height)
      : DeviceDetector.HIGH_END
        ? 16
        : 12

  static zToStep(z = 0) {
    return Math.round(z / BaseLevel.STEP)
  }

  static reducer(input: number[][], heights: number[][]) {
    return heights.map(
      (column: number[], x: number) =>
        column.map((value, y) => (input[x]?.[y] || 0) + value),
      []
    )
  }

  static createMatrix({
    min = 0,
    max = 1,
    iterations = BaseLevel.ITERATIONS,
    fill = BaseLevel.FILL,
    cols = BaseLevel.COLS,
    rows = BaseLevel.ROWS
  }) {
    return Array.from({ length: max }, () => {
      const map = new Map.Cellular(cols, rows)

      map.randomize(fill)
      for (let i = 0; i < iterations; i++) {
        map.create()
      }

      return map._map
    })
      .reduce(BaseLevel.reducer, [])
      .map((arrays) =>
        arrays.map((value) => Math.max(0, value - min) * BaseLevel.STEP)
      )
  }

  protected readonly heights: number[][] = []

  constructor() {
    const min = Math.round(BaseLevel.HEIGHT_MAX * 2 * BaseLevel.POND)
    const max = BaseLevel.HEIGHT_MAX + min

    this.heights = BaseLevel.createMatrix({
      min,
      max
    })
  }

  getZ(x: number, y: number) {
    const posX = Math.floor(x + BaseLevel.COLS / 2)
    const posY = Math.floor(y + BaseLevel.ROWS / 2)

    return this.heights[posX]?.[posY] || 0
  }

  protected forEachHeight(
    heights = this.heights,
    iterator: (col: number, row: number, height: number) => void
  ) {
    heights.forEach((rows: number[], col: number) => {
      rows.forEach((height: number, row: number) => {
        if (height) {
          iterator(col, row, height)
        }
      })
    })
  }

  protected getXY(col: number, row: number) {
    return {
      x: col - BaseLevel.COLS / 2,
      y: row - BaseLevel.ROWS / 2
    }
  }

  protected createCollider(col: number, row: number, z: number) {
    const { x, y } = this.getXY(col, row)
    return physics.createBox({ x, y }, 1, 1, {
      isStatic: true,
      userData: { step: BaseLevel.zToStep(z) }
    })
  }
}
