'use client'

import { useDisclosure } from '@mantine/hooks'
import QRCode from 'react-qr-code'
import { Paper, Stack, Group, Title, Text, Drawer, Space } from '@mantine/core'
import { Box, Center, CopyButton, Button, NumberInput } from '@mantine/core'
import RwdLayout from '@/components/share/RwdLayout'
import { PiCaretDown, PiShareFat, PiCopy, PiCurrencyBtcFill } from 'react-icons/pi'

export default function Link() {
  const [opened, { open, close }] = useDisclosure(false)
  const link = 'https://promotion.web/wallet/send?coin=btc&amount=2&uid=f39Fd6e51aad8'

  return (
    <>
      <RwdLayout>
        <Stack>
          <Title order={5}>Receive Link</Title>

          <Paper p="sm" withBorder>
            <Group justify="space-between">
              <Group gap="sm">
                <PiCurrencyBtcFill size={32} />
                <Text fw={500}>Bitcoin</Text>
              </Group>
              <PiCaretDown size={20} />
            </Group>
          </Paper>

          <Paper p="md" withBorder>
            <Stack gap={4}>
              <NumberInput
                label="Amount"
                placeholder=""
                rightSectionWidth={48}
                rightSection={<Text fw={500}>BTC</Text>}
              />

              <Text fz={12} c="dimmed">
                USD 93232.32
              </Text>
            </Stack>
          </Paper>

          <Space h={0} />

          <Group grow>
            <Button onClick={open}>Send Link</Button>
          </Group>
        </Stack>

        <Space h={100} />
      </RwdLayout>

      <Drawer
        opened={opened}
        onClose={close}
        position="bottom"
        size="lg"
        radius="md"
        overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
      >
        <Stack align="center" px="xs">
          <Title order={5}>Send Link</Title>

          <Box w={300} ta="center" mb="xl">
            <Text fz={14} c="dimmed">
              Your request link is already to send!
            </Text>
            <Text fz={14} c="dimmed">
              Send this link to a friend, and it will ask them to send 2.22 BTC
            </Text>
          </Box>

          <Center>
            <QRCode size={200} value={link} />
          </Center>

          <Box ta="center" c="blue" mb="xl">
            <Text fz={12}>{link}</Text>
          </Box>

          <Group w="100%" grow>
            <CopyButton value={link}>
              {({ copied, copy }) => (
                <Button
                  leftSection={<PiCopy size={20} />}
                  color={copied ? 'teal' : 'blue'}
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
        </Stack>
      </Drawer>
    </>
  )
}
