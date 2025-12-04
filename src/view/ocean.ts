import {
  CircleGeometry,
  Group,
  Mesh,
  MeshBasicMaterial,
  RepeatWrapping,
  ShaderMaterial,
  Texture,
  Vector3
} from 'three'
import { Camera } from '../core/camera'
import { AbstractLevel } from '../level/abstract-level'
import {
  Math_Half_PI,
  alphaMaterialProps,
  materialProps,
  state
} from '../state'

export class Ocean {
  static readonly DEEP_WATER_Z = -0.2

  protected static readonly COLS = AbstractLevel.COLS
  protected static readonly ROWS = AbstractLevel.ROWS
  protected static readonly SHALLOW_WATER = {
    opacity: 0.6,
    waveLength: 0.12,
    strength: 0.8
  }

  readonly mesh = new Group()

  protected readonly animations: Array<(time: number) => void> = []
  protected readonly repeat: number
  protected readonly cols: number
  protected readonly rows: number

  protected startTime = Date.now()

  constructor(texture: Texture, repeat = 1.1) {
    texture.wrapS = RepeatWrapping
    texture.wrapT = RepeatWrapping

    this.repeat = repeat
    this.cols = Ocean.COLS * repeat
    this.rows = Ocean.ROWS * repeat
    this.mesh.add(this.createDeepWater(texture))
    this.mesh.add(this.createShallowWater(texture))

    this.onResize()
    window.addEventListener('resize', () => this.onResize())

    state.renderer.add(this)
  }

  onResize() {
    const scale = Camera.getFar()
    this.mesh.scale.set(scale, scale, scale)
  }

  update(ms = 0) {
    const { x, y } = state.renderer.camera?.target?.body || { x: 0, y: 0 }

    this.mesh.position.set(x, Ocean.DEEP_WATER_Z, y)
    this.animations.forEach((animation) => animation(ms))
  }

  protected createDeepWater(texture: Texture) {
    const scale = 2
    const radius = Math.hypot(this.cols, this.rows) / 2
    const geometry = new CircleGeometry(radius)
    const map = texture.clone()
    map.repeat.set(this.cols * scale, this.rows * scale)

    const material = new MeshBasicMaterial({
      ...materialProps,
      map
    })

    const mesh = new Mesh(geometry, material)
    mesh.setRotationFromAxisAngle(new Vector3(1, 0, 0), -Math_Half_PI)
    mesh.scale.set(scale, scale, scale)
    mesh.position.set(0, -0.25, 0)
    mesh.renderOrder = 0

    this.animations.push(() => {
      map.offset.set(
        (this.mesh.position.x * 0.5) % 1,
        1 - ((this.mesh.position.z * 0.5) % 1)
      )
    })

    return mesh
  }

  protected createShallowWater(texture: Texture) {
    const { opacity, waveLength, strength } = Ocean.SHALLOW_WATER
    const radius = Math.hypot(this.cols, this.rows) / 2
    const geometry = new CircleGeometry(radius)
    const map = texture.clone()
    const material = new ShaderMaterial({
      ...alphaMaterialProps,
      uniforms: {
        time: { value: 0 },
        cameraX: { value: 0 },
        cameraY: { value: 0 },
        cameraFar: { value: Camera.FAR },
        waveLength: { value: waveLength },
        map: { value: map },
        opacity: { value: opacity },
        strength: { value: strength }
      },
      vertexShader: `
        uniform float time;
        uniform float waveLength;
        uniform float cameraFar;
        uniform float cameraX;
        uniform float cameraY;
      
        varying float wave;
        varying vec2 vUv;
      
        void main() {
          wave = sin((position.y + time) * waveLength);
          vUv = uv * cameraFar + vec2(cameraX, cameraY);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D map;
        uniform float opacity;
        uniform float strength;

        varying float wave;
        varying vec2 vUv;
      
        void main() {
          vec2 repeatedUV = mod(vUv + vec2(0.0, wave * strength), 1.0);
          vec4 color = texture2D(map, repeatedUV);
          gl_FragColor = vec4(color.rgb, opacity);
        }
      `
    })

    const mesh = new Mesh(geometry, material)
    mesh.setRotationFromAxisAngle(new Vector3(1, 0, 0), -Math_Half_PI)
    mesh.position.set(0, 0, 0)
    mesh.renderOrder = 1

    this.animations.push((ms: number) => {
      material.uniforms.time.value =
        (material.uniforms.time.value + ms * 0.0001) % 1_000
      material.uniforms.cameraX.value = (this.mesh.position.x * 0.5) % 1
      material.uniforms.cameraY.value = 1 - ((this.mesh.position.z * 0.5) % 1)
    })

    return mesh
  }
}
