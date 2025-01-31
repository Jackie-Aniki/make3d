import { System } from 'detect-collisions';
import { Raycaster, Texture, Vector2 } from 'three';
import { Key, State } from './model';
import { Renderer } from './renderer';
import { Loader } from './loader';
export declare const keys: Partial<Record<Key, boolean>>;
export declare const textures: Record<string, Texture>;
export declare const physics: System<import('detect-collisions').Body>;
export declare const raycaster: Raycaster;
export declare const renderer: Renderer;
export declare const floors: number[];
export declare const mouse: Vector2;
export declare const loader: Loader;
export declare const state: State;
export declare const init: () => Promise<void>;
//# sourceMappingURL=state.d.ts.map
