'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.Billboard = void 0;
const three_1 = require('three');
const state_1 = require('./state');
class Billboard {
  get gear() {
    let gear = 0;
    if (this.state.keys.up) {
      gear++;
    }
    if (this.state.keys.down) {
      gear--;
    }
    return gear;
  }
  constructor(material) {
    this.isPlayer = false;
    this.maxStamina = 1;
    this.z = 0;
    this.stamina = this.maxStamina;
    this.state = {
      direction: Math.random() * 2 * Math.PI,
      keys: {},
      mouse: {}
    };
    this.body = state_1.physics.createCircle({}, 0.125, {
      group: state_1.floors[0]
    });
    this.mesh = new three_1.Mesh(
      new three_1.PlaneGeometry(1, 1, 1, 1),
      material
    );
    this.scale = material.scale
      ? material.scale.clone()
      : new three_1.Vector3(1, 1, 1);
    if (material.size) {
      this.scale.x *= material.size.x / 64;
      this.scale.y *= material.size.y / 64;
    }
    state_1.renderer.scene.add(this.mesh);
    state_1.renderer.animations.push((time) => {
      this.update(time);
    });
  }
  init(level) {
    this.level = level;
    let x;
    let y;
    do {
      x = Math.random() * (this.level.size - 2) + 1;
      y = Math.random() * (this.level.size - 2) + 1;
    } while (this.level.getHeight(x, y) > 0);
    this.body.setPosition(x, y);
  }
  normalize(angle) {
    return (2 * Math.PI + angle) % (2 * Math.PI);
  }
  update(ms) {
    var _a;
    const deltaTime = ms / 1000;
    const rotateGear = this.gear || 1;
    const moveSpeed = this.gear * Billboard.moveSpeed * deltaTime;
    const height = this.level.getHeight(this.body.x, this.body.y);
    const floor = Math.max(height, Math.round(this.z * 2));
    if (this.state.keys.right) {
      this.state.direction -= rotateGear * Billboard.rotateSpeed * deltaTime;
    }
    if (this.state.keys.left) {
      this.state.direction += rotateGear * Billboard.rotateSpeed * deltaTime;
    }
    if (this.state.keys.space || this.stamina < this.maxStamina) {
      this.z += deltaTime * Billboard.jumpSpeed * this.stamina;
      this.stamina *= (1000 - ms) / 1000;
    }
    this.body.group = state_1.floors[floor];
    this.body.angle = this.state.direction + Math.PI / 2;
    this.body.move(moveSpeed);
    (_a = this.body.system) === null || _a === void 0
      ? void 0
      : _a.separateBody(this.body);
    this.z = Math.max(
      height / 2,
      this.z - (deltaTime * Billboard.fallSpeed) / this.stamina
    );
    if (this.z === height / 2) {
      this.stamina = this.maxStamina;
    }
    this.mesh.scale.set(this.scale.x, this.scale.y, this.scale.z);
    this.mesh.position.set(this.body.x, this.body.y, this.z + 0.25);
    this.mesh.lookAt(state_1.renderer.camera.position);
    this.mesh.up = new three_1.Vector3(0, 0, 1);
  }
}
exports.Billboard = Billboard;
Billboard.jumpSpeed = 7;
Billboard.fallSpeed = 3.25;
Billboard.moveSpeed = 2;
Billboard.rotateSpeed = 2;
