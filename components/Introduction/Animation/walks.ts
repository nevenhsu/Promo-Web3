import type { Peep } from './peep'

const randomRange = (min: number, max: number) => min + Math.random() * (max - min)

type WalkProps = {
  gsap: typeof gsap
  peep: Peep
  props: {
    startX: number
    startY: number
    endX: number
  }
}

export function normalWalk({ gsap, peep, props }: WalkProps) {
  const { startY, endX } = props

  const xDuration = 10
  const yDuration = 0.25

  const tl = gsap.timeline()
  tl.timeScale(randomRange(0.5, 1.5))
  tl.to(
    peep,
    {
      duration: xDuration,
      x: endX,
      ease: 'none',
    },
    0
  )
  tl.to(
    peep,
    {
      duration: yDuration,
      repeat: xDuration / yDuration,
      yoyo: true,
      y: startY - 10,
    },
    0
  )

  return tl
}
