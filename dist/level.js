'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.Level = void 0;
const rot_js_1 = require('rot-js');
class Level {
  constructor(levelSize = 32) {
    this.iterations = 4;
    this.wall = this.iterations + 2;
    this.heights = [];
    this.size = levelSize;
    this.createMap();
  }
  getHeight(x, y) {
    try {
      return this.heights[Math.floor(x)][Math.floor(y)];
    } catch (_oob) {
      return Infinity;
    }
  }
  createMap() {
    this.map = new rot_js_1.Map.Cellular(this.size, this.size);
    this.map.randomize(0.6);
    for (let i = this.iterations; i > 0; i--) {
      this.map.create((x, y, value) => {
        this.heights[x] = this.heights[x] || [];
        this.heights[x][y] = this.heights[x][y] || this.iterations;
        if (x !== 0 && y !== 0 && x !== this.size - 1 && y !== this.size - 1) {
          this.heights[x][y] -= value;
        } else {
          this.heights[x][y] = this.wall;
        }
      });
    }
  }
}
exports.Level = Level;
