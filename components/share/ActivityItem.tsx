'use client'

import { isAfter } from 'date-fns'
import { Link } from '@/i18n/routing'
import { Group, Stack, Paper, Box } from '@mantine/core'
import { Title, Text, Button, Divider } from '@mantine/core'
import { formatDate } from '@/utils/date'
import { formatNumber } from '@/utils/math'
import { toUpper } from '@/utils/helper'
import { ActivityType } from '@/types/db'
import type { TPublicActivity } from '@/models/activity'

export default function ActivityItem({ data }: { data: TPublicActivity }) {
  const isEnd = isAfter(new Date(), new Date(data.endTime))
  return (
    <>
      <Link
        href={{
          pathname: '/activity/[slug]',
          params: { slug: data.slug },
        }}
      >
        <Paper px="md" radius="sm" shadow="xs" mih={168} display="flex">
          <Group wrap="nowrap" align="stretch" w="100%">
            {/* Left */}
            <Stack py="md" w={64} flex="1 0 auto" justify="space-between">
              <Box ta="center">
                <Text className="nowrap" fz="sm" lh={1}>
                  {data.airdrop.symbol}
                </Text>
                <Title className="nowrap" order={3} c="orange">
                  {formatNumber(data.airdrop.amount)}
                </Title>
              </Box>
              <Text className="nowrap" ta="center" fz="xs" c="dimmed">
                {formatDate(new Date(data.startTime))}
              </Text>
            </Stack>

            <Divider orientation="vertical" />

            {/* Right */}
            <Stack gap={32} py="md" w="100%" justify="space-between">
              <Box>
                <Title order={4} fw={500} mb={8} mt={-4} lh={1.25}>
                  {data.title}
                </Title>
                <Text fz="xs" c="dark" lineClamp={2}>
                  {data.description}
                </Text>
              </Box>

              <Group justify="space-between" wrap="nowrap">
                <Group gap={24} wrap="nowrap">
                  <Box ta="center">
                    <Text className="nowrap" fz="xs">
                      {toUpper(data.socialMedia)}
                    </Text>
                    <Text fz="xs" c="dimmed">
                      Platform
                    </Text>
                  </Box>
                  <Box ta="center">
                    <Text className="nowrap" fz="xs">
                      {getActionLabel(data.activityType)}
                    </Text>
                    <Text fz="xs" c="dimmed">
                      Action
                    </Text>
                  </Box>
                </Group>

                <Button variant={data.joined || isEnd ? 'outline' : 'filled'} size="sm" px="md">
                  {data.joined ? 'Joined' : isEnd ? 'End' : 'Join'}
                </Button>
              </Group>
            </Stack>
          </Group>
        </Paper>
      </Link>
    </>
  )
}

export const getActionLabel = (type: number) => {
  switch (type) {
    case ActivityType.Repost:
      return 'Repost'
    case ActivityType.Story:
      return 'Add to story'
    default:
      return ''
  }
}
