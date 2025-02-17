import { Level } from './level';
import { TexturedBillboardProps } from './model';
import { directions, renderer, state } from './state';
import { MovingBillboard } from './moving-billboard';
import { ViewLevel } from './view-level';

export class Player extends MovingBillboard {
  readonly isPlayer = true;
  readonly state = state;

  constructor(level: Level, props: TexturedBillboardProps) {
    super(props, state);
    this.spawn(level);

    if (level instanceof ViewLevel) {
      renderer.camera.ready({ level, ref: this });
      renderer.scene.add(level.mesh);
    }
  }

  protected getDirection() {
    return (
      directions.find((direction) => !!this.state.keys[direction]) ||
      this.direction
    );
  }
}
