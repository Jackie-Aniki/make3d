import {
  CircleGeometry,
  Mesh,
  RepeatWrapping,
  ShaderMaterial,
  Texture,
  Vector3
} from 'three';
import { Level } from './level';
import { meshProps, renderer } from './state';

export class Ocean {
  static readonly scale = 4;
  static readonly waveSpeed = 2;
  static readonly waveHeight = 0.05;
  static readonly waveDetail = 16;
  static readonly textureRepeat = 8; // Powtarzanie tekstury
  static readonly config = [
    {
      opacity: 0.5,
      z: 0,
      renderOrder: 2,
      scale: 2
    },
    {
      opacity: 1,
      z: -0.1,
      renderOrder: 1,
      scale: 1.5
    }
  ];

  readonly repeat: number;
  readonly cols: number;
  readonly rows: number;

  protected startTime = Date.now();

  constructor(texture: Texture, repeat = 1.1) {
    this.repeat = repeat;
    this.cols = Level.cols * repeat;
    this.rows = Level.rows * repeat;

    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;

    renderer.scene.add(
      ...Array.from(Ocean.config, (_: unknown, index) =>
        this.createPlane(texture, index)
      )
    );
  }

  protected createPlane(texture: Texture, index: number) {
    const { opacity, scale, z, renderOrder } = Ocean.config[index];
    const radius = Math.hypot(this.cols, this.rows) / 2;
    const geometry = new CircleGeometry(radius);

    const material = new ShaderMaterial({
      ...meshProps,
      uniforms: {
        time: { value: (index * Math.PI) / 2 },
        waveSpeed: { value: Ocean.waveSpeed },
        waveHeight: { value: Ocean.waveHeight },
        textureRepeat: { value: Ocean.textureRepeat / scale },
        oceanZ: { value: z },
        cameraX: { value: 0 },
        cameraY: { value: 0 },
        map: { value: texture },
        opacity: { value: opacity }
      },
      vertexShader: `
        uniform float time;
        uniform float textureRepeat;
        uniform float waveSpeed;
        uniform float waveHeight;
        uniform float cameraX;
        uniform float cameraY;
        uniform float oceanZ;
      
        varying vec2 vUv;
      
        void main() {
          vUv = uv * textureRepeat + vec2(cameraX, cameraY); // Powtarzanie tekstury
          float wave = sin((position.x + position.z + time) * waveSpeed); // Mniej operacji mnożenia
      
          vec3 pos = position;
          pos.z = oceanZ + wave * waveHeight; // Uproszczona wersja
      
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D map;
        uniform float time;
        uniform float opacity;
      
        varying vec2 vUv;
      
        void main() {
          vec2 repeatedUV = fract(vUv + vec2(0.0, time * 0.01)); // Powtarzanie + lekkie przesuwanie
          vec4 color = texture2D(map, repeatedUV);
      
          gl_FragColor = vec4(color.rgb, color.a * opacity);
        }
      `
    });

    const mesh = new Mesh(geometry, material);

    mesh.setRotationFromAxisAngle(new Vector3(1, 0, 0), -Math.PI / 2);
    mesh.position.set(0, z, 0);
    mesh.renderOrder = renderOrder;

    const size = 2 / (scale * Ocean.textureRepeat);

    // Animacja shadera
    renderer.animations.push((ms: number) => {
      if (!renderer.camera.ref) return;

      const { x, y } = renderer.camera.ref.body;

      mesh.position.set(x, z, y);

      material.uniforms.time.value += ms / 1000;
      material.uniforms.cameraX.value = x * size;
      material.uniforms.cameraY.value = -y * size;
    });

    return mesh;
  }
}
