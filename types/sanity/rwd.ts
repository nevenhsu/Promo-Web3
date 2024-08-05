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

export type Rwd<T> = {
  base?: T
  xs?: T
  sm?: T
  md?: T
  lg?: T
  xl?: T
}

export type RwdData = {
  title?: string
  divider?: { noDivider: boolean; noDividerTop: boolean; noDividerBottom: boolean }
  rwd?: Rwd<LayoutData>
  items?: SanityArray<Item & { _type: ItemType }>
}
