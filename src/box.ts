import { BoxGeometry, InstancedMesh, MeshBasicMaterial, Texture } from 'three';

export class Box extends InstancedMesh {
  constructor(count: number, textures: Texture[]) {
    const geometry = new BoxGeometry(1, 1, 1);
    const materials = textures.map(
      (texture) =>
        new MeshBasicMaterial({
          map: texture,
          transparent: true,
          alphaTest: 0.5
        })
    );

    super(geometry, materials, count);
  }
}
