import { Circle } from 'detect-collisions';
import { floors } from './state';

export class BillboardBody extends Circle {
  static readonly radius = 0.25;
  static readonly padding = 0.1;

  angle = Math.random() * Math.PI * 2;

  constructor(radius = BillboardBody.radius, padding = BillboardBody.padding) {
    super({}, radius, { group: floors[0], padding });
  }
}
