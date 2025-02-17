import { BodyGroup } from 'detect-collisions';
import { Billboard } from './billboard';
import { DynamicBody } from './billboard-body';
import { Level } from './level';
import { State, TexturedBillboardProps } from './model';
import { Mouse } from './mouse';
import { physics } from './state';
import { normalizeAngle } from './utils';

export class MovingBillboard extends Billboard {
  static readonly moveSpeed = 3;
  static readonly rotateSpeed = 3;
  static readonly gravity = 9.1;
  static readonly jumpSpeed = 2.1;

  velocity = 0;
  state: State;
  declare body: DynamicBody;

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

  get mouseGear() {
    return this.state.mouseDown ? -this.state.mouse.y : 0;
  }

  constructor(
    props: TexturedBillboardProps,
    state: State = {
      keys: {},
      mouse: new Mouse()
    }
  ) {
    super(props);
    this.state = state;
  }

  update(ms: number): void {
    const deltaTime = ms * 0.001;
    const mouseGear = this.mouseGear;
    const gear = this.gear;

    this.updateAngle(deltaTime, gear);

    const moveSpeed =
      (mouseGear || gear) * MovingBillboard.moveSpeed * deltaTime;

    if (moveSpeed) {
      this.body.move(moveSpeed);
      this.body.system?.checkOne(
        this.body,
        ({ b: wall, overlapV: { x, y } }) => {
          if (wall.isStatic) {
            this.body.setPosition(this.body.x - x, this.body.y - y);
          } else {
            const offsetX = x * 0.5;
            const offsetY = y * 0.5;
            this.body.setPosition(this.body.x - offsetX, this.body.y - offsetY);
            wall.setPosition(wall.x + offsetX, wall.y + offsetY);
          }
        }
      );
    }

    this.updateZ(deltaTime);

    if (mouseGear) {
      this.updateFrame(ms);
    } else {
      for (const key in this.state.keys) {
        if (this.state.keys[key]) {
          this.updateFrame(ms);
          break;
        }
      }
    }

    super.update(ms);
  }

  protected updateZ(deltaTime: number) {
    const floorZ = this.getFloorZ();
    if (this.z > floorZ) {
      this.velocity -= MovingBillboard.gravity * deltaTime;
    } else {
      this.velocity = this.state.keys.space ? MovingBillboard.jumpSpeed : 0;
    }

    if (this.velocity !== 0 || this.z !== floorZ) {
      this.z = Math.max(
        this.z + deltaTime * MovingBillboard.jumpSpeed * this.velocity,
        floorZ,
        0
      );
    }
  }

  protected updateAngle(deltaTime: number, gear: number) {
    if (
      this.state.keys.left ||
      this.state.keys.right ||
      (this.state.mouseDown && this.state.mouse.x !== 0)
    ) {
      const scale = this.state.keys.left
        ? -1
        : this.state.keys.right
          ? 1
          : this.state.mouse.x;
      if (scale !== 0) {
        this.body.angle = normalizeAngle(
          this.body.angle +
            (gear || 1) * MovingBillboard.rotateSpeed * deltaTime * scale
        );
      }
    }
  }

  protected updateFrame(ms: number) {
    this.frame = (this.frame + ms * this.invFrameDuration) % this.totalFrames;
  }

  protected updateTexture() {
    super.updateTexture();

    const noLeft = !('left' in this.directionsToRows);
    const noRight = !('right' in this.directionsToRows);
    if (!noLeft && !noRight) return;

    const sign = Math.sign(this.mesh.scale.x);
    if (this.direction === 'left' && sign > 0) {
      this.mesh.scale.set(
        noLeft ? -this.scale : this.scale,
        this.scale,
        this.scale
      );
    } else if (this.direction === 'right' && sign < 0) {
      this.mesh.scale.set(
        noLeft ? this.scale : -this.scale,
        this.scale,
        this.scale
      );
    }
  }

  protected createBody(x: number, y: number) {
    const body = new DynamicBody(x, y);
    physics.insert(body);

    return body;
  }

  protected spawn(level: Level, x?: number, y?: number) {
    super.spawn(level, x, y);
    this.body.system?.separateBody(this.body);
  }
}
