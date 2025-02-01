import { Vector3 } from 'three';
import { Level } from './level';
import { TexturedBillboardProps } from './model';
import { renderer, state } from './state';
import { TexturedBillboard } from './textured-billboard';
import { Camera } from './camera';

export class Player extends TexturedBillboard {
  static readonly cameraLerpRatio = 0.025;

  readonly isPlayer = true;
  readonly state = state;

  protected direction = 'up';

  constructor(level: Level, props: TexturedBillboardProps) {
    super(props);
    this.init(level);

    renderer.camera.setPlayer(this);
  }

  protected update(ms: number) {
    super.update(ms);

    this.setDirection();

    const { camera } = renderer;
    const targetX = this.body.x - Math.sin(-state.direction) * Camera.distance;
    const targetY = this.body.y - Math.cos(-state.direction) * Camera.distance;
    const target = camera.getPosition(targetX, targetY);

    camera.position.set(target.x, target.y, camera.position.z);
    camera.position.lerp(target, ms * Player.cameraLerpRatio);
    camera.lookAt(new Vector3(this.body.x, this.body.y, this.z + 1));
  }

  protected setDirection() {
    TexturedBillboard.directions.some((direction) => {
      if (this.state.keys[direction]) {
        this.direction = direction;

        return true;
      }
    });
  }

  protected getDirection() {
    return this.direction;
  }
}
