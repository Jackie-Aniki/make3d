import { Circle } from 'detect-collisions';
import { floors } from './state';

export interface BodyLike {
  x: number;
  y: number;
  group: number;
  angle: number;
  setPosition: (x: number, y: number) => void;
}

export class StaticBody implements BodyLike {
  x = 0;
  y = 0;
  group = floors[0];
  angle = 0;

  setPosition(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

export class DynamicBody extends Circle {
  static readonly radius = 0.15;
  static readonly padding = 0.1;

  angle = Math.random() * Math.PI * 2;

  constructor(radius = DynamicBody.radius, padding = DynamicBody.padding) {
    super({}, radius, { group: floors[0], padding });
  }
}
