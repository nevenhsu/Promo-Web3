import _ from 'lodash'

export type MotionType = 'a' | 'b' | 'c' | 'd' | 'w' | 'x' | 'y' | 'z'
export type Point = [number, number]
export type Axis = [1 | -1, 1 | -1]

export const motionType: Record<MotionType, Axis[]> = {
  a: [
    [1, 1],
    [1, -1],
    [-1, -1],
    [-1, 1],
  ],
  b: [
    [1, 1],
    [-1, 1],
    [-1, -1],
    [1, -1],
  ],
  c: [
    [1, 1],
    [-1, 1],
    [1, -1],
    [-1, -1],
  ],
  d: [
    [1, 1],
    [-1, -1],
    [-1, 1],
    [1, -1],
  ],
  w: [
    [1, 1],
    [1, 1],
    [1, 1],
    [1, 1],
  ],
  x: [
    [1, -1],
    [1, -1],
    [1, -1],
    [1, -1],
  ],
  y: [
    [-1, -1],
    [-1, -1],
    [-1, -1],
    [-1, -1],
  ],
  z: [
    [-1, 1],
    [-1, 1],
    [-1, 1],
    [-1, 1],
  ],
}

export function getPath(points: Point[], smoothing: number) {
  // build the d attributes by looping over the points
  return points.reduce(
    (acc, point, i, a) =>
      i === 0 ? `M ${point[0]},${point[1]}` : `${acc} ${bezierCommand(point, i, a, smoothing)}`,
    ''
  )
}

export function getRandomPoints(
  point: Point,
  width: number | null,
  height: number | null,
  offsetX: number,
  offsetY: number,
  type?: MotionType
): Point[] {
  const mType = type ?? _.sample(['a', 'b', 'c', 'd', 'w', 'x', 'y', 'z'])
  if (width && height) {
    const axis = getAxis(point, width, height)
    const axisOrder = getAxisOrder(axis, mType)

    return axisOrder.map(o => getPointByAxis(o, width, height, offsetX, offsetY))
  }
  return []
}

function bezierCommand(point: Point, i: number, a: Point[], smoothing: number) {
  // start control point
  const cps = controlPoint(a[i - 1], a[i - 2], point, smoothing)

  // end control point
  const cpe = controlPoint(point, a[i - 1], a[i + 1], smoothing, true)
  return `C ${cps[0]},${cps[1]} ${cpe[0]},${cpe[1]} ${point[0]},${point[1]}`
}

function controlPoint(
  current: Point,
  previous: Point,
  next: Point,
  smoothing: number,
  reverse?: boolean
) {
  // When 'current' is the first or last point of the array
  // 'previous' or 'next' don't exist.
  // Replace with 'current'
  const p = previous || current
  const n = next || current

  // Properties of the opposed-line
  const o = line(p, n)

  // If is end-control-point, add PI to the angle to go backward
  const angle = o.angle + (reverse ? Math.PI : 0)
  const length = o.length * smoothing

  // The control point position is relative to the current point
  const x = current[0] + Math.cos(angle) * length
  const y = current[1] + Math.sin(angle) * length
  return [x, y]
}

function line(pointA: Point, pointB: Point) {
  const lengthX = pointB[0] - pointA[0]
  const lengthY = pointB[1] - pointA[1]
  return {
    length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
    angle: Math.atan2(lengthY, lengthX),
  }
}

function getPointByAxis(
  axis: Axis,
  width: number,
  height: number,
  offsetX: number,
  offsetY: number
): Point {
  const [xAxis, yAxis] = axis
  const w = width / 2
  const h = height / 2

  const x =
    xAxis > 0 ? _.random(offsetX / 3 + w, width - offsetX) : _.random(offsetX, w - offsetX / 3)
  const y =
    yAxis < 0 ? _.random(offsetY / 3 + h, height - offsetY) : _.random(offsetY, h - offsetY / 3)

  return [x, y]
}

function getAxis(point: Point, width: number, height: number): Axis {
  const [x, y] = point
  const xAxis = x <= width / 2 ? -1 : 1
  const yAxis = y <= height / 2 ? 1 : -1

  return [xAxis, yAxis]
}

function getAxisOrder(axis: Axis, type: MotionType) {
  const motion = motionType[type]
  const index = _.findIndex(motion, o => o.join(',') === axis.join(',')) + 1

  return _.times(4, String).map((o, i) => {
    return motion[(index + i) % 4]
  })
}
