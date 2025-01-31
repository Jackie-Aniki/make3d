'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.init =
  exports.state =
  exports.loader =
  exports.mouse =
  exports.floors =
  exports.renderer =
  exports.raycaster =
  exports.physics =
  exports.textures =
  exports.keys =
    void 0;
const detect_collisions_1 = require('detect-collisions');
const three_1 = require('three');
const model_1 = require('./model');
const renderer_1 = require('./renderer');
const loader_1 = require('./loader');
exports.keys = {};
exports.textures = {};
exports.physics = new detect_collisions_1.System();
exports.raycaster = new three_1.Raycaster(
  new three_1.Vector3(),
  new three_1.Vector3(),
  3,
  12
);
exports.renderer = new renderer_1.Renderer();
exports.floors = [
  (0, detect_collisions_1.groupBits)(model_1.MaskBits.Floor0),
  (0, detect_collisions_1.groupBits)(model_1.MaskBits.Floor1),
  (0, detect_collisions_1.groupBits)(model_1.MaskBits.Floor2),
  (0, detect_collisions_1.groupBits)(model_1.MaskBits.Floor3),
  (0, detect_collisions_1.groupBits)(model_1.MaskBits.Floor4)
];
exports.mouse = new three_1.Vector2();
exports.loader = new loader_1.Loader();
exports.state = {
  keys: exports.keys,
  mouse: exports.mouse,
  loader: exports.loader,
  direction: Math.random() * 2 * Math.PI
};
const init = async () => {
  exports.textures.elf = await exports.loader.load('./elf.png');
  exports.textures.elf.repeat.set(1 / 3, 1 / 6);
  exports.textures.grass = await exports.loader.load('./grass-top.png');
  exports.textures.grass.center.set(0.5, 0.5);
  exports.textures.groundS = await exports.loader.load('./grass-side.png');
  exports.textures.groundS.center.set(0.5, 0.5);
  exports.textures.groundN = exports.textures.groundS.clone();
  exports.textures.groundN.rotation = (180 * Math.PI) / 180;
  exports.textures.groundE = exports.textures.groundS.clone();
  exports.textures.groundE.rotation = (90 * Math.PI) / 180;
  exports.textures.groundW = exports.textures.groundS.clone();
  exports.textures.groundW.rotation = (-90 * Math.PI) / 180;
  Object.values(exports.textures).forEach((texture) => {
    texture.minFilter = three_1.LinearFilter;
    texture.magFilter = three_1.NearestFilter;
    texture.colorSpace = three_1.LinearSRGBColorSpace;
  });
};
exports.init = init;
