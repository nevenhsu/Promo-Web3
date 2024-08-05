import * as _ from 'lodash-es'
import { Box, List, Divider } from '@mantine/core'
import { Subtitle, Caption } from '@/components/Fonts'
import {
  PiNumberCircleOneFill,
  PiNumberCircleTwoFill,
  PiNumberCircleThreeFill,
  PiNumberCircleFourFill,
  PiNumberCircleFiveFill,
  PiNumberCircleSixFill,
  PiNumberCircleSevenFill,
  PiNumberCircleEightFill,
  PiNumberCircleNineFill,
} from 'react-icons/pi'
import type { NumberListData } from '@/sanity/types/numberList'

const icons = [
  PiNumberCircleOneFill,
  PiNumberCircleTwoFill,
  PiNumberCircleThreeFill,
  PiNumberCircleFourFill,
  PiNumberCircleFiveFill,
  PiNumberCircleSixFill,
  PiNumberCircleSevenFill,
  PiNumberCircleEightFill,
  PiNumberCircleNineFill,
] as const

export function NumberList({ data }: { data: Partial<NumberListData> }) {
  const { list, noDivider } = data || {}

  return (
    <>
      <List>
        {_.map(list, (o, i) => {
          const Icon = icons[i % icons.length]
          return (
            <Box key={o._key}>
              {!noDivider && i == 0 ? <Divider /> : null}
              <Box py={20}>
                <List.Item key={o._key} icon={<Icon size={20} />}>
                  <Subtitle mb={8}>{o.title}</Subtitle>
                  <Caption c="dimmed">{o.body}</Caption>
                </List.Item>
              </Box>
              {!noDivider ? <Divider /> : null}
            </Box>
          )
        })}
      </List>
    </>
  )
}
