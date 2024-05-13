import { MyPortableText } from '@/components/common'
import { ContentData } from '@/types/sanity/content'
import classes from './index.module.css'

export function Content({ data }: { data: Partial<ContentData> }) {
  return (
    <div className={classes.blockItem}>
      <MyPortableText content={data.blockContent || []} />
    </div>
  )
}
