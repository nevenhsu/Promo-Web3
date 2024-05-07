'use client'

import { Paper, Stack, Group, Title, Text, Divider, Space } from '@mantine/core'
import { Button, Checkbox, TextInput, NumberInput, ActionIcon } from '@mantine/core'
import RwdLayout from '@/components/share/RwdLayout'
import { PiCaretDown, PiCurrencyBtcFill, PiScan } from 'react-icons/pi'
import classes from './index.module.css'

export default function Send() {
  return (
    <>
      <RwdLayout>
        <Stack>
          <Title order={5}>Send Tokens</Title>

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
            <Stack gap="lg">
              <Group justify="space-between">
                <Text fz={14} fw={500}>
                  To
                </Text>
                <Button variant="outline" size="compact-xs" radius="xl">
                  Address book
                </Button>
              </Group>
              <TextInput
                placeholder="Public Address (0x)"
                rightSection={
                  <ActionIcon>
                    <PiScan size={24} />
                  </ActionIcon>
                }
              />
              <Checkbox label="Save to address book" variant="outline" size="xs" />
            </Stack>
          </Paper>

          <Paper p="md" withBorder>
            <Stack>
              <NumberInput
                label="Amount"
                description="Available 11.4288 BTC"
                placeholder=""
                rightSectionWidth={48}
                rightSection={
                  <Button size="compact-xs" variant="transparent">
                    Max
                  </Button>
                }
              />

              <Stack gap="xs">
                <Text fz={14} fw={500}>
                  Network fee
                </Text>

                <Group className={classes.field} justify="space-between">
                  <Text fz={14}>Average</Text>
                  <PiCaretDown size={16} />
                </Group>
              </Stack>

              <Divider my="xs" />

              <Stack gap="xs">
                <Group justify="space-between">
                  <Text fz={14}>Total Amount</Text>
                  <Text fz={14} fw={500}>
                    1.2234 BTC
                  </Text>
                </Group>
                <Text ta="right" fz={12} c="dimmed">
                  USD 93232.32
                </Text>
              </Stack>
            </Stack>
          </Paper>

          <Space h={0} />

          <Group grow>
            <Button>Send</Button>
          </Group>
        </Stack>

        <Space h={100} />
      </RwdLayout>
    </>
  )
}
