import type { HrefData } from './href'
import type { PageData } from './page'

export type HomeData = {
  header: string
  titles: string[]
  titleDuration: number
  subtitle: string
  subtitleHref: HrefData
  caption1: string
  caption2: string
  captionHref: HrefData
  newsTitle: string
  arrowText: string
  pages: Array<Omit<PageData, 'content'> & { _id: string }>
}
