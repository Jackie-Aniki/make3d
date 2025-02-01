import { Map } from 'rot-js';
import Cellular from 'rot-js/lib/map/cellular';
import { renderer } from './state';

export class Level {
  static readonly maxHeight = 4;

  readonly size: number;

  heights: number[][] = [];
  map!: Cellular;

  constructor(levelSize = 32, idle = false) {
    this.size = levelSize;
    this.heights = Array.from({ length: Level.maxHeight }, () =>
      this.createMap()
    ).reduce(
      (arrays, array) =>
        array.map(
          (column, x) =>
            column.map((value, y) => (arrays[x]?.[y] || 0) + value),
          []
        ),
      []
    );

    if (!idle) {
      renderer.camera.setLevel(this);
    }
  }

  getFloor(x: number, y: number) {
    return this.heights[Math.floor(x)]?.[Math.floor(y)] || 0;
  }

  protected createMap(
    fill = 0.525,
    cols = this.size,
    rows = this.size,
    iterations = Level.maxHeight
  ) {
    const map = new Map.Cellular(cols, rows);

    map.randomize(fill);
    for (let i = 0; i < iterations; i++) {
      map.create();
    }

    const { _map: heights } = map;

    return heights;
  }
}
