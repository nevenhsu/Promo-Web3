import type { LayoutData } from './layout'
import type { SanityArray } from './common'
import type { ImageAssetData } from './image'
import type { TableProps } from '@sanity/table'
import type { ContentData } from './content'
import type { NumberListData } from './numberList'
import type { ContentCardData } from './contendCard'
import type { TextCardData } from './textCard'
import type { TitleCardData } from './titleCard'

export type Item =
  | ImageAssetData
  | TableProps
  | ContentData
  | NumberListData
  | ContentCardData
  | TextCardData
  | TitleCardData

export type ItemType =
  | 'image'
  | 'mTable'
  | 'content'
  | 'numberList'
  | 'contentCard'
  | 'textCard'
  | 'titleCard'

export type RwdData = {
  title?: string
  divider?: { noDivider: boolean; noDividerTop: boolean; noDividerBottom: boolean }
  rwd?: {
    base: LayoutData | undefined
    xs: LayoutData | undefined
    sm: LayoutData | undefined
    md: LayoutData | undefined
    lg: LayoutData | undefined
    xl: LayoutData | undefined
  }
  items?: SanityArray<Item & { _type: ItemType }>
}
