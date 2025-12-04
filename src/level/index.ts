import { System } from 'check2d'
import { Inject } from 'inject.min'
import { Texture, Vector3 } from 'three'
import { Renderer } from '../core/renderer'
import { Events } from '../events'
import { state } from '../state'
import {
  getMatrix,
  getTextureName,
  loadTextures,
  mapCubeTextures
} from '../utils/view-utils'
import { Bush } from '../view/bush'
import { Tree } from '../view/tree'
import { AbstractLevel } from './abstract-level'
import { BoxMesh } from './box-mesh'
import { LevelCreateProps, LevelObjects, LevelProps } from './model'
import { Billboard } from '../view/billboard'

export class Level extends AbstractLevel {
  @Inject(System) system!: System

  static SIDES = 'sides.webp'
  static FLOOR = 'floor.webp'
  static OCEAN = 'ocean.webp'
  static TREE = `${Tree.DEFAULT_PROPS.textureName}.webp`
  static BUSH = `${Bush.DEFAULT_PROPS.textureName}.webp`

  static readonly DEFAULT_OBJECTS: LevelObjects = {
    [Level.TREE]: {
      fill: 0.5,
      chance: 0.25,
      minHeight: 2,
      iterations: 2
    },
    [Level.BUSH]: {
      fill: 0.35,
      chance: 0.6,
      minHeight: 1
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
    const [sidesTex, floorTex, oceanTex] = await loadTextures([
      sides || Level.SIDES,
      floor || Level.FLOOR,
      ocean || Level.OCEAN,
      ...Object.keys(objects)
    ])

    return new Level({
      canvas,
      objects,
      ocean: oceanTex,
      textures: Level.getCubeTextures(sidesTex, floorTex)
    })
  }

  protected static getCubeTextures(sidesTex: Texture, floorTex: Texture) {
    return mapCubeTextures({
      up: floorTex,
      down: floorTex,
      left: sidesTex,
      right: sidesTex,
      front: sidesTex,
      back: sidesTex
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
        { fill, iterations, minHeight, maxHeight, chance, spread = 1 }
      ]) => {
        const textureName = getTextureName(texturePath)
        const offset = spread / 2
        const heights = Level.createMatrix({
          fill,
          iterations
        })

        this.forEachHeight(heights, (col, row) => {
          const posX = Math.floor(col * spread)
          const posY = Math.floor(row * spread)
          const height = this.heights[posX][posY]

          if (minHeight && height < minHeight) return
          if (maxHeight && height > maxHeight) return
          if (chance && Math.random() > chance) return

          const { x, y } = this.getXY(col, row)
          new Billboard({
            textureName,
            level: this,
            x: x + offset,
            y: y + offset
          })
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
