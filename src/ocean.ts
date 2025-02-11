import {
  Mesh,
  PlaneGeometry,
  RepeatWrapping,
  ShaderMaterial,
  Texture,
  Vector3
} from 'three';
import { Level } from './level';
import { renderer } from './state';

export class Ocean {
  static readonly scale = 4;
  static readonly waveSpeed = 1;
  static readonly waveHeight = 0.03;
  static readonly waveFrequency = 80;
  static readonly waveDetail = 150;
  static readonly textureRepeat = 10; // Powtarzanie tekstury
  static readonly config = [
    {
      opacity: 0.7,
      z: -0.05,
      renderOrder: 2
    },
    {
      opacity: 1,
      z: -0.3,
      renderOrder: 0
    }
  ];

  readonly cols: number;
  readonly rows: number;
  protected startTime = Date.now();

  constructor(texture: Texture, repeat = 1) {
    this.cols = Level.cols * repeat;
    this.rows = Level.rows * repeat;

    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;

    renderer.scene.add(
      ...Array.from({ length: Ocean.config.length }, (_: unknown, index) =>
        this.createPlane(texture, index)
      )
    );
  }

  protected createPlane(texture: Texture, index: number) {
    const geometry = new PlaneGeometry(
      this.cols,
      this.rows,
      Ocean.waveDetail,
      Ocean.waveDetail
    ); // więcej podziałów dla lepszego falowania
    const { opacity, z, renderOrder } = Ocean.config[index];
    const rotateZ = (index * Math.PI) / 2;
    const material = new ShaderMaterial({
      uniforms: {
        time: { value: rotateZ },
        map: { value: texture },
        opacity: { value: opacity },
        waveSpeed: { value: Ocean.waveSpeed },
        waveHeight: { value: Ocean.waveHeight / (index + 1) },
        waveFrequency: { value: Ocean.waveFrequency },
        textureRepeat: { value: Ocean.textureRepeat }
      },
      vertexShader: `
        uniform float time;
        uniform float waveSpeed;
        uniform float waveHeight;
        uniform float waveFrequency;
        uniform float textureRepeat;

        varying vec2 vUv;

        void main() {
          vUv = uv * textureRepeat; // Powtarzanie tekstury

          vec3 pos = position;
          
          // Sinusoidalna fala
          float wave = sin(pos.x * waveFrequency + time * waveSpeed) * waveHeight;
          wave += cos(pos.y * waveFrequency + time * waveSpeed) * waveHeight;
          pos.z += wave;

          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D map;
        uniform float opacity;
        uniform float time;
        uniform float textureRepeat;

        varying vec2 vUv;

        void main() {
          vec2 repeatedUV = vUv * textureRepeat + vec2(0.0, time * 0.02); // Powtarzanie + lekkie przesuwanie
          vec4 color = texture2D(map, fract(repeatedUV)); // fract() zapewnia powtarzanie

          gl_FragColor = vec4(color.rgb, color.a * opacity);
        }
      `,
      transparent: true
    });

    const mesh = new Mesh(geometry, material);
    const x = this.cols / 2 / Ocean.scale;
    const y = this.rows / 2 / Ocean.scale;

    mesh.setRotationFromAxisAngle(new Vector3(1, 0, 0), -Math.PI / 2);
    mesh.rotateZ(rotateZ);
    mesh.position.set(x, z, y);
    mesh.renderOrder = renderOrder;

    // Animacja shadera
    renderer.animations.push(() => {
      material.uniforms.time.value = (Date.now() - this.startTime) / 1000;
    });

    return mesh;
  }
}
