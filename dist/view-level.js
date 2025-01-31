'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.ViewLevel = void 0;
const three_1 = require('three');
const box_1 = require('./box');
const level_1 = require('./level');
const state_1 = require('./state');
const utils_1 = require('./utils');
class ViewLevel extends level_1.Level {
  constructor(textures, levelSize = 32) {
    super(levelSize);
    const mesh = new box_1.Box(this.size * this.size, textures);
    const forEachHeight = this.forEachHeight(mesh);
    this.heights.forEach(forEachHeight);
    state_1.renderer.scene.add(mesh);
  }
  forEachHeight(mesh) {
    return (row, x) =>
      row.forEach((value, y) => {
        const min = this.heights[x][y];
        const height = Math.min(min, value) / 2;
        const angle = Math.floor(Math.random() * 4) * 90;
        const quaternion = new three_1.Quaternion();
        quaternion.setFromAxisAngle(
          new three_1.Vector3(0, 0, 1),
          (angle * Math.PI) / 180
        );
        const euler = new three_1.Euler();
        euler.setFromQuaternion(quaternion);
        mesh.setMatrixAt(
          y * this.size + x,
          (0, utils_1.getMatrix)(
            new three_1.Vector3(x, y, height / 2),
            euler,
            new three_1.Vector3(1, 1, height)
          )
        );
        for (let floor = 0; floor < height * 2; floor++) {
          state_1.physics.createBox({ x, y }, 1, 1, {
            isStatic: true,
            group: state_1.floors[floor]
          });
        }
      });
  }
}
exports.ViewLevel = ViewLevel;
