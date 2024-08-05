import type { ImageAssetData } from './image'

export type SocialIconData = {
  icon: string
  username?: string
  href?: string
  noPopup?: boolean
  qrcode?: {
    asset: ImageAssetData
  }
}
