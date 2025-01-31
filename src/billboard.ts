import { Circle } from 'detect-collisions';
import { Mesh, PlaneGeometry, Vector3 } from 'three';
import { Level } from './level';
import { Material, State } from './model';
import { floors, physics, renderer } from './state';

export class Billboard {
  static readonly jumpSpeed = 7;
  static readonly fallSpeed = 3.25;
  static readonly moveSpeed = 2;
  static readonly rotateSpeed = 2;

  readonly isPlayer: boolean = false;
  readonly maxStamina = 1;

  z = 0;
  stamina = this.maxStamina;
  level!: Level;
  mesh: Mesh;
  body: Circle;
  scale: Vector3;
  state: State = {
    direction: Math.random() * 2 * Math.PI,
    keys: {},
    mouse: {}
  };

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

  constructor(material: Material) {
    this.body = physics.createCircle({}, 0.125, { group: floors[0] });
    this.mesh = new Mesh(new PlaneGeometry(1, 1, 1, 1), material);
    this.scale = material.scale ? material.scale.clone() : new Vector3(1, 1, 1);

    if (material.size) {
      this.scale.x *= material.size.x / 64;
      this.scale.y *= material.size.y / 64;
    }

    renderer.scene.add(this.mesh);
    renderer.animations.push((time: number) => {
      this.update(time);
    });
  }

  protected init(level: Level) {
    this.level = level;

    let x: number;
    let y: number;

    do {
      x = Math.random() * (this.level.size - 2) + 1;
      y = Math.random() * (this.level.size - 2) + 1;
    } while (this.level.getHeight(x, y) > 0);

    this.body.setPosition(x, y);
  }

  protected normalize(angle: number) {
    return (2 * Math.PI + angle) % (2 * Math.PI);
  }

  protected update(ms: number) {
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

    this.body.group = floors[floor];
    this.body.angle = this.state.direction + Math.PI / 2;
    this.body.move(moveSpeed);
    this.body.system?.separateBody(this.body);

    this.z = Math.max(
      height / 2,
      this.z - (deltaTime * Billboard.fallSpeed) / this.stamina
    );

    if (this.z === height / 2) {
      this.stamina = this.maxStamina;
    }

    this.mesh.scale.set(this.scale.x, this.scale.y, this.scale.z);
    this.mesh.position.set(this.body.x, this.body.y, this.z + 0.25);
    this.mesh.lookAt(renderer.camera.position);
    this.mesh.up = new Vector3(0, 0, 1);
  }
}
