'use client'

import { Link } from '@/navigation'
import { useAppSelector } from '@/hooks/redux'
import { Box, Space, Group, Stack, Text, Title, Tabs } from '@mantine/core'
import RwdLayout from '@/components/share/RwdLayout'
import BaseIcon from '@/public/images/icons/base.svg'
import { PiScan, PiPiggyBank, PiHandCoins, PiClockCountdown } from 'react-icons/pi'
import { PiCurrencyBtcFill, PiCurrencyDollarFill } from 'react-icons/pi'
import classes from './index.module.css'

export default function Wallet() {
  const { _id, fetched, data } = useAppSelector(state => state.user)
  const { username, name, details } = data

  return (
    <>
      <RwdLayout c="white" bg="var(--mantine-primary-color-6)">
        <Group justify="space-between">
          <Text fz={14} opacity={0.8}>
            Balance
          </Text>
          <Box h={14}>
            <BaseIcon className={classes.chainIcon} />
          </Box>
        </Group>
        <Title order={2}>USD 13220.42</Title>
        <Space h={40} />

        <Group className={classes.actions} grow>
          <Link href="/wallet/pay">
            <Box w={40} h={40}>
              <PiScan size={24} />
            </Box>
            <Text>Pay</Text>
          </Link>
          <Link href="/wallet/deposit">
            <Box w={40} h={40}>
              <PiPiggyBank size={24} />
            </Box>
            <Text>Deposit</Text>
          </Link>
          <Link href="/wallet/withdraw">
            <Box w={40} h={40}>
              <PiHandCoins size={24} />
            </Box>
            <Text>Withdraw</Text>
          </Link>
          <Link href="/wallet/history">
            <Box w={40} h={40}>
              <PiClockCountdown size={24} />
            </Box>
            <Text>History</Text>
          </Link>
        </Group>
      </RwdLayout>

      <RwdLayout>
        <Box w="100%">
          <Tabs className={classes.tabs} variant="pills" defaultValue="asset" radius="xl">
            <Tabs.Tab value="asset">Asset</Tabs.Tab>
            <Tabs.Tab value="activity">Activity</Tabs.Tab>
          </Tabs>
        </Box>
        <Space h={24} />
        <Stack>
          {/* Item */}
          <Group justify="space-between">
            <Group>
              <PiCurrencyBtcFill size={32} />
              <Stack gap={4}>
                <Text fz={14} fw={500}>
                  Bitcoin
                </Text>
                <Text fz={12} c="dimmed">
                  BTC
                </Text>
              </Stack>
            </Group>
            <Stack gap={4} ta="right">
              <Text fz={14} fw={500}>
                5.20
              </Text>
              <Text fz={12} c="dimmed">
                USD 92000.20
              </Text>
            </Stack>
          </Group>
          {/* Item */}
          <Group justify="space-between">
            <Group>
              <PiCurrencyDollarFill size={32} />
              <Stack gap={4}>
                <Text fz={14} fw={500}>
                  USD Coin
                </Text>
                <Text fz={12} c="dimmed">
                  USDC
                </Text>
              </Stack>
            </Group>
            <Stack gap={4} ta="right">
              <Text fz={14} fw={500}>
                500.20
              </Text>
              <Text fz={12} c="dimmed">
                USD 500.48
              </Text>
            </Stack>
          </Group>
        </Stack>
      </RwdLayout>
    </>
  )
}
