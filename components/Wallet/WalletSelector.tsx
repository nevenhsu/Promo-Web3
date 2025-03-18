'use client'

import * as _ from 'lodash-es'
import { useWallets } from '@privy-io/react-auth'
import { useAppSelector } from '@/hooks/redux'
import { useWeb3 } from '@/wallet/Web3Context'
import { useSelectWallet } from '@/wallet/hooks/useSelectWallet'
import { ThemeIcon, Stack, Group, Text, Paper } from '@mantine/core'
import { PiLightningFill } from 'react-icons/pi'

const PaperAction = Paper.withProps({ className: 'c-pointer', withBorder: true, p: 'sm' })

export default function WalletSelector() {
  const { walletClientType } = useAppSelector(state => state.wallet)
  const { wallets } = useWallets()
  const { smartAccountValues } = useWeb3()
  const { kernelClient, smartAccountAddress } = smartAccountValues

  const { setClientType } = useSelectWallet()

  return (
    <Stack gap={8}>
      {kernelClient && (
        <PaperAction onClick={() => setClientType('zerodev')}>
          <Stack gap={4}>
            <Group gap="xs">
              <Text>ZeroDev</Text>
              {walletClientType === 'zerodev' && (
                <ThemeIcon size="xs" variant="white">
                  <PiLightningFill />
                </ThemeIcon>
              )}
            </Group>

            <Text c="gray" fz="xs">
              {smartAccountAddress}
            </Text>
          </Stack>
        </PaperAction>
      )}

      {wallets.map(o => (
        <PaperAction key={o.walletClientType} onClick={() => setClientType(o.walletClientType)}>
          <Stack gap={4}>
            <Group gap="xs">
              <Text>{_.upperFirst(o.walletClientType)}</Text>
              {walletClientType === o.walletClientType && (
                <ThemeIcon size="xs" variant="white">
                  <PiLightningFill />
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
