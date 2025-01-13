'use client'

import * as _ from 'lodash-es'
import { useWallets } from '@privy-io/react-auth'
import { modals } from '@mantine/modals'
import { Title, Text, Stack, Space, Group, Divider } from '@mantine/core'
import { Button, ThemeIcon, Box, Paper } from '@mantine/core'
import RwdLayout from '@/components/share/RwdLayout'
import TokenPaper from './Info/TokenPaper'
import MintFlow from './Info/MintFlow'
import ManageFlow from './Info/ManageFlow'
import { useWeb3 } from '@/wallet/Web3Context'
import { useSelectWallet } from '@/wallet/hooks/useSelectWallet'
import { isAddressEqual } from '@/wallet/utils/helper'
import { useUserToken } from '@/store/contexts/app/userToken'
import { PiRocketLaunch, PiHandHeart } from 'react-icons/pi'
import type { TUserToken } from '@/models/userToken'

const PaperDiv = Paper.withProps({
  p: 'md',
  withBorder: true,
  bg: 'transparent',
})

export default function Token() {
  const { setClientType } = useSelectWallet()
  const { tokens, fetchState } = useUserToken()

  // zerodev
  const { smartAccountValues, loading } = useWeb3()
  const { kernel, smartAccountAddress = '' } = smartAccountValues

  // privy
  const { wallets } = useWallets()
  const privyWallet = wallets.find(wallet => wallet.walletClientType === 'privy')
  const privyAddress = privyWallet?.address || ''

  // minted token
  const privyToken = _.find(tokens, o => isAddressEqual(o._wallet.address, privyAddress))
  const zerodevToken = _.find(tokens, o => isAddressEqual(o._wallet.address, smartAccountAddress))

  const openMintFlow = (type: string) => {
    setClientType(type as any)

    modals.open({
      title: 'Creator token',
      withCloseButton: false,
      closeOnClickOutside: false,
      children: (
        <>
          <MintFlow />
        </>
      ),
    })
  }

  const openManageFlow = (docId: string) => {
    modals.open({
      title: 'Manage token',
      children: (
        <>
          <ManageFlow docId={docId} />
        </>
      ),
    })
  }

  return (
    <>
      <RwdLayout>
        <Stack gap="xl">
          <Title order={3}>Creator token</Title>

          {/* Contents */}
          <Stack gap={24}>
            <Group wrap="nowrap" align="start">
              <ThemeIcon size="xl" radius="md" variant="light">
                <PiRocketLaunch size={24} />
              </ThemeIcon>
              <Box>
                <Title order={4} fw={500}>
                  Reward community
                </Title>
                <Text size="sm" c="dimmed">
                  Airdrop tokens to participants joining your activities
                </Text>
              </Box>
            </Group>

            <Group wrap="nowrap" align="start">
              <ThemeIcon size="xl" radius="md" variant="light">
                <PiHandHeart size={24} />
              </ThemeIcon>
              <Box>
                <Title order={4} fw={500}>
                  Create engaging fan interactions
                </Title>
                <Text size="sm" c="dimmed">
                  Reward your fans with unique tokens for their support
                </Text>
              </Box>
            </Group>

            <Divider />

            {kernel ? (
              <PaperDiv>
                <Stack>
                  <Group justify="space-between">
                    <Title order={4} fw={500}>
                      ZeroDev wallet
                    </Title>

                    {!zerodevToken && (
                      <Button
                        onClick={() => {
                          openMintFlow('zerodev')
                        }}
                        size="sm"
                        loading={fetchState.loading || loading}
                      >
                        Mint token
                      </Button>
                    )}
                  </Group>

                  {zerodevToken && (
                    <TokenPaper
                      name={zerodevToken.name}
                      symbol={zerodevToken.symbol}
                      icon={zerodevToken.icon}
                      leftSection={
                        <Button
                          onClick={() => {
                            openManageFlow(zerodevToken._id)
                          }}
                          size="sm"
                          loading={fetchState.loading}
                        >
                          Manage
                        </Button>
                      }
                    />
                  )}
                </Stack>
              </PaperDiv>
            ) : null}

            <PaperDiv>
              <Stack>
                <Group justify="space-between">
                  <Title order={4} fw={500}>
                    Privy wallet
                  </Title>

                  {!privyToken && (
                    <Button
                      onClick={() => {
                        openMintFlow('privy')
                      }}
                      size="sm"
                      loading={fetchState.loading || loading}
                    >
                      Mint token
                    </Button>
                  )}
                </Group>

                {privyToken && (
                  <TokenPaper
                    name={privyToken.name}
                    symbol={privyToken.symbol}
                    icon={privyToken.icon}
                    leftSection={
                      <Button
                        onClick={() => {
                          openManageFlow(privyToken._id)
                        }}
                        size="sm"
                        loading={fetchState.loading}
                      >
                        Manage
                      </Button>
                    }
                  />
                )}
              </Stack>
            </PaperDiv>
          </Stack>
        </Stack>
      </RwdLayout>

      <Space h={100} />
    </>
  )
}
