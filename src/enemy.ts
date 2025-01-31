import { Level } from './level';
import { TexturedBillboardProps } from './model';
import { TexturedBillboard } from './textured-billboard';

export class Enemy extends TexturedBillboard {
  readonly isPlayer = false;
  readonly maxVelocity = 1000;
  readonly maxRotation = 100;

  velocity = this.maxVelocity;
  rotation = this.maxRotation;

  constructor(level: Level, props: TexturedBillboardProps) {
    super(props);
    this.init(level);
  }

  protected update(ms: number) {
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
