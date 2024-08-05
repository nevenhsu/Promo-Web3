import type { ImageAssetData } from './image'

export type AvatarData = {
  name: string
  bio: string
  image: {
    asset: ImageAssetData
  }
}
