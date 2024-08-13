'use client'

import { Space, Stack, Group, Box, Paper, Tabs, Skeleton } from '@mantine/core'
import { Text, Title, Avatar, Center, Pagination } from '@mantine/core'
import RwdLayout from '@/components/share/RwdLayout'
import { useReferral, TabValue } from '@/store/contexts/app/referralContext'
import { isEnumMember } from '@/utils/helper'
import { formatNumber } from '@/utils/math'
import { formatLocalDate } from '@/utils/helper'
import type { TReferee } from '@/models/referral'

export default function ReferList() {
  // Referral state
  const referralState = useReferral()
  const { activeTab, pages, lv1State, lv2State, referralCountState } = referralState
  const { setActiveTab, handlePageChange } = referralState

  const { value: countValue, loading: countLoading } = referralCountState

  // Pagination
  const { total, current } = pages[activeTab]

  // Referral list
  const currentState = activeTab === TabValue.Lv1 ? lv1State : lv2State
  const { value, loading } = currentState
  const data = value || []

  const renderTransaction = () => {
    if (loading) {
      return <Skeleton radius="md" h={80} />
    }

    if (!data.length) {
      return (
        <Center h={64}>
          <Text c="dimmed">No referral found</Text>
        </Center>
      )
    }

    return data.map(o => <RefereeItem key={o._id} data={o} />)
  }

  return (
    <>
      <RwdLayout>
        <Space h={16} />

        {countLoading ? (
          <>
            <Skeleton radius="md" h={24} mb={8} />
            <Skeleton radius="md" h={24} mb={14} width="50%" />
          </>
        ) : (
          <Title
            order={3}
            mb={8}
          >{`You’ve invited ${formatNumber(countValue?.lv1 || 0)} friends & ${formatNumber(countValue?.lv2 || 0)} friends’ friends`}</Title>
        )}

        <Text fz="sm" c="dimmed">
          Keep inviting friends to earn more!
        </Text>

        <Space h={40} />

        <Tabs
          value={activeTab}
          onChange={o => {
            if (o && isEnumMember(o, TabValue)) {
              setActiveTab(o as TabValue)
            }
          }}
        >
          <Tabs.List>
            <Tabs.Tab value={TabValue.Lv1}>Friends</Tabs.Tab>
            <Tabs.Tab value={TabValue.Lv2}>Friends’ Friends</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value={TabValue.Lv1}>
            <Box py={24}>
              <Stack>{renderTransaction()}</Stack>
            </Box>
          </Tabs.Panel>
          <Tabs.Panel value={TabValue.Lv2}>
            <Box py={24}>
              <Stack>{renderTransaction()}</Stack>
            </Box>
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

function RefereeItem({ data }: { data: TReferee }) {
  const { referee, score } = data
  const { username, name, details } = referee
  const shortName =
    name
      ?.split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase() || username?.substring(0, 1).toUpperCase()

  return (
    <Paper p={16} shadow="xs" h={80}>
      <Group justify="space-between" wrap="nowrap" h="100%">
        <Group wrap="nowrap">
          <Avatar src={details.avatar}>{shortName}</Avatar>
          <Box>
            <Text fw={500} lineClamp={1}>
              {name || 'Anonymity'}
            </Text>
            <Text fz="xs" c="dimmed" lineClamp={1}>
              {`@${username}`}
            </Text>
          </Box>
        </Group>
        <Box ta="right">
          <Text className="nowrap" fw={500} c="orange">
            {formatNumber(score || 0)}
          </Text>
          <Text className="nowrap" fz="xs" c="dimmed">
            {formatLocalDate(data.createdAt)}
          </Text>
        </Box>
      </Group>
    </Paper>
  )
}
