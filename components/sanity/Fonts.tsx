import { Headline, MyTitle, Subtitle, Body, Caption, Small } from '@/components/Fonts'
import type { BlockStyleProps } from 'sanity'

export function SanityHeadline({ children, ...props }: BlockStyleProps) {
  return <Headline>{children}</Headline>
}

export function SanityTitle({ children, ...props }: BlockStyleProps) {
  return <MyTitle>{children}</MyTitle>
}

export function SanitySubtitle({ children, ...props }: BlockStyleProps) {
  return <Subtitle>{children}</Subtitle>
}

export function SanityBody({ children, ...props }: BlockStyleProps) {
  return <Body>{children}</Body>
}

export function SanityCaption({ children, ...props }: BlockStyleProps) {
  return <Caption>{children}</Caption>
}

export function SanitySmall({ children, ...props }: BlockStyleProps) {
  return <Small>{children}</Small>
}
