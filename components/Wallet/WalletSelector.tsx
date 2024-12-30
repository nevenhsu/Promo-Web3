'use client'

import * as _ from 'lodash-es'
import { useWallets } from '@privy-io/react-auth'
import { useAppSelector, useAppDispatch } from '@/hooks/redux'
import { useWeb3 } from '@/wallet/Web3Context'
import { setWalletClientType } from '@/store/slices/wallet'
import { ThemeIcon, Stack, Group, Text, Paper } from '@mantine/core'
import { PiCheck } from 'react-icons/pi'

const PaperAction = Paper.withProps({
  className: 'c-pointer',
  withBorder: true,
  p: 'sm',
})

export default function WalletSelector() {
  const dispatch = useAppDispatch()

  const { walletClientType } = useAppSelector(state => state.wallet)
  const { wallets } = useWallets()
  const { smartAccountValues } = useWeb3()
  const { kernel } = smartAccountValues

  const setClientType = (type: string) => {
    dispatch(setWalletClientType(type))
  }

  return (
    <Stack gap={8}>
      {kernel && (
        <PaperAction onClick={() => setClientType('zerodev')}>
          <Stack gap={4}>
            <Group gap="xs">
              <Text>ZeroDev</Text>
              {walletClientType === 'zerodev' && (
                <ThemeIcon size="xs" color="green">
                  <PiCheck />
                </ThemeIcon>
              )}
            </Group>

            <Text c="gray" fz="xs">
              {kernel.walletClient.account.address}
            </Text>
          </Stack>

          {walletClientType === 'smartAccount' && (
            <ThemeIcon color="green" size="xl">
              <PiCheck />
            </ThemeIcon>
          )}
        </PaperAction>
      )}

      {wallets.map(o => (
        <PaperAction key={o.walletClientType} onClick={() => setClientType(o.walletClientType)}>
          <Stack gap={4}>
            <Group gap="xs">
              <Text>{_.upperFirst(o.walletClientType)}</Text>
              {walletClientType === o.walletClientType && (
                <ThemeIcon size="xs" color="green">
                  <PiCheck />
                </ThemeIcon>
              )}
            </Group>

            <Text c="gray" fz="xs">
              {o.address}
            </Text>
          </Stack>
        </PaperAction>
      ))}
    </Stack>
  )
}
