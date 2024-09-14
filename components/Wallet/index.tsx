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
import Token from './Token'
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

  const { chainId, tokens, walletAddress, onSmartAccount, balancesValues, pricesValues, loading } =
    useWeb3()
  const { balances, updateBalances, loading: balLoading } = balancesValues
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
          <Group justify="space-between" wrap="nowrap" align="start">
            <Stack gap={4}>
              <Text fz="xs">Balance</Text>
              <Title order={4} lh={1} className="nowrap">
                USD {totalBalance.toFixed(2)}
              </Title>
            </Stack>
            <Stack gap={4} ta="right">
              <Text fz="xs">
                {loading ? 'Connecting' : onSmartAccount ? 'Smart wallet' : 'Embedded wallet'}
              </Text>
              <Text fz="xs" className="word-break-all" lh={1.2}>
                {loading ? ' ' : formatAddress(walletAddress)}
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
            variant="outline"
            loading={balLoading}
            disabled={!walletAddress}
            onClick={() => updateBalances()}
          >
            Refresh
          </Button>
        </Group>

        <Space h={24} />

        <Stack>
          <Token
            symbol="ETH"
            icon="/icons/eth.svg"
            name="Ethereum"
            decimal={18}
            balance={balances.ETH}
            price={prices['ETH']}
          />
          {/* ERC20 */}
          {Boolean(chainId) &&
            tokens.map(o => {
              return (
                <Token
                  key={o.symbol}
                  symbol={o.symbol}
                  icon={o.icon}
                  name={o.name}
                  decimal={o.decimal}
                  balance={balances[o.symbol]}
                  price={prices[o.symbol]}
                />
              )
            })}
        </Stack>
      </RwdLayout>

      <Space h={100} />
    </>
  )
}
