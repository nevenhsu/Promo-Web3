import { Box, Divider } from '@mantine/core'
import Card from '@/components/sanity/Card'
import { Subtitle } from '@/components/Fonts'
import { MyPortableText } from '@/components/common'
import type { TitleCardData } from '@/sanity/types/titleCard'
import classes from './index.module.css'

export function TitleCard({ data }: { data: Partial<TitleCardData> }) {
  const { title, blockContent } = data || {}
  return (
    <Card className={classes.blockItem} style={{ borderRadius: '40px' }}>
      <Subtitle fw={200} px={{ base: 20, sm: 32 }} py={24}>
        {title}
      </Subtitle>
      <Divider />
      <Box px={{ base: 20, sm: 32 }} py={32} pb={20}>
        <MyPortableText content={blockContent || []} />
      </Box>
    </Card>
  )
}
