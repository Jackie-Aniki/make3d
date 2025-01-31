import { groupBits, System } from 'detect-collisions';
import {
  LinearSRGBColorSpace,
  NearestFilter,
  NearestMipMapLinearFilter,
  Raycaster,
  Texture,
  Vector2,
  Vector3
} from 'three';
import { Loader } from './loader';
import { Key, MaskBits, State } from './model';
import { Renderer } from './renderer';

export const keys: Partial<Record<Key, boolean>> = {};

export const textures: Record<string, Texture> = {};

export const physics = new System();

export const renderer = new Renderer();

export const raycaster = new Raycaster(new Vector3(), new Vector3(), 3, 12);

export const floors = [
  groupBits(MaskBits.Floor0),
  groupBits(MaskBits.Floor1),
  groupBits(MaskBits.Floor2),
  groupBits(MaskBits.Floor3),
  groupBits(MaskBits.Floor4)
];

export const mouse = new Vector2();

export const loader = new Loader();

export const state: State = {
  keys,
  mouse,
  direction: Math.random() * 2 * Math.PI
};

export const init = async () => {
  textures.elf = await loader.load('./elf.png');
  textures.elf.repeat.set(1 / 3, 1 / 6);

  textures.grass = await loader.load('./grass-top.png');
  textures.grass.center.set(0.5, 0.5);

  textures.groundS = await loader.load('./grass-side.png');
  textures.groundS.center.set(0.5, 0.5);

  textures.groundN = textures.groundS.clone();
  textures.groundN.rotation = (180 * Math.PI) / 180;

  textures.groundE = textures.groundS.clone();
  textures.groundE.rotation = (90 * Math.PI) / 180;

  textures.groundW = textures.groundS.clone();
  textures.groundW.rotation = (-90 * Math.PI) / 180;

  Object.values(textures).forEach((texture) => {
    texture.minFilter = NearestMipMapLinearFilter;
    texture.magFilter = NearestFilter;
    texture.colorSpace = LinearSRGBColorSpace;
  });
};
