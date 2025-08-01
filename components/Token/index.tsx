'use client'

import { useState } from 'react'
import { Link } from '@/i18n/routing'
import { Group, Stack, Space, Tabs, Paper, Center } from '@mantine/core'
import { Avatar, Text, ThemeIcon } from '@mantine/core'
import RwdLayout from '@/components/share/RwdLayout'
import UserPaper from './UserPaper'
import ActivityItem from '@/components/share/ActivityItem'
import { formatNumber } from '@/utils/math'
import { isEnumMember } from '@/utils/helper'
import { PiLink } from 'react-icons/pi'
import type { UserToken } from '@/models/userToken'
import type { TTokenWithUser } from '@/models/token'
import type { TActivity } from '@/models/activity'

enum TabValue {
  Ranking = 'Ranking',
  Activity = 'Activity',
}

type TokenProps = {
  data: UserToken
  username: string
  count: number
  ranking: TTokenWithUser[]
  activities: TActivity[]
}

export default function Token({ data, username, count, ranking, activities }: TokenProps) {
  const { name, symbol, icon } = data
  const [activeTab, setActiveTab] = useState(TabValue.Ranking)

  return (
    <>
      <RwdLayout>
        <Group>
          <Avatar src={icon} name={''} color="initials" size={40}>
            {' '}
          </Avatar>

          <Stack gap="xs">
            <Text fz="lg" fw={500} lh={1}>
              {name || 'Token Name'}
            </Text>
            <Text fz="sm" c="dimmed" lh={1}>
              {symbol || 'Token Symbol'}
            </Text>
          </Stack>
        </Group>

        <Space h={24} />

        <Stack gap="xs">
          <Group>
            <Text fz="xs" c="dimmed" w={80}>
              Token Creator
            </Text>

            <Link href={{ pathname: '/u/[username]', params: { username } }}>
              <Group gap="xs">
                <Text fz="xs">{`@${username}`}</Text>
                <ThemeIcon size="xs" variant="transparent">
                  <PiLink size={14} />
                </ThemeIcon>
              </Group>
            </Link>
          </Group>
          <Group>
            <Text fz="xs" c="dimmed" w={80}>
              Total Supply
            </Text>
            <Text fz="xs">10b</Text>
          </Group>
          <Group>
            <Text fz="xs" c="dimmed" w={80}>
              Holders
            </Text>
            <Text fz="xs">{formatNumber(count)}</Text>
          </Group>
        </Stack>

        <Space h={32} />

        <Tabs
          value={activeTab}
          onChange={o => {
            if (o && isEnumMember(o, TabValue)) {
              setActiveTab(o as TabValue)
            }
          }}
        >
          <Tabs.List>
            <Tabs.Tab value={TabValue.Ranking}>Ranking</Tabs.Tab>
            <Tabs.Tab value={TabValue.Activity}>Activity</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value={TabValue.Ranking}>
            <Stack py={40} gap="xs">
              {ranking.length ? (
                ranking.map((item, index) => (
                  <UserPaper key={item._id} data={item} ranking={index + 1} />
                ))
              ) : (
                <Center h={64}>
                  <Text c="dimmed">No ranking available</Text>
                </Center>
              )}
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value={TabValue.Activity}>
            <Stack py={40}>
              {activities.length ? (
                activities.map(item => <ActivityItem key={item._id} data={item} />)
              ) : (
                <Center h={64}>
                  <Text c="dimmed">No activity available</Text>
                </Center>
              )}
            </Stack>
          </Tabs.Panel>
        </Tabs>

        <Space h="md" />
      </RwdLayout>

      <Space h={100} />
    </>
  )
}
