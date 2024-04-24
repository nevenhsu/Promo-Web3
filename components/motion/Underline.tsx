import { useState, useEffect } from 'react'
import { useHover } from '@mantine/hooks'
import { Box, type BoxProps } from '@mantine/core'
import { motion, animate, useTransform, useMotionValue } from 'framer-motion'

type UnderlineMotionProps = { children: React.ReactNode } & BoxProps & {
    duration?: number
    stroke?: number
  }

export default function UnderlineMotion({
  children,
  stroke,
  duration = 0.4,
  ...rest
}: UnderlineMotionProps) {
  const x = useMotionValue(0)
  const width = useTransform(x, [0, 1], ['0%', '100%'])
  const { hovered, ref } = useHover()
  const [align, setAlign] = useState<'left' | 'right'>('left')

  useEffect(() => {
    if (hovered) {
      setAlign('left')
      animate(x, 1, { duration })
    } else {
      setAlign('right')
      animate(x, 0, { duration: duration * 0.66 })
    }
  }, [x, hovered, duration])

  return (
    <Box ref={ref} component="span" pos="relative" {...rest}>
      {children}
      <motion.span
        style={{
          display: 'block',
          position: 'absolute',
          [align]: 0,
          bottom: -2,
          height: stroke || 1,
          width,
          backgroundColor: 'currentColor',
        }}
      />
    </Box>
  )
}
