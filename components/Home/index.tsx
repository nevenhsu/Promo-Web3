'use client'

import * as _ from 'lodash-es'
import { useAppSelector } from '@/hooks/redux'
import { useReferral } from '@/store/contexts/app/referralContext'
import { Link } from '@/navigation'
import { Stack, Group, Box, Paper, SimpleGrid, Divider, Space } from '@mantine/core'
import { Title, Text, ThemeIcon, ActionIcon } from '@mantine/core'
import RwdLayout from '@/components/share/RwdLayout'
import { PiRocket, PiRocketLaunch } from 'react-icons/pi'
import { PiCaretRight, PiBarcode } from 'react-icons/pi'

export default function Home() {
  const { isReferred } = useReferral()
  const { data, statusData } = useAppSelector(state => state.user)
  const { name } = data

  const { progress, status } = statusData || {}
  const { referral1stScore, referral2ndScore, totalScore = 0, selfScore = 0 } = status || {}
  const referralScore = _.sum([referral1stScore, referral2ndScore]) || 0

  return (
    <>
      <RwdLayout>
        <Title order={3}>{name ? `Hi, ${name}` : 'Hello!'}</Title>
        <Space h={40} />
        <Stack>
          {/* Total Score */}
          <Paper p={16} c="white" bg="orange">
            <Group justify="space-between">
              <Title order={4}>Total Score</Title>
              <Title order={4}>{totalScore}</Title>
            </Group>
            <Space h={12} />
            <Divider color="white" />
            <Space h={24} />
            <SimpleGrid cols={2}>
              <Group gap={12}>
                <PiRocket size={24} />
                <Box>
                  <Text size="xs">Activity</Text>
                  <Text fw={500}>{selfScore}</Text>
                </Box>
              </Group>
              <Group gap={12}>
                <PiRocketLaunch size={24} />
                <Box>
                  <Text size="xs">Referral</Text>
                  <Text fw={500}>{referralScore}</Text>
                </Box>
              </Group>
            </SimpleGrid>
          </Paper>

          {/* Activity */}
          <Paper p={16} shadow="xs">
            <Group>
              <ThemeIcon size="xl" radius="md" variant="light">
                <PiRocket size={24} />
              </ThemeIcon>
              <Box>
                <Title order={4} fw={500}>
                  Activity
                </Title>
                <Text size="xs" c="dimmed">
                  Join activities to gain score
                </Text>
              </Box>
            </Group>
            <Space h={16} />
            <Divider />
            <Space h={24} />
            <SimpleGrid cols={2}>
              <Box>
                <Text size="xs" c="dimmed">
                  Participated
                </Text>
                <Title order={4}>{progress?.total || 0}</Title>
              </Box>
              <Box>
                <Text size="xs" c="dimmed">
                  Ongoing
                </Text>
                <Title order={4}>{progress?.ongoing || 0}</Title>
              </Box>
            </SimpleGrid>
          </Paper>

          <Stack gap="xs">
            {/* Refer */}
            <Link href="/refer">
              <Paper p="md" shadow="xs">
                <Group justify="space-between" wrap="nowrap">
                  <Group wrap="nowrap">
                    <ThemeIcon size="xl" radius="md">
                      <PiRocketLaunch size={24} />
                    </ThemeIcon>
                    <Box>
                      <Title order={4} fw={500}>
                        Refer a friend
                      </Title>
                      <Text size="xs" c="dimmed">
                        You’ll earn bonus score from friends
                      </Text>
                    </Box>
                  </Group>
                  <ActionIcon color="dark">
                    <PiCaretRight size={24} />
                  </ActionIcon>
                </Group>
              </Paper>
            </Link>

            {/* Referral code */}
            {isReferred ? null : (
              <Link href="/refer/code">
                <Paper p="md" shadow="xs">
                  <Group justify="space-between" wrap="nowrap">
                    <Group wrap="nowrap">
                      <ThemeIcon size="xl" radius="md">
                        <PiBarcode size={24} />
                      </ThemeIcon>
                      <Box>
                        <Title order={4} fw={500}>
                          Enter referral code
                        </Title>
                        <Text size="xs" c="dimmed">
                          The code provided by your friend
                        </Text>
                      </Box>
                    </Group>
                    <ActionIcon color="dark">
                      <PiCaretRight size={24} />
                    </ActionIcon>
                  </Group>
                </Paper>
              </Link>
            )}
          </Stack>
        </Stack>
      </RwdLayout>

      <Space h={100} />
    </>
  )
}
