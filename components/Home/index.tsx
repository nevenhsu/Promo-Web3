'use client'

import { useAppSelector } from '@/hooks/redux'
import { Link } from '@/navigation'
import { Stack, Group, Box, Paper, SimpleGrid, Divider, Space } from '@mantine/core'
import { Title, Text, ThemeIcon, ActionIcon } from '@mantine/core'
import RwdLayout from '@/components/share/RwdLayout'
import { PiRocket, PiRocketLaunch, PiCurrencyCircleDollar, PiCaretRight } from 'react-icons/pi'

export default function Home() {
  const { data, _id } = useAppSelector(state => state.user)
  const { name } = data

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
              <Title order={4}>32,542</Title>
            </Group>
            <Space h={12} />
            <Divider color="white" />
            <Space h={24} />
            <SimpleGrid cols={2}>
              <Group gap={12}>
                <PiRocket size={24} />
                <Box>
                  <Text size="xs">Activity</Text>
                  <Text fw={500}>32,542</Text>
                </Box>
              </Group>
              <Group gap={12}>
                <PiRocketLaunch size={24} />
                <Box>
                  <Text size="xs">Referral</Text>
                  <Text fw={500}>2,820</Text>
                </Box>
              </Group>
            </SimpleGrid>
          </Paper>

          {/* Activity */}
          <Paper p={16} shadow="xs">
            <Group>
              <ThemeIcon size="xl" radius="md">
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
                  Completed
                </Text>
                <Title order={4}>12</Title>
              </Box>
              <Box>
                <Text size="xs" c="dimmed">
                  Ongoing
                </Text>
                <Title order={4}>1</Title>
              </Box>
            </SimpleGrid>
          </Paper>

          {/* Airdrop */}
          <Paper p={16} shadow="xs">
            <Group>
              <ThemeIcon size="xl" radius="md">
                <PiCurrencyCircleDollar size={24} />
              </ThemeIcon>
              <Box>
                <Title order={4} fw={500}>
                  Airdrop
                </Title>
                <Text size="xs" c="dimmed">
                  Earn airdrop by boosting score
                </Text>
              </Box>
            </Group>
            <Space h={16} />
            <Divider />
            <Space h={24} />
            <SimpleGrid cols={2}>
              <Box>
                <Text size="xs" c="dimmed">
                  Received
                </Text>
                <Title order={4}>$12.22</Title>
              </Box>
              <Box>
                <Text size="xs" c="dimmed">
                  Pending
                </Text>
                <Title order={4}>$2.38</Title>
              </Box>
            </SimpleGrid>
          </Paper>

          {/* Refer */}
          <Link href="/refer">
            <Paper p={16} shadow="xs">
              <Group justify="space-between">
                <Group>
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
        </Stack>

        <Space h={100} />
      </RwdLayout>
    </>
  )
}
