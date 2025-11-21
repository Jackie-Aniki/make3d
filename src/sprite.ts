import { Billboard } from './billboard';
import { Level } from './level';
import { BillboardProps } from './model';

export class Sprite extends Billboard {
  constructor(props: BillboardProps, level: Level, x?: number, y?: number) {
    super(props);
    this.spawn(level, x, y);
  }
}
