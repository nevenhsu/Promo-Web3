'use client'

import { Link } from '@/navigation'
import { usePrivy } from '@privy-io/react-auth'
import { useAppSelector } from '@/hooks/redux'
import { Box, Space, Group, Stack, Text, Title, Tabs } from '@mantine/core'
import RwdLayout from '@/components/share/RwdLayout'
import CreateWallet from './CreateWallet'
import BaseIcon from '@/public/images/icons/base.svg'
import { PiArrowsLeftRight, PiArrowCircleDown, PiClock, PiCreditCard } from 'react-icons/pi'
import { PiCurrencyBtcFill, PiCurrencyDollarFill } from 'react-icons/pi'
import classes from './index.module.css'

export default function Wallet() {
  const { _id, fetched, data } = useAppSelector(state => state.user)
  const { username, name, details } = data

  const { user } = usePrivy()

  if (!user?.wallet?.address) {
    return <CreateWallet />
  }

  return (
    <>
      <RwdLayout c="white" bg="var(--mantine-primary-color-6)">
        <Group justify="space-between">
          <Text fz={14} opacity={0.8}>
            Balance
          </Text>
          <Box h={12}>
            <BaseIcon className={classes.chainIcon} />
          </Box>
        </Group>
        <Title order={2}>USD 13220.42</Title>
        <Space h={40} />

        <Group className={classes.actions} grow>
          <Link href="/wallet/send">
            <Box w={40} h={40}>
              <PiArrowsLeftRight size={24} />
            </Box>
            <Text>Send</Text>
          </Link>
          <Link href="/wallet/receive">
            <Box w={40} h={40}>
              <PiArrowCircleDown size={24} />
            </Box>
            <Text>Receive</Text>
          </Link>
          <Link href="/wallet/history">
            <Box w={40} h={40}>
              <PiClock size={24} />
            </Box>
            <Text>History</Text>
          </Link>
          <Link href="/wallet/buy">
            <Box w={40} h={40}>
              <PiCreditCard size={24} />
            </Box>
            <Text>Buy</Text>
          </Link>
        </Group>
      </RwdLayout>

      <RwdLayout>
        <Box w="100%">
          <Tabs className={classes.tabs} variant="pills" defaultValue="asset" radius="xl">
            <Tabs.Tab value="asset">Asset</Tabs.Tab>
            <Tabs.Tab value="activity">Airdrop</Tabs.Tab>
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
