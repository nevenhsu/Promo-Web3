'use client'

import * as _ from 'lodash-es'
import Decimal from 'decimal.js'
import Image from 'next/image'
import PullToRefresh from 'react-simple-pull-to-refresh'
import { Link } from '@/navigation'
import { usePrivy } from '@privy-io/react-auth'
import { useAppSelector } from '@/hooks/redux'
import { useWeb3 } from '@/wallet/Web3Context'
import { Box, Space, Group, Stack, Text, Title } from '@mantine/core'
import NetworkButton from '@/components/Wallet/NetworkButton'
import RwdLayout from '@/components/share/RwdLayout'
import CreateWallet from './CreateWallet'
import { PiArrowCircleUp, PiArrowCircleDown, PiClock, PiCreditCard } from 'react-icons/pi'
import { tokens } from '@/contracts/tokens'
import classes from './index.module.css'

export default function Wallet() {
  const { _id, fetched, data } = useAppSelector(state => state.user)
  const { username, name, details } = data

  const { chainId, balances, prices, updateBalances } = useWeb3()

  const { user } = usePrivy()

  if (!user?.wallet?.address) {
    return <CreateWallet />
  }

  return (
    <>
      <RwdLayout c="white" bg="var(--mantine-primary-color-6)">
        <Group justify="space-between">
          <Text fz="sm" opacity={0.8}>
            Balance
          </Text>
          <Box h={12}>
            <NetworkButton />
          </Box>
        </Group>
        <Title order={2}>USD 13220.42</Title>
        <Space h={40} />

        <Group className={classes.actions} grow>
          <Link href="/wallet/send">
            <Box w={40} h={40}>
              <PiArrowCircleUp size={24} />
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

      <PullToRefresh onRefresh={updateBalances}>
        <RwdLayout mih="calc(100vh - 300px)">
          <Stack>
            {/* Item */}
            {Boolean(chainId) &&
              tokens
                .filter(o => o.chainId === chainId)
                .map(o => {
                  // TODO: convert uint
                  const balance = balances[o.symbol]
                  const price = prices[o.symbol]
                  const bal = Decimal.div(balance?.toString() || 0, 10 ** o.decimal)
                  const p = price ? Decimal.mul(bal, price) : undefined

                  return (
                    <Group key={o.symbol} justify="space-between">
                      <Group>
                        <Image
                          className={classes.icon}
                          src={o.icon}
                          width={32}
                          height={32}
                          alt=""
                        />

                        <Stack gap={4}>
                          <Text fz="sm" fw={500}>
                            {o.name}
                          </Text>
                          <Text fz="xs" c="dimmed">
                            {o.symbol}
                          </Text>
                        </Stack>
                      </Group>
                      <Stack gap={4} ta="right">
                        <Text fz="sm" fw={500}>
                          {bal.toDP(4).toString()}
                        </Text>
                        <Text fz="xs" c="dimmed">
                          {p ? `USD ${p.toDP(2).toString()}` : 'No price yet'}
                        </Text>
                      </Stack>
                    </Group>
                  )
                })}
          </Stack>

          <Space h={100} />
        </RwdLayout>
      </PullToRefresh>
    </>
  )
}
