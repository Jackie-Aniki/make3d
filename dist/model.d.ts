import { MeshBasicMaterial, Vector2, Vector3 } from 'three';
export type Material = MeshBasicMaterial & {
  scale?: Vector3;
  size?: Vector2;
};
export type Key = 'left' | 'right' | 'up' | 'down' | 'space';
export interface State extends Record<string, any> {
  keys: Record<string, boolean>;
  mouse: Partial<Vector2>;
  direction: number;
}
export declare enum MaskBits {
  Floor0 = 256,
  Floor1 = 512,
  Floor2 = 1024,
  Floor3 = 2048,
  Floor4 = 4096
}
//# sourceMappingURL=model.d.ts.map
