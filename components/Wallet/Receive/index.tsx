'use client'

import Image from 'next/image'
import { AspectRatio, Paper, Stack, Group, Box, Title, Text, Space } from '@mantine/core'
import { CopyButton, Button, Pill } from '@mantine/core'
import { modals } from '@mantine/modals'
import QRCode from 'react-qr-code'
import RwdLayout from '@/components/share/RwdLayout'
import { useWeb3 } from '@/wallet/Web3Context'
import { getNetwork } from '@/wallet/utils/network'
import classes from './index.module.css'

export default function Receive() {
  const { chainId, walletProviderValues } = useWeb3()
  const { isSmartAccount, walletAddress = '' } = walletProviderValues || {}

  const network = getNetwork(chainId)

  return (
    <>
      <RwdLayout>
        <Stack gap="xl">
          <Title order={3}>Receive</Title>

          <Stack>
            {/* Network */}
            <Paper p="md" shadow="xs" radius="sm">
              <Group>
                <Image src={network.icon} width={40} height={40} alt={network.name} />
                <Stack gap={4}>
                  <Text fz="lg" fw={500} lh={1}>
                    {network.name}
                  </Text>
                  <Text fz="xs" c="dimmed" lh={1}>
                    {network.subtitle}
                  </Text>
                </Stack>
              </Group>
            </Paper>
          </Stack>

          <Paper p="md" shadow="xs" radius="sm">
            <Stack>
              <Group justify="space-between">
                <Text fz="lg" fw={500} lh={1}>
                  My wallet
                </Text>
                <Pill>{isSmartAccount ? 'Smart wallet' : 'Embedded wallet'}</Pill>
              </Group>

              <Text
                fz="sm"
                w={200}
                style={{
                  wordWrap: 'break-word',
                }}
                mb="lg"
              >
                {walletAddress}
              </Text>

              <Group grow>
                <Button
                  variant="outline"
                  onClick={() =>
                    modals.open({
                      title: isSmartAccount ? 'Smart wallet' : 'Embedded wallet',
                      children: (
                        <>
                          <AspectRatio className={classes.qrcode} ratio={1}>
                            <QRCode value={walletAddress} size={200} />
                          </AspectRatio>
                        </>
                      ),
                    })
                  }
                >
                  Show QR Code
                </Button>

                <CopyButton value={walletAddress}>
                  {({ copied, copy }) => (
                    <Button onClick={copy} disabled={!walletAddress}>
                      {copied ? 'Copied' : 'Copy Address'}
                    </Button>
                  )}
                </CopyButton>
              </Group>
            </Stack>
          </Paper>
        </Stack>
      </RwdLayout>

      <Space h={100} />
    </>
  )
}
