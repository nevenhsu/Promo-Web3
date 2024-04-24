import type { PortableTextBlock } from 'sanity'
import type { ImageAssetData } from './image'
import type { CategoryData } from './category'
import type { AvatarData } from './avatar'
import type { SanityArray, SanitySlug } from './common'

export type ActivityData = SanitySlug & {
  title: string
  description: string
  locked: boolean
  password: string
  passwordHint: string
  mainImage: {
    base?: { asset: ImageAssetData }
    xs?: { asset: ImageAssetData }
    sm?: { asset: ImageAssetData }
    md?: { asset: ImageAssetData }
    lg?: { asset: ImageAssetData }
    xl?: { asset: ImageAssetData }
  }
  categories: CategoryData[]
  author: AvatarData
  publishedAt: string
  readTime: number
  content: SanityArray<PortableTextBlock>
}
