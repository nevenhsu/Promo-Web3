import _ from 'lodash'
import { Space } from '@mantine/core'
import type { SpaceData } from '@/types/space'

export function MySpace({ data }: { data: Partial<SpaceData> }) {
  const { height } = data || {}
  const h: any = _.merge({ base: 20 }, height)
  return <Space h={h} />
}
