'use client'

import * as _ from 'lodash-es'
import Decimal from 'decimal.js'
import Image from 'next/image'
import { useMemo } from 'react'
import { Link } from '@/navigation'
import { usePrivy } from '@privy-io/react-auth'
import { useAppSelector } from '@/hooks/redux'
import { useWeb3 } from '@/wallet/Web3Context'
import { Space, Group, Stack, Paper, Button, Text, Title, ThemeIcon } from '@mantine/core'
import NetworkButton from '@/components/Wallet/NetworkButton'
import RwdLayout from '@/components/share/RwdLayout'
import CreateWallet from './CreateWallet'
import { formatAddress } from '@/wallet/utils/helper'
import { PiArrowUpBold, PiArrowDownBold, PiClockBold, PiCreditCardBold } from 'react-icons/pi'
import classes from './index.module.css'

const ThemeAction = ThemeIcon.withProps({
  variant: 'light',
  color: 'white',
  size: 'xl',
  radius: 'sm',
  mb: 'xs',
  bg: 'rgba(255,255,255,0.1)',
})

export default function Wallet() {
  const { user } = usePrivy()
  const { data } = useAppSelector(state => state.user)
  const { name } = data

  const { chainId, tokens, walletProviderValues, balancesValues, pricesValues } = useWeb3()
  const { isSmartAccount, walletAddress } = walletProviderValues || {}
  const { balances, updateBalances, loading } = balancesValues
  const { prices } = pricesValues

  const totalBalance = useMemo(() => {
    return _.reduce(
      tokens,
      (acc, o) => {
        const price = prices[o.symbol]
        const balance = balances[o.symbol]
        const bal = Decimal.div(balance?.toString() || 0, 10 ** o.decimal)
        const val = price ? price.mul(bal) : new Decimal(0)
        return acc.add(val)
      },
      new Decimal(0)
    )
  }, [balances, prices, tokens])

  // TODO: only for smart account
  if (!user?.wallet?.address) {
    return <CreateWallet />
  }

  return (
    <>
      <RwdLayout>
        <Title order={3}>{name ? `Hi, ${name}` : 'Hello!'}</Title>

        <Space h={40} />

        <Paper p="sm" c="white" shadow="xs" bg="var(--mantine-primary-color-5)">
          <Group justify="space-between" wrap="nowrap">
            <Stack gap={4}>
              <Text fz="xs">Balance</Text>
              <Title order={4} lh={1} className="nowrap">
                USD {totalBalance.toDP(2).toString()}
              </Title>
            </Stack>
            <Stack gap={4} ta="right">
              <Text fz="xs">{isSmartAccount ? 'Smart wallet' : 'Embedded wallet'}</Text>
              <Text fz="xs" className="word-break-all" lh={1.2}>
                {formatAddress(walletAddress)}
              </Text>
            </Stack>
          </Group>

          <Space h={40} />

          <Group className={classes.actions} grow>
            <Link href="/wallet/send">
              <ThemeAction>
                <PiArrowUpBold size={24} />
              </ThemeAction>
              <Text fz="sm">Send</Text>
            </Link>
            <Link href="/wallet/receive">
              <ThemeAction>
                <PiArrowDownBold size={24} />
              </ThemeAction>
              <Text fz="sm">Receive</Text>
            </Link>
            <Link href="/wallet/history">
              <ThemeAction>
                <PiClockBold size={24} />
              </ThemeAction>
              <Text fz="sm">History</Text>
            </Link>
            <Link href="/wallet/buy">
              <ThemeAction>
                <PiCreditCardBold size={24} />
              </ThemeAction>
              <Text fz="sm">Buy</Text>
            </Link>
          </Group>
        </Paper>

        <Space h={40} />

        <Group justify="space-between">
          <NetworkButton />
          <Button
            size="xs"
            variant="light"
            loading={loading}
            disabled={!walletAddress}
            onClick={() => updateBalances()}
          >
            Refresh
          </Button>
        </Group>

        <Space h={24} />

        <Stack>
          {/* Item */}
          {Boolean(chainId) &&
            tokens.map(o => {
              const balance = balances[o.symbol]
              const price = prices[o.symbol]
              const bal = Decimal.div(balance?.toString() || 0, 10 ** o.decimal)
              const p = price ? price.mul(bal) : undefined

              return (
                <Paper key={o.symbol} radius="md" p="md" shadow="xs">
                  <Group justify="space-between">
                    <Group>
                      <Image className={classes.icon} src={o.icon} width={32} height={32} alt="" />

                      <Stack gap={4}>
                        <Text fw={500} lh={1}>
                          {o.name}
                        </Text>
                        <Text fz="xs" c="dimmed" lh={1}>
                          {o.symbol}
                        </Text>
                      </Stack>
                    </Group>
                    <Stack gap={4} ta="right">
                      <Text fw={500} lh={1}>
                        {bal.toDP(4).toString()}
                      </Text>
                      <Text fz="xs" c="dimmed" lh={1}>
                        {p ? `USD ${p.toDP(2).toString()}` : 'No price yet'}
                      </Text>
                    </Stack>
                  </Group>
                </Paper>
              )
            })}
        </Stack>
      </RwdLayout>

      <Space h={100} />
    </>
  )
}
