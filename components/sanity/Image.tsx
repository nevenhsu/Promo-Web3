'use client'

import { useState, useEffect } from 'react'
import { useNextSanityImage } from 'next-sanity-image'
import { client } from '@/sanity/client'
import { getImageData } from '@/sanity/queries'
import Img, { ImageProps } from 'next/image'
import type { ImageData, ImageAssetData } from '@/types/sanity/image'

export type SanityImageProps = { image: ImageAssetData } & Omit<
  ImageProps,
  'src' | 'width' | 'height' | 'loader' | 'placeholder' | 'blurDataURL' | 'alt'
>

export default function SanityImage({ image, style, ...rest }: SanityImageProps) {
  const { lqip, _ref } = image || {}
  const imageProps = useNextSanityImage(client, image)
  const [img, setImg] = useState<ImageData>()

  useEffect(() => {
    if (_ref && !lqip) {
      getImageData(_ref).then(res => {
        setImg(res)
      })
    }
  }, [_ref, lqip])

  return (
    <Img
      {...rest}
      {...imageProps}
      style={{ width: '100%', height: 'auto', objectFit: 'cover', ...style }}
      placeholder="blur"
      blurDataURL={lqip || img?.metadata.lqip || ' '}
      alt=""
    />
  )
}
