'use client'

import { Title, Stack, Space, Paper, Center, Text, Skeleton, Pagination } from '@mantine/core'
import Token from './Token'
import RwdLayout from '@/components/share/RwdLayout'
import { getTokenInfo } from '@/contracts/tokens'
import { useAirdrop } from '@/store/contexts/app/airdropContext'

export default function WalletAirdrop() {
  const { data, total, current, loading, handlePageChange } = useAirdrop()

  const renderData = () => {
    if (loading) {
      return (
        <>
          <Skeleton radius="md" h={64} />
        </>
      )
    }

    if (data.length === 0) {
      return (
        <Paper radius="md" p="md" shadow="xs">
          <Center>
            <Text fz="sm" c="dimmed">
              No airdrop yet
            </Text>
          </Center>
        </Paper>
      )
    }

    return data.map((o, i) => {
      const info = getTokenInfo(o.symbol)
      return (
        <Token
          key={o.symbol}
          symbol={o.symbol}
          icon={info.icon}
          name={info.name}
          received={o.receivedAmount}
          pending={o.pendingAmount}
        />
      )
    })
  }

  return (
    <>
      <RwdLayout>
        <Stack gap="xl">
          <Stack gap={4}>
            <Title order={3}>Airdrop</Title>
            <Text fz="sm" c="dimmed">
              Join activities to earn tokens
            </Text>
          </Stack>

          <Stack gap="xs">{renderData()}</Stack>

          <Space h="md" />

          <Center>
            <Pagination
              total={total}
              value={current}
              onChange={handlePageChange}
              disabled={loading}
            />
          </Center>
        </Stack>
      </RwdLayout>

      <Space h={100} />
    </>
  )
}
