import type { PortableTextBlock } from 'sanity'
import type { SanityArray } from './common'

export type ContentCardData = {
  title: string
  blockContent: SanityArray<PortableTextBlock>
}
