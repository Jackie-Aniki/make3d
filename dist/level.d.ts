import Cellular from 'rot-js/lib/map/cellular';
export declare class Level {
  readonly iterations = 4;
  readonly wall: number;
  readonly size: number;
  heights: number[][];
  map: Cellular;
  constructor(levelSize?: number);
  getHeight(x: number, y: number): number;
  protected createMap(): void;
}
//# sourceMappingURL=level.d.ts.map
