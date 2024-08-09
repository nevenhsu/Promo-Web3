'use client'

import { useState, useEffect } from 'react'
import { useAsyncFn } from 'react-use'
import { Link } from '@/navigation'
import { Tabs, Group, Stack, Paper, Box, Space, Pagination } from '@mantine/core'
import { Title, Text, Button, Divider, Center, Skeleton } from '@mantine/core'
import RwdLayout from '@/components/share/RwdLayout'
import { getPublicActivities } from '@/services/activity'
import { getActionLabel } from './variables'
import { formatDate } from '@/utils/date'
import { formatNumber } from '@/utils/math'
import { toUpper, isEnumMember } from '@/utils/helper'
import type { TPublicActivity } from '@/models/activity'

enum TabValue {
  New = 'new',
  Ended = 'ended',
}

type DataPage = {
  total: number
  current: number
  limit: number
}

type Pages = { [key in TabValue]: DataPage }

export default function Activity() {
  const [activeTab, setActiveTab] = useState(TabValue.New)
  const [pages, setPages] = useState<Pages>({
    new: { total: 1, current: 1, limit: 10 },
    ended: { total: 1, current: 1, limit: 10 },
  })
  const { total, current, limit } = pages[activeTab]

  const handlePageChange = (page: number) => {
    setPages(prev => ({
      ...prev,
      [activeTab]: { ...prev[activeTab], current: page },
    }))
  }

  const [activityState, fetchActivities] = useAsyncFn(async () => {
    const ongoing = activeTab === TabValue.New
    const data = await getPublicActivities({ page: current, limit, ongoing })
    return data
  }, [current, limit, activeTab])
  // Get data from the hook
  const { value, loading } = activityState
  const activities = value?.activities || []

  // Update total page when transactions are fetched
  useEffect(() => {
    if (value && value.total) {
      const totalPage = Math.ceil(value.total / limit)
      setPages(prev => ({
        ...prev,
        [activeTab]: { ...prev[activeTab], total: totalPage },
      }))
    }
  }, [value, activeTab])

  // Fetch transactions when page changes
  useEffect(() => {
    fetchActivities()
  }, [current, activeTab])

  // Reset current page when tab changes
  useEffect(() => {
    setPages(prev => ({
      ...prev,
      [activeTab]: { ...prev[activeTab], current: 1 },
    }))
  }, [activeTab])

  const renderActivity = (data: TPublicActivity[]) => {
    if (loading) {
      return <Skeleton radius="md" h={168} />
    }

    if (!data.length) {
      return (
        <Center h={168}>
          <Text c="dimmed">No activity found</Text>
        </Center>
      )
    }

    return (
      <>
        {data.map(o => (
          <ActivityItem key={o.slug} data={o} />
        ))}
      </>
    )
  }

  return (
    <>
      <RwdLayout>
        <Tabs
          value={activeTab}
          onChange={o => {
            if (o && isEnumMember(o, TabValue)) {
              setActiveTab(o as TabValue)
            }
          }}
        >
          <Tabs.List>
            <Tabs.Tab value={TabValue.New}>New</Tabs.Tab>
            <Tabs.Tab value={TabValue.Ended}>Ended</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value={TabValue.New}>
            <Stack py={40}>{renderActivity(activities)}</Stack>
          </Tabs.Panel>

          <Tabs.Panel value={TabValue.Ended}>
            <Stack py={40}>{renderActivity(activities)}</Stack>
          </Tabs.Panel>
        </Tabs>

        <Space h="md" />

        <Center>
          <Pagination total={total} value={current} onChange={handlePageChange} />
        </Center>
      </RwdLayout>

      <Space h={100} />
    </>
  )
}

function ActivityItem({ data }: { data: TPublicActivity }) {
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
            <Stack py="md" w={56} flex="1 0 auto" justify="space-between">
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

              <Group justify="space-between">
                <Group gap={24}>
                  <Box ta="center">
                    <Text fz="xs">{toUpper(data.socialMedia)}</Text>
                    <Text fz="xs" c="dimmed">
                      Platform
                    </Text>
                  </Box>
                  <Box ta="center">
                    <Text fz="xs">{getActionLabel(data.activityType)}</Text>
                    <Text fz="xs" c="dimmed">
                      Action
                    </Text>
                  </Box>
                </Group>

                <Button size="sm" variant={data.joined ? 'outline' : 'filled'} px="md">
                  {data.joined ? 'Joined' : 'Join'}
                </Button>
              </Group>
            </Stack>
          </Group>
        </Paper>
      </Link>
    </>
  )
}
