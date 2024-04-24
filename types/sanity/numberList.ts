import type { SanityArray } from './common'

export type NumberListData = {
  title: string
  list: SanityArray<{ title: string; body: string }>
  noDivider: boolean
}
