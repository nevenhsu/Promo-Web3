import type { HrefData } from './href'
import type { ActivityData } from './activity'

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
  activities: Array<Omit<ActivityData, 'content'> & { _id: string }>
}
