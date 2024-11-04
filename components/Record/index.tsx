'use client'

import { useState } from 'react'
import { isBefore } from 'date-fns'
import { Link } from '@/i18n/routing'
import { Group, Stack, Paper, Space, Box, Tabs, Center, Pagination } from '@mantine/core'
import { Title, Text, Button, Divider, Skeleton } from '@mantine/core'
import RwdLayout from '@/components/share/RwdLayout'
import { useActivityStatus } from '@/store/contexts/app/activityStatusContext'
import { formatNumber, formatPercent } from '@/utils/math'
import { isEnumMember } from '@/utils/helper'
import { calculateShare } from '@/lib/shareCalculator'
import type { TUserActivityStatusData } from '@/models/userActivityStatus'

enum TabValue {
  Score = 'Score',
  Airdrop = 'Airdrop',
}

export default function Record() {
  const { current, total, data, loading, handlePageChange } = useActivityStatus()
  const [activeTab, setActiveTab] = useState(TabValue.Score)

  const renderItem = () => {
    if (loading) {
      return <Skeleton radius="md" h={144} />
    }

    if (!data.length) {
      return (
        <Center h={144}>
          <Text c="dimmed">No record found</Text>
        </Center>
      )
    }

    return (
      <>
        {data.map(o =>
          activeTab === TabValue.Score ? (
            <ScoreItem key={o._id} data={o} />
          ) : (
            <AirdropItem key={o._id} data={o} />
          )
        )}
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
            <Tabs.Tab value={TabValue.Score}>Score</Tabs.Tab>
            <Tabs.Tab value={TabValue.Airdrop}>Airdrop</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value={TabValue.Score}>
            <Stack py={40}>{renderItem()}</Stack>
          </Tabs.Panel>

          <Tabs.Panel value={TabValue.Airdrop}>
            <Stack py={40}>{renderItem()}</Stack>
          </Tabs.Panel>
        </Tabs>

        <Space h="md" />

        <Center>
          <Pagination
            total={total}
            value={current}
            onChange={handlePageChange}
            disabled={loading}
          />
        </Center>
      </RwdLayout>

      <Space h={100} />
    </>
  )
}

function ScoreItem({ data }: { data: TUserActivityStatusData }) {
  return (
    <Link
      href={{
        pathname: '/activity/[slug]',
        params: { slug: data._activity.slug },
      }}
    >
      <Paper px="md" radius="sm" shadow="xs" h={144} display="flex">
        <Group wrap="nowrap" align="stretch" w="100%">
          {/* Left */}
          <Stack py="md" justify="space-between" w={64} flex="1 0 auto">
            <Box ta="center">
              <Text fz="sm" lh={1}>
                Score
              </Text>
              <Title className="nowrap" order={3} c="orange">
                {formatNumber(data.totalScore)}
              </Title>
            </Box>
            <Text ta="center" fz="xs" c="dimmed">
              {isBefore(new Date(), data._activity.endTime) ? 'Ongoing' : 'Ended'}
            </Text>
          </Stack>

          <Divider orientation="vertical" />

          {/* Right */}
          <Stack gap={32} py="md" w="100%" justify="space-between">
            <Title order={4} fw={500} mb={8} mt={-4} lh={1.25}>
              {data._activity.title}
            </Title>

            <Group justify="space-between" wrap="nowrap">
              <Group gap={24} wrap="nowrap">
                <Box ta="center">
                  <Text fz="xs">{formatNumber(data.selfScore)}</Text>
                  <Text fz="xs" c="dimmed">
                    Self
                  </Text>
                </Box>
                <Box ta="center">
                  <Text fz="xs">{formatNumber(data.referral1stScore + data.referral2ndScore)}</Text>
                  <Text fz="xs" c="dimmed">
                    Referral
                  </Text>
                </Box>
              </Group>

              <Button variant="outline" size="sm" px="md">
                View
              </Button>
            </Group>
          </Stack>
        </Group>
      </Paper>
    </Link>
  )
}

function AirdropItem({ data }: { data: TUserActivityStatusData }) {
  const { _activity, finalized } = data
  const { airdrop } = _activity
  const { airdropped, amount } = data.airdrop || {}

  const { shareRatio, airdropAmount } = calculateShare(_activity, data)
  const finalAmount = airdropped ? amount : airdropAmount.toFixed(6)

  return (
    <Link
      href={{
        pathname: '/activity/[slug]',
        params: { slug: data._activity.slug },
      }}
    >
      <Paper px="md" radius="sm" shadow="xs" h={144} display="flex">
        <Group wrap="nowrap" align="stretch" w="100%">
          {/* Left */}
          <Stack py="md" justify="space-between" w={64} flex="1 0 auto">
            <Box ta="center">
              <Text fz="sm" lh={1}>
                {airdrop.symbol}
              </Text>
              <Title className="nowrap" order={3} c="orange">
                {formatNumber(finalAmount)}
              </Title>
            </Box>
            <Text ta="center" fz="xs" c="dimmed">
              {finalized ? (airdropped ? 'Received' : 'Pending') : 'Unsettled'}
            </Text>
          </Stack>

          <Divider orientation="vertical" />

          {/* Right */}
          <Stack gap={32} py="md" w="100%" justify="space-between">
            <Title order={4} fw={500} mb={8} mt={-4} lh={1.25}>
              {data._activity.title}
            </Title>

            <Group justify="space-between" wrap="nowrap">
              <Group gap={24} wrap="nowrap">
                <Box ta="center">
                  <Text fz="xs">{formatNumber(airdrop.amount)}</Text>
                  <Text fz="xs" c="dimmed">
                    Prize
                  </Text>
                </Box>
                <Box ta="center">
                  <Text fz="xs">{formatPercent(shareRatio.toFixed(6))}</Text>
                  <Text fz="xs" c="dimmed">
                    Share
                  </Text>
                </Box>
              </Group>

              <Button variant="outline" size="sm" px="md">
                View
              </Button>
            </Group>
          </Stack>
        </Group>
      </Paper>
    </Link>
  )
}
