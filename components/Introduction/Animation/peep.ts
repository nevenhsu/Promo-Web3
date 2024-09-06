export class Peep {
  image: HTMLImageElement
  rect: [number, number, number, number] // x, y, width, height
  x: number
  y: number
  width: number
  height: number
  anchorY: number
  scaleX: number
  walk: gsap.core.Timeline | null

  constructor({
    image,
    rect,
  }: {
    image: HTMLImageElement
    rect: [number, number, number, number]
  }) {
    this.image = image
    this.rect = rect
    this.x = 0
    this.y = 0
    this.width = rect[2]
    this.height = rect[3]
    this.anchorY = 0
    this.scaleX = 1
    this.walk = null
  }

  setRect(rect: [number, number, number, number]) {
    this.rect = rect
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.scale(this.scaleX, 1)
    ctx.drawImage(this.image, ...this.rect, 0, 0, this.rect[2], this.rect[3])
    ctx.restore()
  }
}
