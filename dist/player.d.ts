import { Level } from './level';
import {
  TexturedBillboard,
  TexturedBillboardProps
} from './textured-billboard';
export declare class Player extends TexturedBillboard {
  readonly isPlayer = true;
  readonly state: import('./model').State;
  protected direction: string;
  constructor(level: Level, props: TexturedBillboardProps);
  protected update(ms: number): void;
  protected setDirection(): void;
  protected getDirection(): string;
}
//# sourceMappingURL=player.d.ts.map
