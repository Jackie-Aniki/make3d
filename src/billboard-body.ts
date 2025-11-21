import { Circle } from 'check2d';
import { floors, Math_Double_PI } from './state';

export interface BodyLike {
  x: number;
  y: number;
  group: number;
  angle: number;
  setPosition: (x: number, y: number) => void;
}

export class StaticBody implements BodyLike {
  x!: number;
  y!: number;
  group = floors[0];
  angle = 0;

  constructor(x: number, y: number) {
    this.setPosition(x, y);
  }

  setPosition(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

export class DynamicBody extends Circle {
  static readonly RADIUS = 0.2;
  static readonly PADDING = 0.1;
  static readonly SEPARATION_DYNAMIC = 0.33;
  static readonly SEPARATION_STATIC = 0.5;

  angle = Math.random() * Math_Double_PI;

  constructor(
    x: number,
    y: number,
    radius: number = DynamicBody.RADIUS,
    padding: number = DynamicBody.PADDING
  ) {
    super({ x, y }, radius, { group: floors[0], padding });
  }

  separate(timeScale: number = 1) {
    const separationDynamic = timeScale * DynamicBody.SEPARATION_DYNAMIC;
    const separationStatic = timeScale * DynamicBody.SEPARATION_STATIC;

    this.system?.checkOne(this, ({ b, overlapV: { x, y } }) => {
      if (b.isStatic) {
        this.setPosition(
          this.x - x * separationStatic,
          this.y - y * separationStatic
        );
      } else {
        const dx = x * separationDynamic;
        const dy = y * separationDynamic;

        this.setPosition(this.x - dx, this.y - dy);
        b.setPosition(b.x + dx * 2, b.y + dy * 2);
      }
    });
  }
}
