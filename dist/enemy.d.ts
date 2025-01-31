import { Level } from './level';
import {
  TexturedBillboard,
  TexturedBillboardProps
} from './textured-billboard';
export declare class Enemy extends TexturedBillboard {
  readonly isPlayer = false;
  readonly maxVelocity = 1000;
  readonly maxRotation = 100;
  velocity: number;
  rotation: number;
  constructor(level: Level, props: TexturedBillboardProps);
  protected update(ms: number): void;
}
//# sourceMappingURL=enemy.d.ts.map
