import type { SocialIconData } from './socialIcon'
import type { SanityArray } from './common'

export type FooterData = {
  title: string
  description: string
  email: string
  links: SanityArray<SocialIconData>
}
