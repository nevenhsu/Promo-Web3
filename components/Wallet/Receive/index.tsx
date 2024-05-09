'use client'

import { Link } from '@/navigation'
import { Center, AspectRatio, Stack, Group, Title, Text, Space } from '@mantine/core'
import { CopyButton, Button } from '@mantine/core'
import QRCode from 'react-qr-code'
import RwdLayout from '@/components/share/RwdLayout'
import { PiCopy, PiShareFat, PiLink } from 'react-icons/pi'
import classes from './index.module.css'

export default function Receive() {
  const address = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
  return (
    <>
      <RwdLayout>
        <Stack>
          <Title order={5}>Receive Tokens</Title>

          <Center>
            <AspectRatio className={classes.qrcode} ratio={1}>
              <QRCode value={address} size={200} />
            </AspectRatio>
          </Center>

          <Text ta="center" fz={12} mb="lg">
            {address}
          </Text>

          <Group grow>
            <CopyButton value={address}>
              {({ copied, copy }) => (
                <Button
                  leftSection={<PiCopy size={20} />}
                  color={copied ? 'green' : 'blue'}
                  variant="outline"
                  onClick={copy}
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
