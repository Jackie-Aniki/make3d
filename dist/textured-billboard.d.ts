import { Billboard } from './billboard';
export type AnimationsDirection = 'down' | 'right' | 'up' | 'left';
export type AnimationsOrder = Partial<
  Record<AnimationsDirection | 'default', number>
>;
export interface TexturedBillboardProps {
  materialName: string;
  animationsOrder?: AnimationsOrder;
  frameDuration?: number;
  totalFrames?: number;
}
export declare class TexturedBillboard extends Billboard {
  static directions: AnimationsDirection[];
  static reverseDirections: AnimationsDirection[];
  static findByAngle: (
    angle: number
  ) => (_animation: unknown, index: number) => boolean;
  readonly isPlayer: boolean;
  frame: number;
  animationsOrder: AnimationsOrder;
  frameDuration: number;
  totalFrames: number;
  constructor({
    materialName,
    frameDuration,
    animationsOrder,
    totalFrames
  }: TexturedBillboardProps);
  protected getDirection(): any;
  protected getRow(direction: AnimationsDirection): number;
  protected update(ms: number): void;
}
//# sourceMappingURL=textured-billboard.d.ts.map
