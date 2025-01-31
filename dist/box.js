'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.Box = void 0;
const three_1 = require('three');
class Box extends three_1.InstancedMesh {
  constructor(count, textures) {
    const geometry = new three_1.BoxGeometry(1, 1, 1);
    const materials = textures.map(
      (map) => new three_1.MeshBasicMaterial({ map })
    );
    super(geometry, materials, count);
  }
}
exports.Box = Box;
