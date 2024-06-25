'use client'

import { Link } from '@/navigation'
import { Center, AspectRatio, Stack, Group, Title, Text, Space } from '@mantine/core'
import { CopyButton, Button } from '@mantine/core'
import QRCode from 'react-qr-code'
import RwdLayout from '@/components/share/RwdLayout'
import { PiCopy, PiShareFat, PiLink } from 'react-icons/pi'
import { useWallet } from '@/wallet/hooks/useWallet'
import { getNetworkName } from '@/wallet/utils/network'
import classes from './index.module.css'

export default function Receive() {
  const wallet = useWallet()
  const address = wallet?.address || ''

  return (
    <>
      <RwdLayout>
        <Stack gap="lg">
          <Title order={5}>Receive Tokens</Title>

          <Center>
            <AspectRatio className={classes.qrcode} ratio={1}>
              <QRCode value={address} size={200} />
            </AspectRatio>
          </Center>

          <div>
            <Text fz="sm">Address</Text>
            <Text fz="sm">{address}</Text>
          </div>

          <div>
            <Text fz="sm">Network</Text>
            <Text fz="sm">{getNetworkName(wallet?.chainId)}</Text>
          </div>

          <div />

          <Group grow>
            <CopyButton value={address}>
              {({ copied, copy }) => (
                <Button
                  leftSection={<PiCopy size={20} />}
                  color={copied ? 'green' : 'blue'}
                  variant="outline"
                  onClick={copy}
                  disabled={!address}
                >
                  {copied ? 'Copied' : 'Copy'}
                </Button>
              )}
            </CopyButton>
            <Button leftSection={<PiShareFat size={20} />} variant="outline">
              Share
            </Button>
          </Group>

          <Link href="/wallet/receive/link">
            <Button w="100%" leftSection={<PiLink size={20} />}>
              Create Link
            </Button>
          </Link>
        </Stack>

        <Space h={100} />
      </RwdLayout>
    </>
  )
}
