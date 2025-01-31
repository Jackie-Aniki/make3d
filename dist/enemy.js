'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.Enemy = void 0;
const textured_billboard_1 = require('./textured-billboard');
class Enemy extends textured_billboard_1.TexturedBillboard {
  constructor(level, props) {
    super(props);
    this.isPlayer = false;
    this.maxVelocity = 1000;
    this.maxRotation = 100;
    this.velocity = this.maxVelocity;
    this.rotation = this.maxRotation;
    this.body.r = 0.2;
    this.init(level);
  }
  update(ms) {
    super.update(ms);
    this.velocity -= ms;
    this.rotation -= ms;
    if (this.rotation < 0) {
      this.rotation = this.maxRotation;
      ['left', 'right'].forEach((key) => {
        this.state.keys[key] = false;
      });
      if (Math.random() < 0.8) {
        this.state.keys[Math.random() < 0.5 ? 'left' : 'right'] = true;
      }
    }
    if (this.velocity < 0) {
      this.velocity = this.maxVelocity;
      ['up', 'down'].forEach((key) => {
        this.state.keys[key] = false;
      });
      this.state.keys[Math.random() < 0.9 ? 'up' : 'down'] = true;
    }
  }
}
exports.Enemy = Enemy;
