'use client'

import { Paper, Stack, Group, Title, Text, Space, Box } from '@mantine/core'
import RwdLayout from '@/components/share/RwdLayout'
import { PiArrowsLeftRight, PiArrowCircleDown } from 'react-icons/pi'

export default function History() {
  return (
    <>
      <RwdLayout>
        <Title order={5} mb="lg">
          History
        </Title>

        <Stack>
          {/* Item */}
          <Paper p="sm">
            <Text fz={10} c="dimmed" mb="xs">
              4 Mar 2024 10:04 AM
            </Text>

            <Group justify="space-between">
              <Group>
                <Box c="green.6">
                  <PiArrowCircleDown size={24} />
                </Box>
                <Stack gap={4}>
                  <Text>Received BTC</Text>
                  <Text c="green.6" fz="xs" fw={500}>
                    Confirmed
                  </Text>
                </Stack>
              </Group>

              <Stack gap={4} ta="right">
                <Text>2.8 BTC</Text>
                <Text c="dimmed" fz="xs">
                  USD 64393.23
                </Text>
              </Stack>
            </Group>
          </Paper>

          <Paper p="sm">
            <Text fz={10} c="dimmed" mb="xs">
              2 Mar 2024 8:04 AM
            </Text>

            <Group justify="space-between">
              <Group>
                <Box c="blue">
                  <PiArrowsLeftRight size={24} />
                </Box>
                <Stack gap={4}>
                  <Text>Sent BTC</Text>
                  <Text c="blue" fz="xs" fw={500}>
                    Pending
                  </Text>
                </Stack>
              </Group>

              <Stack gap={4} ta="right">
                <Text>0.8 BTC</Text>
                <Text c="dimmed" fz="xs">
                  USD 34393.23
                </Text>
              </Stack>
            </Group>
          </Paper>
        </Stack>
      </RwdLayout>

      <Space h={100} />
    </>
  )
}
