import type { ImageAssetData } from './image'
import type { LottieData } from '@/types/sanity/lottie'

export type LottieImageData = {
  asset: ImageAssetData
  lottie?: LottieData
  hidden?: boolean
}
