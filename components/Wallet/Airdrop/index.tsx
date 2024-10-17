'use client'

import { useAppSelector } from '@/hooks/redux'
import { Title, Stack, Space, Paper, Center, Text } from '@mantine/core'
import Token from './Token'
import RwdLayout from '@/components/share/RwdLayout'
import { getTokenInfo } from '@/contracts/tokens'

export default function WalletAirdrop() {
  const { statusData } = useAppSelector(state => state.user)
  const { airdrops = [] } = statusData || {}

  // TODO: get token data from server

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

          <Stack gap="xs">
            {airdrops.length === 0 && (
              <Paper radius="md" p="md" shadow="xs">
                <Center>
                  <Text fz="sm" c="dimmed">
                    No airdrop yet
                  </Text>
                </Center>
              </Paper>
            )}
            {airdrops.map((o, i) => {
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
            })}
          </Stack>
        </Stack>
      </RwdLayout>

      <Space h={100} />
    </>
  )
}
