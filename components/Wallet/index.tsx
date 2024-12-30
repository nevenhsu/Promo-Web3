'use client'

import * as _ from 'lodash-es'
import Decimal from 'decimal.js'
import { useMemo } from 'react'
import { useAppSelector } from '@/hooks/redux'
import { useWeb3 } from '@/wallet/Web3Context'
import { useDisclosure } from '@mantine/hooks'
import { Link } from '@/i18n/routing'
import { Space, Group, Stack, Modal, Paper, Button, Text, Title, ThemeIcon } from '@mantine/core'
import RwdLayout from '@/components/share/RwdLayout'
import Token from './Token'
import WalletSelector from './WalletSelector'
import { eth } from '@/contracts/tokens'
import { PiArrowUpBold, PiArrowDownBold, PiClockBold, PiGiftBold, PiGearFill } from 'react-icons/pi'
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
  const [opened, { open, close }] = useDisclosure(false)

  const { walletClientType } = useAppSelector(state => state.wallet)
  const { chainId, tokens, balancesValues, pricesValues, loading } = useWeb3()
  const { balances, updateBalances, loading: balLoading } = balancesValues
  const { prices } = pricesValues

  const totalBalance = useMemo(() => {
    const ethValue = calcTokenValue(eth.decimal, prices[eth.symbol], balances[eth.symbol])
    return _.reduce(
      tokens,
      (acc, o) => {
        const val = calcTokenValue(o.decimal, prices[o.symbol], balances[o.symbol])
        return acc.add(val)
      },
      ethValue
    )
  }, [balances, prices, tokens])

  return (
    <>
      <RwdLayout>
        <Paper p="sm" c="white" shadow="xs" bg="var(--mantine-primary-color-5)">
          <Group justify="space-between" wrap="nowrap" align="start">
            <Stack gap={4}>
              <Text fz="xs">Balance</Text>
              <Title order={4} lh={1} className="nowrap">
                USD {totalBalance.toFixed(2)}
              </Title>
            </Stack>
            <Stack ta="right">
              <Button
                variant="light"
                size="xs"
                color="white"
                loading={loading}
                onClick={open}
                rightSection={<PiGearFill size={14} />}
              >
                {_.upperFirst(walletClientType)}
              </Button>
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
            <Link href="/wallet/airdrop">
              <ThemeAction>
                <PiGiftBold size={24} />
              </ThemeAction>
              <Text fz="sm">Airdrop</Text>
            </Link>
          </Group>
        </Paper>

        <Space h={40} />

        <Group justify="space-between">
          <Text fz="md" fw={500}>
            Assets
          </Text>
          <Button
            size="xs"
            variant="outline"
            loading={balLoading}
            disabled={!chainId}
            onClick={() => updateBalances()}
          >
            Refresh
          </Button>
        </Group>

        <Space h={24} />

        <Stack gap="xs">
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

      <Modal title="Select wallet" size="sm" padding="sm" opened={opened} onClose={close} centered>
        <WalletSelector />
      </Modal>
    </>
  )
}

function calcTokenValue(decimal: number, price: Decimal | undefined, balance: bigint | undefined) {
  const bal = Decimal.div(balance?.toString() || 0, 10 ** decimal)
  const val = price ? price.mul(bal) : new Decimal(0)
  return val
}
