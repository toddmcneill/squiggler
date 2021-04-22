import { getMirrorPoint } from './Main'
// {x: 686.5, y: 183}x: 686.5y: 183__proto__: Object {x: 706.5, y: 205} {x: 710.5, y: 242} {x: 704.5, y: 261}
describe('smoothLine', () => {
  it('returns a bezier curve that smooths the path', () => {
    const a = { x: 10, y: 20 }
    const b = { x: 20, y: 50 }
    const c = { x: 30, y: 10 }
    const d = { x: 40, y: 30 }
    const controlA = { x: 30, y: 80 }
    const controlB = { x: 20, y: -10 }
    const results = [{x: 2 * b.x - a.x, y: 2 * b.y - a.y}, {x: c.x - (d.x - c.x), y: c.y - (d.y - c.y)}]
    expect(results).toEqual([controlA, controlB])
  })
})
describe('getMirrorPoint', () => {
  it('return the mirror point', () => {
    const a = { x: 686, y: 183 }
    const b = { x: 706, y: 205 }
    const x = 686 + 686 - 706
    const y = 183 + 183 - 205
    const controlPoint = getMirrorPoint(a, b)
    expect(controlPoint).toEqual({ x, y })
  })
})