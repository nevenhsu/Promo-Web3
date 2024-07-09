'use client'

import Image from 'next/image'
import { Link } from '@/navigation'
import { Tabs, Paper, Stack, Group, Text, Space, ThemeIcon } from '@mantine/core'
import RwdLayout from '@/components/share/RwdLayout'
import { PiArrowCircleUp, PiArrowCircleDown } from 'react-icons/pi'
import classes from './index.module.css'

enum TabValue {
  Transaction = 'transaction',
  Airdrop = 'airdrop',
}

export default function History() {
  return (
    <>
      <RwdLayout>
        <Tabs defaultValue={TabValue.Transaction}>
          <Tabs.List>
            <Tabs.Tab value={TabValue.Transaction}>Transaction</Tabs.Tab>
            <Tabs.Tab value={TabValue.Airdrop}>Airdrop</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value={TabValue.Transaction}>
            <Stack py={40}>
              <Link
                href={{
                  pathname: '/wallet/history/[tx]',
                  params: { tx: '1' },
                }}
              >
                <Paper radius="md" p="md" shadow="xs">
                  <Group justify="space-between">
                    <Group>
                      <ThemeIcon size={32} variant="white" color="blue">
                        <PiArrowCircleDown size={32} />
                      </ThemeIcon>

                      <Stack gap={4}>
                        <Text fw={500} lh={1}>
                          USDC
                        </Text>
                        <Text fz="xs" c="dimmed" lh={1}>
                          USC Coin
                        </Text>
                      </Stack>
                    </Group>

                    <Stack gap={4} ta="right">
                      <Text fw={500} lh={1}>
                        +350.48
                      </Text>
                      <Text fz="xs" c="dimmed" lh={1}>
                        6 Jul 2024 09:41
                      </Text>
                    </Stack>
                  </Group>
                </Paper>
              </Link>
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value={TabValue.Airdrop}>
            <Stack py={40}>
              <Paper radius="md" p="md" shadow="xs">
                <Group justify="space-between">
                  <Group>
                    <Image
                      className={classes.icon}
                      src="/icons/usdc-token.svg"
                      width={32}
                      height={32}
                      alt="usd coin"
                    />

                    <Stack gap={4}>
                      <Text fw={500} lh={1}>
                        USDC
                      </Text>
                      <Text fz="xs" c="dimmed" lh={1}>
                        USC Coin
                      </Text>
                    </Stack>
                  </Group>

                  <Stack gap={4} ta="right">
                    <Text fw={500} lh={1}>
                      +350.48
                    </Text>
                    <Text fz="xs" c="dimmed" lh={1}>
                      6 Jul 2024 09:41
                    </Text>
                  </Stack>
                </Group>
              </Paper>
            </Stack>
          </Tabs.Panel>
        </Tabs>
      </RwdLayout>

      <Space h={100} />
    </>
  )
}
