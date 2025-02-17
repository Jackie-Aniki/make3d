import { Mesh, PlaneGeometry, Vector3 } from 'three';
import { BodyLike, StaticBody } from './billboard-body';
import { Level } from './level';
import {
  Direction,
  DirectionsToRows,
  Material,
  TexturedBillboardProps
} from './model';
import { directions, floors, renderer, state } from './state';
import { createMaterial, normalizeAngle } from './utils';

export class Billboard {
  static up = new Vector3(0, 1, 0);

  frame = 0;
  direction: Direction = 'up';
  material: Material;
  mesh: Mesh;
  body!: BodyLike;
  cols: number;
  rows: number;
  frameDuration: number;
  invCols: number;
  invRows: number;
  invFrameDuration: number;
  totalFrames: number;
  directionsToRows: DirectionsToRows;
  level?: Level;

  get z() {
    return this._z;
  }

  set z(z: number) {
    this._z = z;
    this.body.group = floors[Math.floor(z * 2 + 0.5)];
  }

  protected _z = 0;

  constructor(props: TexturedBillboardProps) {
    this.cols = props.cols || 1;
    this.rows = props.rows || 1;
    this.frameDuration = props.frameDuration || 120;
    this.invCols = 1 / this.cols;
    this.invRows = 1 / this.rows;
    this.invFrameDuration = 1 / this.frameDuration;
    this.totalFrames = props.totalFrames || 1;
    this.directionsToRows = props.directionsToRows || { default: 0 };
    this.material = createMaterial(props.textureName, props.cols, props.rows);

    const w = this.material.map!.image.width / this.cols;
    const h = this.material.map!.image.height / this.rows;
    const m = Math.max(w, h) / (props.scale || 1);
    this.mesh = new Mesh(new PlaneGeometry(w / m, h / m), this.material);

    renderer.scene.add(this.mesh);
    renderer.animations.push((ms: number) => {
      this.update(ms);
    });
  }

  update(_ms: number): void {
    this.mesh.position.set(this.body.x, this.z, this.body.y);
    this.mesh.quaternion.copy(renderer.camera.quaternion);
    this.mesh.up = Billboard.up;
    this.direction = this.getDirection();
    this.updateTexture();
  }

  protected createBody() {
    return new StaticBody();
  }

  protected spawn(level: Level) {
    const x = (Math.random() * Level.cols) / 2;
    const y = (Math.random() * Level.rows) / 2;

    this.body = this.createBody();
    this.body.setPosition(x, y);
    this.level = level;
    this.z = this.getFloorZ();
    this.mesh.position.set(x, this.z, y);
  }

  protected getFloorZ({ x, y } = this.body) {
    return this.level ? this.level.getFloor(x, y) / 2 : 0;
  }

  protected updateTexture() {
    const frameIndex = Math.floor(this.frame);
    const row = this.getRow(this.direction);
    const x = frameIndex % this.cols;
    const y = Math.floor(frameIndex * this.invCols) + row;
    const { map } = this.mesh.material as any;

    map?.offset.set(x * this.invCols, y * this.invRows);
  }

  protected getDirection() {
    const angle = normalizeAngle(this.body.angle - state.player.body.angle);
    const directionIndex = Math.floor((2 * angle) / Math.PI); // Szybsze (4 * angle) / (2 * Math.PI)

    return directions[directionIndex];
  }

  protected getRow(direction: Direction) {
    return (
      this.rows -
      this.totalFrames * this.invCols -
      ((this.directionsToRows[direction] ?? this.directionsToRows.default) || 0)
    );
  }
}
