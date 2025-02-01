import { groupBits, System } from 'detect-collisions';
import { Raycaster, Texture, Vector2, Vector3 } from 'three';
import { Loader } from './loader';
import { Key, State } from './model';
import { Renderer } from './renderer';

export const keys: Partial<Record<Key, boolean>> = {};

export const textures: Record<string, Texture> = {};

export const physics = new System();

export const renderer = new Renderer();

export const raycaster = new Raycaster(new Vector3(), new Vector3(), 3, 12);

export const floorsBase = Array.from(
  { length: 7 },
  (_: unknown, power) => 128 * Math.pow(2, power)
);

export const floors = floorsBase.map(groupBits);

export const mouse = new Vector2();

export const loader = new Loader();

export const state: State = {
  keys,
  mouse,
  direction: Math.random() * 2 * Math.PI
};
