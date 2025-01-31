import { MeshBasicMaterial, Vector2, Vector3 } from 'three';

export type Material = MeshBasicMaterial & { scale?: Vector3; size?: Vector2 };

export type Key = 'left' | 'right' | 'up' | 'down' | 'space';

export interface State extends Record<string, any> {
  keys: Record<string, boolean>;
  mouse: Partial<Vector2>;
  direction: number;
}

export enum MaskBits {
  Floor0 = 0b00000001_00000000,
  Floor1 = 0b00000010_00000000,
  Floor2 = 0b00000100_00000000,
  Floor3 = 0b00001000_00000000,
  Floor4 = 0b00010000_00000000
}
