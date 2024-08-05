import { MyLink } from '@/components/MyLink'
import UnderlineMotion from '@/components/motion/Underline'
import type { HrefData } from '@/sanity/types/href'

export function Href({ data }: { data?: HrefData }) {
  if (!data) return null

  return (
    <MyLink href={data.link}>
      <UnderlineMotion stroke={2}>
        <span style={{ fontWeight: data.fontWeight }}>{data.text}</span>
      </UnderlineMotion>
    </MyLink>
  )
}
