import { Circle } from 'detect-collisions';
import { Mesh, Vector3 } from 'three';
import { Level } from './level';
import { Material, State } from './model';
export declare class Billboard {
  static readonly jumpSpeed = 7;
  static readonly fallSpeed = 3.25;
  static readonly moveSpeed = 2;
  static readonly rotateSpeed = 2;
  readonly isPlayer: boolean;
  readonly maxStamina = 1;
  z: number;
  stamina: number;
  level: Level;
  mesh: Mesh;
  body: Circle;
  scale: Vector3;
  state: State;
  get gear(): number;
  constructor(material: Material);
  protected init(level: Level): void;
  protected normalize(angle: number): number;
  protected update(ms: number): void;
}
//# sourceMappingURL=billboard.d.ts.map
