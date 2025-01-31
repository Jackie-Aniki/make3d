import { DirectionalLight, Group, Scene, WebGLRenderer } from 'three';
import { Camera } from './camera';
export declare class Renderer extends WebGLRenderer {
  now: number;
  scene: Scene;
  camera: Camera;
  animations: Array<(time: number) => void>;
  light?: DirectionalLight;
  constructor();
  animation(): void;
  resize(): void;
  loadMesh(path: string): Promise<Group>;
}
//# sourceMappingURL=renderer.d.ts.map
