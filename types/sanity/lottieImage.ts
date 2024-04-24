import type { ImageAssetData } from './image'
import type { LottieData } from '@/types/lottie'

export type LottieImageData = {
  asset: ImageAssetData
  lottie?: LottieData
  hidden?: boolean
}
