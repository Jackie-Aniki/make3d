'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.Player = void 0;
const three_1 = require('three');
const state_1 = require('./state');
const textured_billboard_1 = require('./textured-billboard');
class Player extends textured_billboard_1.TexturedBillboard {
  constructor(level, props) {
    super(props);
    this.isPlayer = true;
    this.state = state_1.state;
    this.direction = 'up';
    this.body.r = 0.2;
    this.init(level);
  }
  update(ms) {
    super.update(ms);
    this.setDirection();
    const x =
      Math.sin(-state_1.state.direction) * state_1.renderer.camera.distance;
    const y =
      Math.cos(-state_1.state.direction) * state_1.renderer.camera.distance;
    state_1.renderer.camera.position.lerp(
      new three_1.Vector3(
        Math.max(1, Math.min(this.level.size - 2, this.body.x - x)),
        Math.max(1, Math.min(this.level.size - 2, this.body.y - y)),
        0.5 + state_1.renderer.camera.distance * 0.67
      ),
      ms / 250
    );
    const position = new three_1.Vector3(this.body.x, this.body.y, this.z).add(
      new three_1.Vector3(0, 0, 1)
    );
    state_1.renderer.camera.lookAt(position);
    state_1.renderer.camera.up = new three_1.Vector3(0, 0, 1);
  }
  setDirection() {
    textured_billboard_1.TexturedBillboard.directions.some((direction) => {
      if (this.state.keys[direction]) {
        this.direction = direction;
        return true;
      }
    });
  }
  getDirection() {
    return this.direction;
  }
}
exports.Player = Player;
