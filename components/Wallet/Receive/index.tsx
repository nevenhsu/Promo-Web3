'use client'

import { Link } from '@/navigation'
import { Center, AspectRatio, Stack, Group, Title, Text, Space } from '@mantine/core'
import { CopyButton, Button } from '@mantine/core'
import QRCode from 'react-qr-code'
import RwdLayout from '@/components/share/RwdLayout'
import { PiCopy, PiShareFat, PiLink } from 'react-icons/pi'
import { useWeb3 } from '@/wallet/Web3Context'
import { getNetwork } from '@/wallet/utils/network'
import classes from './index.module.css'

export default function Receive() {
  const { walletAddress, chainId, isSmartAccount } = useWeb3()

  const network = getNetwork(chainId)

  return (
    <>
      <RwdLayout>
        <Stack gap="lg">
          <Title order={5}>Receive Tokens</Title>

          <Center>
            <AspectRatio className={classes.qrcode} ratio={1}>
              <QRCode value={walletAddress} size={200} />
            </AspectRatio>
          </Center>

          <div>
            <Text fz="sm">{isSmartAccount ? 'Smart Wallet' : 'Wallet'}</Text>
            <Text fz="sm">{walletAddress}</Text>
          </div>

          <div>
            <Text fz="sm">Network</Text>
            <Text fz="sm">{network.name}</Text>
          </div>

          <div />

          <Group grow>
            <CopyButton value={walletAddress}>
              {({ copied, copy }) => (
                <Button
                  leftSection={<PiCopy size={20} />}
                  color={copied ? 'green' : 'blue'}
                  variant="outline"
                  onClick={copy}
                  disabled={!walletAddress}
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
      </RwdLayout>

      <Space h={100} />
    </>
  )
}
