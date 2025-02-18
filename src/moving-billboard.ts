import { Billboard } from './billboard';
import { DynamicBody } from './billboard-body';
import { Level } from './level';
import { State, TexturedBillboardProps } from './model';
import { Mouse } from './mouse';
import { physics } from './state';
import { normalizeAngle } from './utils';

export class MovingBillboard extends Billboard {
  static readonly moveSpeed = 0.05;
  static readonly rotateSpeed = 3;
  static readonly gravity = 0.005;
  static readonly jumpSpeed = 0.075;

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
    const moveSpeed = (mouseGear || gear) * MovingBillboard.moveSpeed;

    this.updateAngle(deltaTime, gear);

    let timeLeft = deltaTime * 60;
    while (timeLeft > 0) {
      const timeScale = Math.min(1, timeLeft);
      this.body.move(moveSpeed * timeScale);
      this.body.separate(timeScale);
      this.updateZ(timeScale);
      timeLeft -= timeScale;
    }

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

  protected updateZ(timeScale: number) {
    const floorZ = this.getFloorZ();
    const standing = this.z === floorZ || this.velocity === 0;
    const above = this.z > floorZ;
    const prev = this.z;
    const jump = standing && this.state.keys.space;

    if (jump) this.velocity = MovingBillboard.jumpSpeed;

    let next = 0;
    if (jump || above) {
      next = this.z + this.velocity * timeScale;
      this.velocity -= timeScale * MovingBillboard.gravity;
    }

    if (!next) return;
    if (next < floorZ) {
      next = prev;
      this.velocity = 0;
    }

    this.z = next;
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
      this.mesh.scale.set(noLeft ? -1 : 1, 1, 1);
    } else if (this.direction === 'right' && sign < 0) {
      this.mesh.scale.set(noLeft ? 1 : -1, 1, 1);
    }
  }

  protected createBody(x: number, y: number) {
    const body = new DynamicBody(x, y);
    physics.insert(body);

    return body;
  }

  protected spawn(level: Level, x?: number, y?: number) {
    super.spawn(level, x, y);
    this.body.separate();
  }
}
