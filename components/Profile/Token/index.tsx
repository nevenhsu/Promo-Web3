'use client'

import * as _ from 'lodash-es'
import { useDisclosure } from '@mantine/hooks'
import { Title, Stack, Space, Modal, Group, Divider } from '@mantine/core'
import { Text, Button, ThemeIcon, Box } from '@mantine/core'
import RwdLayout from '@/components/share/RwdLayout'
import TokenInfo from './Info'
import { useWeb3 } from '@/wallet/Web3Context'
import { isAddressEqual } from '@/wallet/utils/helper'
import { useUserToken } from '@/store/contexts/app/userToken'
import { PiRocketLaunch, PiHandHeart } from 'react-icons/pi'

export default function Token() {
  const [opened, { open, close }] = useDisclosure(false)

  const { chainId, smartAccountValues } = useWeb3()
  const { smartAccountAddress = '' } = smartAccountValues

  const { fetchState } = useUserToken()
  const { tokens = [] } = fetchState.value || {}

  const token = _.find(
    tokens,
    o => o.chainId === chainId && isAddressEqual(o._wallet.address, smartAccountAddress)
  )
  const minted = !!token

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

            <span />

            <Box ta="center">
              <Button onClick={open} size="md" loading={fetchState.loading}>
                {minted ? 'Manage token' : 'Mint token'}
              </Button>
            </Box>

            <Divider />
          </Stack>
        </Stack>
      </RwdLayout>

      <Modal opened={opened} onClose={close} title="Creator token" centered>
        <TokenInfo token={token} />
      </Modal>

      <Space h={100} />
    </>
  )
}
