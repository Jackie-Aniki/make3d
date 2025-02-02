import {
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  RepeatWrapping,
  Texture
} from 'three';
import { Level } from './level';
import { meshProps, renderer } from './state';

export class Ocean extends Mesh {
  constructor(texture: Texture, repeat = 1) {
    const cols = Level.cols * repeat;
    const rows = Level.rows * repeat;

    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    texture.repeat.set(cols / 4, rows / 4);

    const geometry = new PlaneGeometry(cols, rows);
    const material = new MeshBasicMaterial({
      ...meshProps,
      map: texture,
      opacity: 0.7
    });

    super(geometry, material);

    this.position.set(Level.cols / 2, Level.rows / 2, 0);
    this.renderOrder = 1;

    renderer.scene.add(this);
  }
}
