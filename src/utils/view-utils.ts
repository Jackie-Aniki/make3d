import { Matrix4, Quaternion, Vector3 } from 'three'

export const Math_Half_PI = Math.PI * 0.5

export const Math_Double_PI = Math.PI * 2

export const normalizeAngle = (angle: number) =>
  (Math_Double_PI + angle) % Math_Double_PI

export const normalize = (n: number) => Math.min(1, Math.max(-1, n))

export const randomOf = (array: any[]) =>
  array[Math.floor(Math.random() * array.length)]

export const distanceSq = (a: Vector3, b: Vector3) => {
  const x = a.x - b.x
  const y = a.z - b.z

  return x * x + y * y
}

export const getMatrix = (position: Vector3, scale: Vector3) => {
  const matrix = new Matrix4()
  const quaternion = new Quaternion()
  const offset = new Vector3(0.5, 0.5, 0.5)

  matrix.compose(position.add(offset), quaternion, scale)

  return matrix
}
