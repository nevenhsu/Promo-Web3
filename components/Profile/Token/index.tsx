'use client'

import * as _ from 'lodash-es'
import { useState } from 'react'
import { useWallets } from '@privy-io/react-auth'
import { useDisclosure } from '@mantine/hooks'
import { Title, Text, Stack, Space, Group, Divider } from '@mantine/core'
import { Modal, Button, ThemeIcon, Box, Paper } from '@mantine/core'
import RwdLayout from '@/components/share/RwdLayout'
import TokenPaper from './Info/TokenPaper'
import MintFlow from './Info/MintFlow'
import ManageFlow from './Info/ManageFlow'
import { useWeb3 } from '@/wallet/Web3Context'
import { useSelectWallet } from '@/wallet/hooks/useSelectWallet'
import { isAddressEqual } from '@/wallet/utils/helper'
import { useUserToken } from '@/store/contexts/app/userTokenContext'
import { PiRocketLaunch, PiHandHeart } from 'react-icons/pi'

const PaperDiv = Paper.withProps({
  p: 'md',
  withBorder: true,
  bg: 'transparent',
})

export default function Token() {
  const { setClientType } = useSelectWallet()
  const { fetchState } = useUserToken()
  const [selectedDocId, setSelectedDocId] = useState('') // For Manage Modal
  const [opened, { open, close }] = useDisclosure(false) // For Mint Modal

  // zerodev
  const { smartAccountValues, chainId, loading } = useWeb3()
  const { kernelClient, smartAccountAddress = '' } = smartAccountValues

  // privy
  const { wallets } = useWallets()
  const privyWallet = wallets.find(wallet => wallet.walletClientType === 'privy')
  const privyAddress = privyWallet?.address || ''

  // minted token
  const privyToken = _.find(
    fetchState.value,
    o => o.chainId === chainId && isAddressEqual(o._wallet.address, privyAddress)
  )
  const zerodevToken = _.find(
    fetchState.value,
    o => o.chainId === chainId && isAddressEqual(o._wallet.address, smartAccountAddress)
  )

  const openMintFlow = (type: string) => {
    setClientType(type as any)
    open() // Open Mint Modal
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

            {kernelClient ? (
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
                            setSelectedDocId(zerodevToken._id)
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
                          setSelectedDocId(privyToken._id)
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

            <Text fz="xs" c="dimmed">
              You can mint multiple creator tokens with different wallets. But one wallet can only
              mint one creator token.
            </Text>
          </Stack>
        </Stack>
      </RwdLayout>

      <Space h={100} />

      <>
        <Modal
          opened={Boolean(selectedDocId)}
          onClose={() => setSelectedDocId('')}
          title="Manage token"
          centered
        >
          <ManageFlow docId={selectedDocId} onClose={() => setSelectedDocId('')} />
        </Modal>
      </>

      <>
        <Modal
          opened={opened}
          onClose={close}
          title="Creator token"
          withCloseButton={false}
          closeOnClickOutside={false}
          centered
        >
          <MintFlow onClose={close} />
        </Modal>
      </>
    </>
  )
}
