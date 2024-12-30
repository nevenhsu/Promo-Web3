'use client'

import * as _ from 'lodash-es'
import { AspectRatio, Paper, Stack, Group, Title, Text, Space } from '@mantine/core'
import { CopyButton, Button, Pill } from '@mantine/core'
import { modals } from '@mantine/modals'
import QRCode from 'react-qr-code'
import RwdLayout from '@/components/share/RwdLayout'
import { useAppSelector } from '@/hooks/redux'
import { useWeb3 } from '@/wallet/Web3Context'
import classes from './index.module.css'

export default function Receive() {
  const { walletClientType } = useAppSelector(state => state.wallet)
  const { walletAddress = '' } = useWeb3()

  return (
    <>
      <RwdLayout>
        <Stack gap="xl">
          <Title order={3}>Receive</Title>

          <Paper p="md" shadow="xs" radius="sm">
            <Stack>
              <Group justify="space-between">
                <Text fz="lg" fw={500} lh={1}>
                  My wallet
                </Text>
                <Pill>{_.upperFirst(walletClientType)}</Pill>
              </Group>

              <Text
                fz="sm"
                w={240}
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
                      title: 'QR Code',
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
