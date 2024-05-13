import Card from '@/components/sanity/Card'
import { Subtitle } from '@/components/Fonts'
import type { TextCardData } from '@/types/sanity/textCard'
import classes from './index.module.css'

export function TextCard({ data }: { data: Partial<TextCardData> }) {
  const { title } = data || {}

  return (
    <Card className={classes.blockItem} px={8} py={{ base: 24, sm: 32 }}>
      <Subtitle className="relative-vertical" ta="center">
        {title}
      </Subtitle>
    </Card>
  )
}
