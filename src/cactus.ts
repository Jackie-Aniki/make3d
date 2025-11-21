import { Level } from './level';
import { Sprite } from './sprite';

const cactusProps = {
  textureName: 'cactus'
};

export class Cactus extends Sprite {
  constructor(level: Level, x?: number, y?: number) {
    super(cactusProps, level, x, y);
  }
}
