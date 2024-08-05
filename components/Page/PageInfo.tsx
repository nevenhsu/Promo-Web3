import { Group } from '@mantine/core'
import { Caption } from '@/components/Fonts'
import { formateDate } from '@/utils/helper'
import type { PageData } from '@/sanity/types/page'

export default function BlogInfo({ data }: { data: Partial<PageData> }) {
  const { publishedAt, readTime } = data
  if (!publishedAt && !readTime) return null

  return (
    <>
      <Group c="dimmed" gap={8}>
        {publishedAt ? (
          <>
            <Caption>{formateDate(publishedAt)}</Caption>
            <Caption>·</Caption>
          </>
        ) : null}
        <Caption>{`${readTime} min read`}</Caption>
      </Group>
    </>
  )
}
