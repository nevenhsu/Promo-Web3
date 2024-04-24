import type { SanityReference } from './common'

type Palette = {
  background: string
  foreground: string
  title: string
  population: number
}

type Dimensions = {
  height: number
  width: number
  aspectRatio: number
}

export type ImageAssetData = SanityReference & {
  lqip?: string
  dimensions?: Dimensions
  mimeType?: string
  url?: string
}

export type ImageData = {
  metadata: {
    isOpaque: boolean
    blurHash: string
    palette: {
      darkMuted: Palette
      muted: Palette
      lightVibrant: Palette
      darkVibrant: Palette
      lightMuted: Palette
      vibrant: Palette
      dominant: Palette
    }
    hasAlpha: false
    lqip: string
    dimensions: Dimensions
  }
  sha1hash: string
  originalFilename: string
  extension: string
  uploadId: string
  url: string
  size: number
  assetId: string
  _id: string
  _originalId: string
  mimeType: string
  path: string
}
