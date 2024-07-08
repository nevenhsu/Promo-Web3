'use client'

import { getTweet as _getTweet } from 'react-tweet/api'
import { Group, Stack, Box, Space, Divider, Paper } from '@mantine/core'
import { Title, Text, Button, ThemeIcon, Progress } from '@mantine/core'
import RwdLayout from '@/components/share/RwdLayout'
import { PiLightning, PiPersonSimpleRun, PiTrophy, PiCheckBold } from 'react-icons/pi'
import classes from '../index.module.css'

type ActivityDetailProps = { activityId: string; children?: React.ReactNode }

export default function ActivityDetail({ activityId, children }: ActivityDetailProps) {
  console.log({ activityId })

  return (
    <>
      <RwdLayout>
        <Stack gap="lg">
          <Box>
            <Text c="dimmed" fz="xs">
              6 Jun 2024 ~ 31 Jul 2024
            </Text>
            <Title order={3}>Taitra Tech Promotion</Title>
          </Box>

          <Text fz="sm" c="dark">
            RAMAYANA BALLET at Purawisata – Jogjakarta – Indonesia, has held the record for
            every-night stage without ever being off for 42 YEARS, and received an award from The
            Indonesia Records Museum (MURI) in 2001.
          </Text>

          <Title order={4} c="orange">
            200 USDC
          </Title>

          <Stack gap="sm">
            <Paper radius="sm" p="md" shadow="xs">
              <Group>
                <ThemeIcon color="green" radius="xl" size="lg">
                  <PiCheckBold />
                </ThemeIcon>
                <Box>
                  <Title order={5} fw={500}>
                    Successfully joined!
                  </Title>
                  <Text c="dimmed" fz="xs">
                    Keep the post until the event end
                  </Text>
                </Box>
              </Group>
            </Paper>

            <Paper radius="sm" p="md" shadow="xs">
              <Group justify="space-between">
                <Title order={4} fw={500}>
                  Activity Score
                </Title>
                <Title order={4} c="orange">
                  1.2k
                </Title>
              </Group>

              <Stack mt={8} gap="lg">
                <Divider />

                <Stack gap="lg">
                  <Box>
                    <Text c="dark" fz="sm" mb="xs">
                      Your post score
                    </Text>

                    <Progress.Root size="sm">
                      <Progress.Section value={10} color="orange" />
                      <Progress.Section value={5} color="orange.2" />
                    </Progress.Root>

                    <Group mt="xs" justify="space-between">
                      <Group gap="sm">
                        <Text fz="sm" c="orange">
                          Score: 1.2k
                        </Text>
                        <Text fz="sm" c="orange.4">
                          Bonus: 600
                        </Text>
                      </Group>
                      <Text fz="sm" c="dimmed">
                        Total: 1.4m
                      </Text>
                    </Group>
                  </Box>
                </Stack>

                <Text fz="xs" c="dimmed">
                  Last Updated at 6 Jun 2024 18:32
                </Text>
              </Stack>
            </Paper>

            <Paper radius="sm" p="md" shadow="xs">
              <Group justify="space-between">
                <Title order={4} fw={500}>
                  Airdrop share
                </Title>
                <Title order={4} c="orange">
                  10.2 USDC
                </Title>
              </Group>

              <Stack mt={8} gap="lg">
                <Divider />

                <Stack gap="lg">
                  <Box>
                    <Text c="dark" fz="sm" mb="xs">
                      Your share
                    </Text>

                    <Progress size="sm" value={10.2} />

                    <Group mt="xs" gap={4}>
                      <Text fz="sm" c="orange">
                        10.2
                      </Text>
                      <Text fz="sm" c="dimmed">
                        / 100
                      </Text>
                    </Group>
                  </Box>
                </Stack>

                <Text fz="xs" c="dimmed">
                  Airdrop share will finalized at 31 Jul 2024
                </Text>
              </Stack>
            </Paper>
          </Stack>

          <>
            <Divider />
            <Title order={6}>Event Details</Title>
            <Stack gap="xs">
              <Group gap="xs">
                <PiLightning size={20} />
                <Text fz="sm">Repost on X</Text>
              </Group>

              <Group gap="xs">
                <PiPersonSimpleRun size={20} />
                <Text fz="sm"> 123 Participants</Text>
              </Group>

              <Group gap="xs">
                <PiTrophy size={20} />
                <Text fz="sm">1.8m Total score</Text>
              </Group>
            </Stack>
            <Divider />
          </>

          <Stack>
            <Button variant="outline">Open link</Button>
            <Button>Mark completed</Button>
          </Stack>

          {/* Embedded Post */}
          {children}
        </Stack>
      </RwdLayout>

      <Space h={100} />
    </>
  )
}
