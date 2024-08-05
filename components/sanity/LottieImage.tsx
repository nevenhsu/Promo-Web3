'use client'

import clsx from 'clsx'
import { useState, useEffect } from 'react'
import { Box } from '@mantine/core'
import Lottie from 'lottie-react'
import SanityImage from '@/components/sanity/Image'
import type { LottieImageData } from '@/sanity/types/lottieImage'

type LottieImageProps = {
  value: LottieImageData
}

export function LottieImage({ value }: LottieImageProps) {
  const { asset, lottie, hidden = true } = value
  const [animationData, setAnimationData] = useState<any>()

  useEffect(() => {
    const url = lottie?.url
    if (url) {
      fetch(url)
        .then(res => res.json())
        .then(data => {
          setAnimationData(data)
        })
        .catch(console.error)
    }
  }, [lottie?.url])

  return (
    <Box pos="relative" w="100%" h="auto">
      {asset ? (
        <SanityImage
          image={asset}
          style={{ visibility: hidden && animationData ? 'hidden' : 'unset' }}
        />
      ) : null}

      {animationData ? (
        <Box className={clsx({ 'absolute-center': Boolean(asset) })} w="100%" h="auto">
          <Lottie animationData={animationData} loop autoplay />
        </Box>
      ) : null}
    </Box>
  )
}
