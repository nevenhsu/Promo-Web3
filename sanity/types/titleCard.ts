import type { PortableTextBlock } from 'sanity'
import type { SanityArray } from './common'

export type TitleCardData = {
  title: string
  blockContent: SanityArray<PortableTextBlock>
}
