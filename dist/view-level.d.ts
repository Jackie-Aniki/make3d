import { Texture } from 'three';
import { Box } from './box';
import { Level } from './level';
export declare class ViewLevel extends Level {
  constructor(textures: Texture[], levelSize?: number);
  forEachHeight(mesh: Box): (row: number[], x: number) => void;
}
//# sourceMappingURL=view-level.d.ts.map
