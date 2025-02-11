import { PerspectiveCamera, Quaternion, Vector3 } from 'three';
import { cos, sin } from './fast-math';
import { Level } from './level';
import { Player } from './player';

export class Camera extends PerspectiveCamera {
  static readonly distance = 1;
  static readonly lerpRatio = 0.0025;

  static fov = 90;
  static near = 0.1;
  static far = 100;

  ref?: Player;

  constructor(fov = Camera.fov, near = Camera.near, far = Camera.far) {
    super(fov, innerWidth / innerHeight, near, far);

    this.up = new Vector3(0, 1, 0);
  }

  getFloor(_x: number, _y: number) {
    return 0;
  }

  setLevel(level: Level) {
    this.getFloor = (x, y) => level.getFloor(x, y);
  }

  setRef(ref: Player) {
    this.ref = ref;
  }

  onCameraUpdate(lerp = 0) {
    if (!this.ref) return;

    const scale = 1 / this.aspect;
    const angle = -this.ref.body.angle + Math.PI / 2;
    const offsetX = sin(angle) * scale;
    const offsetY = cos(angle) * scale;
    const cameraX = this.ref.body.x - offsetX;
    const cameraY = this.ref.body.y - offsetY;
    const cameraHeight = this.getFloor(cameraX, cameraY);
    const cameraZ = 0.5 + Math.max(cameraHeight / 2, this.ref.z);

    const { position: target, rotation: targetRotation } = this.ref.mesh;
    const targetPosition = new Vector3(cameraX, cameraZ, cameraY);
    const targetQuaterion = new Quaternion().setFromEuler(targetRotation);

    if (lerp) {
      this.position.lerp(targetPosition, lerp);
      this.rotation.setFromQuaternion(
        new Quaternion()
          .setFromEuler(this.rotation)
          .slerp(targetQuaterion, lerp)
      );
    } else {
      this.position.copy(targetPosition);
      this.rotation.setFromQuaternion(targetQuaterion);
    }

    this.lookAt(target);
  }
}
