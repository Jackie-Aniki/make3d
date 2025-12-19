import { Texture, Vector3 } from 'three'
import { Renderer } from '../core/renderer'
import { Events } from '../events'
import { state } from '../state'
import { getMatrix } from '../utils/view-utils'
import { BaseLevel } from './base-level'
import { BoxMesh } from './box-mesh'
import { LevelCreateProps, LevelObjects, LevelProps } from './model'
import { Billboard } from '../view/billboard'
import { TextureUtils } from '../utils/texture-utils'

export class Level extends BaseLevel {
  static SIDES = 'sides.webp'
  static FLOOR = 'floor.webp'
  static OCEAN = 'ocean.webp'

  static readonly DEFAULT_OBJECTS: LevelObjects = {
    ['tree.webp']: {
      fill: 0.5,
      chance: 0.4,
      minHeight: 0.1,
      maxHeight: 2,
      iterations: 2,
      scale: 2
    },
    ['bush.webp']: {
      fill: 0.4,
      chance: 0.4,
      minHeight: 0.5,
      maxHeight: 3,
      spread: 2
    }
  }

  static async create(
    canvas?: HTMLCanvasElement,
    {
      sides,
      floor,
      ocean,
      objects = Level.DEFAULT_OBJECTS
    }: LevelCreateProps<string> = {}
  ): Promise<Level> {
    const [sidesTex, floorTex, oceanTex] = await TextureUtils.load([
      sides || Level.SIDES,
      floor || Level.FLOOR,
      ocean || Level.OCEAN,
      ...Object.keys(objects)
    ])

    return new Level({
      canvas,
      objects,
      ocean: oceanTex,
      textures: TextureUtils.mapToCube({
        up: floorTex,
        down: floorTex,
        left: sidesTex,
        right: sidesTex,
        front: sidesTex,
        back: sidesTex
      })
    })
  }

  mesh: BoxMesh
  objects: LevelObjects

  constructor(
    { textures, canvas, ocean, skybox, objects = {} }: LevelProps,
    setLevel = true
  ) {
    Renderer.create({ canvas, ocean, skybox })
    Events.addEventListeners()

    super()

    this.mesh = this.createBoxMesh(textures)
    this.objects = objects

    this.forEachHeight(this.heights, (col, row, height) => {
      this.setMeshHeight(col, row, height)
      this.createCollider(col, row, height)
    })

    this.createObjects()

    if (setLevel) {
      state.renderer.setLevel(this)
    }
  }

  protected createBoxMesh(textures: Texture[]) {
    const box = new BoxMesh(textures, Level.COLS, Level.ROWS)
    box.position.set(-Level.COLS / 2, 0, -Level.ROWS / 2)
    return box
  }

  protected createObjects() {
    Object.entries(this.objects).forEach(
      ([
        texturePath,
        {
          minHeight,
          maxHeight,
          fill = 0.5,
          chance = 0.5,
          iterations = 1,
          spread = 1,
          scale = 1
        }
      ]) => {
        const textureName = TextureUtils.getName(texturePath)
        if (!TextureUtils.hasTexture(textureName)) return

        const heights = Level.createMatrix({
          fill,
          iterations
        })

        this.forEachHeight(heights, (col, row) => {
          const posX = Math.floor(col)
          const posY = Math.floor(row)
          const height = this.heights[posX][posY]

          if (minHeight && height < minHeight) return
          if (maxHeight && height > maxHeight) return

          for (let spreadY = 0; spreadY < spread; spreadY++) {
            for (let spreadX = 0; spreadX < spread; spreadX++) {
              if (chance && Math.random() > chance) return

              const { x, y } = this.getXY(col, row)
              new Billboard({
                textureName,
                scale,
                level: this,
                x: x + (spreadX + 0.5) / spread,
                y: y + (spreadY + 0.5) / spread
              })
            }
          }
        })
      }
    )
  }

  protected setMeshHeight(col: number, row: number, height: number) {
    const matrix = getMatrix(
      new Vector3(col, height / 2 - 0.75, row),
      new Vector3(1, height, 1)
    )

    this.mesh.setMatrixAt(row * Level.ROWS + col, matrix)
  }
}
