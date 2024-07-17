'use client'

import { useState, useEffect } from 'react'
import { useActivity } from '@/store/contexts/user/activityContext'
import { Link } from '@/navigation'
import { Tabs, Group, Stack, Paper, Box, Space, Divider } from '@mantine/core'
import { Title, Text, Button } from '@mantine/core'
import RwdLayout from '@/components/share/RwdLayout'
import { getActionLabel } from './variables'
import { formatDate } from '@/utils/date'
import { formatNumber } from '@/utils/math'
import type { TPublicActivity } from '@/models/activity'

enum TabValue {
  New = 'new',
  Ended = 'ended',
}

export default function Activity() {
  const {
    fetchOngoingActivities,
    fetchOngoingState,
    fetchPastActivities,
    fetchPastState,
    ongoing,
    past,
    maxPage,
  } = useActivity()

  const [activeTab, setActiveTab] = useState<string | null>(TabValue.New)
  const [activePage, setActivePage] = useState(1)

  const isOngoing = activeTab === TabValue.New
  const currentData = isOngoing ? ongoing : past
  const currentMaxPage = isOngoing ? maxPage.ongoing : maxPage.past
  const currentFetchState = isOngoing ? fetchOngoingState : fetchPastState

  useEffect(() => {
    if (activePage > currentData.times) {
      if (isOngoing) {
        fetchOngoingActivities()
      } else {
        fetchPastActivities()
      }
    }
  }, [isOngoing, activePage, currentData])

  return (
    <>
      <RwdLayout>
        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Tab value={TabValue.New}>New</Tabs.Tab>
            <Tabs.Tab value={TabValue.Ended}>Ended</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value={TabValue.New}>
            <Stack py={40}>
              {currentData.data.map(o => (
                <ActivityItem key={o.slug} data={o} />
              ))}
            </Stack>
          </Tabs.Panel>
        </Tabs>
      </RwdLayout>

      <Space h={100} />
    </>
  )
}

function ActivityItem({ data }: { data: TPublicActivity }) {
  return (
    <>
      <Paper px="md" radius="sm" shadow="xs">
        <Group wrap="nowrap" align="stretch">
          {/* Left */}
          <Stack py="md" justify="space-between" w={56} flex="1 0 auto">
            <Box ta="center">
              <Text fz="sm" lh={1}>
                {data.airdrop.symbol}
              </Text>
              <Title order={3} c="orange">
                {formatNumber(data.airdrop.amount)}
              </Title>
            </Box>
            <Text ta="center" fz="xs" c="dimmed">
              {formatDate(new Date(data.endTime))}
            </Text>
          </Stack>

          <Divider orientation="vertical" />

          {/* Right */}
          <Stack gap={32} py="md" w="100%">
            <Box>
              <Title order={4} fw={500} lh={1} mb={8}>
                {data.title}
              </Title>
              <Text fz="xs" c="dark" lineClamp={2}>
                {data.description}
              </Text>
            </Box>

            <Group justify="space-between">
              <Group gap={24}>
                <Box ta="center">
                  <Text fz="xs" c="dimmed">
                    Platform
                  </Text>
                  <Text fz="sm">{data.socialMedia.toUpperCase()}</Text>
                </Box>
                <Box ta="center">
                  <Text fz="xs" c="dimmed">
                    Action
                  </Text>
                  <Text fz="sm">{getActionLabel(data.activityType)}</Text>
                </Box>
              </Group>
              <Link
                href={{
                  pathname: '/activity/[slug]',
                  params: { slug: data.slug },
                }}
              >
                <Button variant={data.joined ? 'light' : 'filled'}>
                  {data.joined ? 'Joined' : 'Join'}
                </Button>
              </Link>
            </Group>
          </Stack>
        </Group>
      </Paper>
    </>
  )
}
