'use client'

import { Tabs, Stack, Space, Pagination } from '@mantine/core'
import { Text, Center, Skeleton } from '@mantine/core'
import RwdLayout from '@/components/share/RwdLayout'
import ActivityItem from '@/components/share/ActivityItem'
import { useActivity, TabValue } from '@/store/contexts/app/activityContext'
import { isEnumMember } from '@/utils/helper'

export default function Activity() {
  const { total, current, activeTab, data, loading, setActiveTab, handlePageChange } = useActivity()

  const renderActivity = () => {
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
            <Stack py={40}>{renderActivity()}</Stack>
          </Tabs.Panel>

          <Tabs.Panel value={TabValue.Ended}>
            <Stack py={40}>{renderActivity()}</Stack>
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
