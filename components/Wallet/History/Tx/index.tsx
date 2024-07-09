'use client'
import { Paper, Stack, Group, Space, Box, Divider } from '@mantine/core'
import { Title, Text, CopyButton, ActionIcon } from '@mantine/core'
import RwdLayout from '@/components/share/RwdLayout'
import { PiCopy, PiLink } from 'react-icons/pi'

export default function HistoryTx({ tx }: { tx: string }) {
  console.log({ tx })
  return (
    <>
      <RwdLayout>
        <Title order={3}>History</Title>

        <Space h={40} />

        <Paper radius="md" p="md" shadow="xs">
          <Stack>
            <Group justify="space-between">
              <Text fz="sm" c="dark.4">
                Status
              </Text>
              <Text fz="sm" fw={500} c="green">
                Completed
              </Text>
            </Group>

            <Group justify="space-between" align="start">
              <Text fz="sm" c="dark.4">
                Network
              </Text>
              <Text fz="sm">Base</Text>
            </Group>

            <Group justify="space-between" align="start">
              <Text fz="sm" c="dark.4">
                Tx Hash
              </Text>
              <Box w={200}>
                <TxLink val="0xebb806f1836755ff44b6e22ca02df26b16eb743d0fccc9fd4467e76997bf7476" />
              </Box>
            </Group>

            <Group justify="space-between" align="start">
              <Text fz="sm" c="dark.4">
                From
              </Text>
              <Box w={200}>
                <CopyText val="0xFFF52Ae25609dDb9c3E0Ea75B8f57D25DeDA2FEd" />
              </Box>
            </Group>

            <Group justify="space-between" align="start">
              <Text fz="sm" c="dark.4">
                To
              </Text>
              <Box w={200}>
                <CopyText val="0xeBd4436A257D2a2Fc5a2e5F1cd9E39054087588E" />
              </Box>
            </Group>

            <Divider />

            <Group justify="space-between" align="start">
              <Text fz="sm" c="dark.4">
                Token
              </Text>
              <Text fz="sm">USDC</Text>
            </Group>

            <Group justify="space-between" align="start">
              <Text fz="sm" c="dark.4">
                Amount
              </Text>
              <Text fz="sm">300.34</Text>
            </Group>

            <Group justify="space-between" align="start">
              <Text fz="sm" c="dark.4">
                Date
              </Text>
              <Text fz="sm">5 Jun 2024 19:41</Text>
            </Group>
          </Stack>
        </Paper>
      </RwdLayout>
      <Space h={100} />
    </>
  )
}

function CopyText({ val }: { val: string }) {
  return (
    <>
      <CopyButton value={val}>
        {({ copied, copy }) => (
          <Group wrap="nowrap" align="start" gap="xs">
            <Text fz="xs" c={copied ? 'green' : 'black'} style={{ wordBreak: 'break-word' }}>
              {val}
            </Text>
            <ActionIcon onClick={copy} color={copied ? 'green' : 'black'}>
              <PiCopy size={16} />
            </ActionIcon>
          </Group>
        )}
      </CopyButton>
    </>
  )
}

function TxLink({ val }: { val: string }) {
  return (
    <>
      <Group wrap="nowrap" align="start" gap="xs">
        <Text fz="xs" style={{ wordBreak: 'break-word' }}>
          {val}
        </Text>
        <ActionIcon color="black">
          <PiLink size={16} />
        </ActionIcon>
      </Group>
    </>
  )
}
