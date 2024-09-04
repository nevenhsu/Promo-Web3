'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { Box } from '@mantine/core'

gsap.registerPlugin(useGSAP)

export default function Animation() {
  const container = useRef(null)

  useGSAP(
    () => {
      // gsap code here...
      gsap.to('.box', { x: 360 }) // <-- automatically reverted
    },
    { scope: container }
  ) // <-- scope is for selector text (optional)

  return (
    <Box ref={container} w="100%" h="100%">
      Hello, world!
    </Box>
  )
}
