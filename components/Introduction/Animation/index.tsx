'use client'

import * as _ from 'lodash-es'
import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { useMeasure } from 'react-use'
import { Peep } from './peep'
import { normalWalk } from './walks'

gsap.registerPlugin(useGSAP)

type AnimationProps = {
  src: string
  rows: number
  cols: number
}

type DataRef = {
  stage: { width: number; height: number }
  mounted?: boolean
  img?: HTMLImageElement
  ready?: boolean
  allPeeps: Peep[] // all peeps
  crowd: Peep[] // active peeps
  availablePeeps: Peep[] // inactive peeps
}

export default function Animation({ src, rows, cols }: AnimationProps) {
  const dataRef = useRef<DataRef>({
    allPeeps: [],
    crowd: [],
    availablePeeps: [],
    stage: { width: 0, height: 0 },
  })
  const rootRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [stageRef, stage] = useMeasure<HTMLDivElement>()

  const init = () => {
    const { img } = dataRef.current
    if (img) {
      createPeeps(img)
      dataRef.current.ready = true
      resetPeeps()
    }
  }

  const resetPeeps = () => {
    const { allPeeps, ready } = dataRef.current
    if (!ready) return

    _.forEach(allPeeps, peep => {
      peep.walk?.kill()
    })
    dataRef.current.crowd = []
    dataRef.current.availablePeeps = [...dataRef.current.allPeeps]
  }

  const createPeeps = (image: HTMLImageElement) => {
    const { naturalWidth: width, naturalHeight: height } = image
    const total = rows * cols
    const rectWidth = width / rows
    const rectHeight = height / cols

    _.forEach(Array.from({ length: total }), (x, i) => {
      const peep = new Peep({
        image,
        rect: [(i % rows) * rectWidth, ((i / rows) | 0) * rectHeight, rectWidth, rectHeight],
      })
      dataRef.current.allPeeps.push(peep)
    })
  }

  const removePeepFromCrowd = (peep: Peep) => {
    const { crowd, availablePeeps } = dataRef.current
    removeItemFromArray(crowd, peep)
    availablePeeps.push(peep)
  }

  const resetPeep = (peep: Peep) => {
    const { stage } = dataRef.current
    const direction = Math.random() > 0.5 ? 1 : -1
    // using an ease function to skew random to lower values to help hide that peeps have no legs
    const offsetY = 100 - 250 * gsap.parseEase('power2.in')(Math.random())
    const startY = stage.height - peep.height + offsetY
    let startX
    let endX

    if (direction === 1) {
      startX = -peep.width
      endX = stage.width
      peep.scaleX = 1
    } else {
      startX = stage.width + peep.width
      endX = 0
      peep.scaleX = -1
    }

    peep.x = startX
    peep.y = startY
    peep.anchorY = startY

    return {
      startX,
      startY,
      endX,
    }
  }

  useGSAP(
    () => {
      // gsap code here...
      const addPeepToCrowd = () => {
        const { crowd, availablePeeps } = dataRef.current
        const peep = removeRandomFromArray(availablePeeps)
        const walk = normalWalk({
          gsap,
          peep,
          props: resetPeep(peep),
        }).eventCallback('onComplete', () => {
          removePeepFromCrowd(peep)
          addPeepToCrowd()
        })
        peep.walk = walk
        crowd.push(peep)
        crowd.sort((a, b) => a.anchorY - b.anchorY)
        return peep
      }

      const initCrowd = () => {
        const { availablePeeps } = dataRef.current
        while (availablePeeps.length) {
          // setting random tween progress spreads the peeps out
          addPeepToCrowd().walk?.progress(Math.random())
        }
      }

      const render = () => {
        initCrowd()

        const canvas = canvasRef.current
        const ctx = canvas?.getContext('2d')
        if (!canvas || !ctx) return

        canvas.width = canvas.width // clear canvas

        ctx.save()
        ctx.scale(devicePixelRatio, devicePixelRatio)

        dataRef.current.crowd.forEach(peep => {
          peep.render(ctx)
        })

        ctx.restore()
      }

      gsap.ticker.add(render)

      return () => {
        dataRef.current.allPeeps.forEach(peep => {
          peep.walk?.kill()
        })
        gsap.ticker.remove(render)
      }
    },
    { scope: rootRef }
  ) // <-- scope is for selector text (optional)

  useEffect(() => {
    // load image
    if (!dataRef.current.mounted) {
      dataRef.current.mounted = true

      const img = document.createElement('img')
      img.onload = init
      img.src = src
      dataRef.current.img = img
    }
  }, [src])

  useEffect(() => {
    // resize canvas
    const { width, height } = stage
    if (width && height) {
      const canvas = canvasRef.current
      dataRef.current.stage = {
        width,
        height,
      }
      if (canvas) {
        canvas.width = width * devicePixelRatio
        canvas.height = height * devicePixelRatio
      }
      resetPeeps()
    }
  }, [stage])

  return (
    <div ref={rootRef} style={{ width: '100%', height: '100%' }}>
      <div ref={stageRef} style={{ width: '100%', height: '100%' }}>
        <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
      </div>
    </div>
  )
}

const randomRange = (min: number, max: number) => min + Math.random() * (max - min)

function randomIndex<T>(array: Array<T>) {
  return randomRange(0, array.length) | 0
}
function removeFromArray<T>(array: Array<T>, i: number) {
  return array.splice(i, 1)[0]
}
function removeItemFromArray<T>(array: Array<T>, i: T) {
  return removeFromArray(array, array.indexOf(i))
}
function removeRandomFromArray<T>(array: Array<T>) {
  return removeFromArray(array, randomIndex(array))
}
