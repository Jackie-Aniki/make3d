'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.Camera = void 0;
const three_1 = require('three');
class Camera extends three_1.PerspectiveCamera {
  constructor(levelSize = 32, distance = 3) {
    super(70, innerWidth / innerHeight, 0.2, levelSize * 1.33);
    this.distance = distance;
    this.position.set(
      levelSize / 2,
      levelSize / 2 - distance,
      0.5 + distance * 0.67
    );
    this.lookAt(levelSize / 2, levelSize / 2, 0);
  }
}
exports.Camera = Camera;
