import type { PortableTextBlock } from 'sanity'
import type { SanityArray } from './common'

export type ContentData = {
  title: string
  blockContent: SanityArray<PortableTextBlock>
}
