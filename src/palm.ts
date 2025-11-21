import { Level } from './level';
import { Sprite } from './sprite';

const palmProps = {
  textureName: 'palm',
  scale: 3
};

export class Palm extends Sprite {
  constructor(level: Level, x?: number, y?: number) {
    super(palmProps, level, x, y);
  }
}
