'use client'

import * as _ from 'lodash-es'
import clsx from 'clsx'
import { useWallets } from '@privy-io/react-auth'
import { AspectRatio, Paper, Stack, Group, Title, Text, Space } from '@mantine/core'
import { CopyButton, Button } from '@mantine/core'
import { modals } from '@mantine/modals'
import QRCode from 'react-qr-code'
import RwdLayout from '@/components/share/RwdLayout'
import { useAppSelector } from '@/hooks/redux'
import { useWeb3 } from '@/wallet/Web3Context'
import classes from './index.module.css'

const PaperDiv = Paper.withProps({ p: 'md', withBorder: true, bg: 'transparent' })

export default function Receive() {
  const { walletClientType } = useAppSelector(state => state.wallet)

  // zerodev
  const { smartAccountValues, loading } = useWeb3()
  const { kernelClient, smartAccountAddress = '' } = smartAccountValues

  // privy
  const { wallets } = useWallets()
  const privyWallet = wallets.find(wallet => wallet.walletClientType === 'privy')
  const privyAddress = privyWallet?.address || ''

  return (
    <>
      <RwdLayout>
        <Stack gap="xl">
          <Title order={3}>Receive</Title>

          {Boolean(kernelClient) ? (
            <WalletInfo
              title="ZeroDev wallet"
              address={smartAccountAddress}
              loading={loading}
              selected={walletClientType === 'zerodev'}
            />
          ) : null}

          <WalletInfo
            title="Privy wallet"
            address={privyAddress}
            loading={loading}
            selected={walletClientType === 'privy'}
          />
        </Stack>
      </RwdLayout>

      <Space h={100} />
    </>
  )
}

function WalletInfo({
  title,
  address,
  loading,
  selected,
}: {
  title: string
  address: string
  loading: boolean
  selected: boolean
}) {
  return (
    <>
      <PaperDiv className={clsx({ [classes.selected]: selected })}>
        <Stack>
          <Title order={4} fw={500}>
            {title}
          </Title>

          <Text
            fz="sm"
            c="dimmed"
            style={{
              wordBreak: 'break-all',
            }}
          >
            {address}
          </Text>

          <Group grow>
            <Button
              variant="outline"
              onClick={() =>
                modals.open({
                  title,
                  children: (
                    <>
                      <AspectRatio className={classes.qrcode} ratio={1}>
                        <QRCode value={address} size={200} />
                      </AspectRatio>
                    </>
                  ),
                })
              }
              loading={loading}
            >
              Show QR Code
            </Button>

            <CopyButton value={address}>
              {({ copied, copy }) => (
                <Button onClick={copy} disabled={!address} loading={loading}>
                  {copied ? 'Copied' : 'Copy Address'}
                </Button>
              )}
            </CopyButton>
          </Group>
        </Stack>
      </PaperDiv>
    </>
  )
}
