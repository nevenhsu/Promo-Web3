'use client'

import { Link } from '@/navigation'
import { Title, Stack, Space, Paper, Group, Divider } from '@mantine/core'
import { Text, Avatar, Button, ThemeIcon, Box } from '@mantine/core'
import RwdLayout from '@/components/share/RwdLayout'
import { PiRocketLaunch, PiHandHeart } from 'react-icons/pi'

export default function Token() {
  return (
    <>
      <RwdLayout>
        <Stack gap="xl">
          <Title order={3}>Token</Title>

          <Paper radius="md" p="md" shadow="xs" mb="md">
            <Group justify="space-between">
              <Group>
                <Avatar src={''} name={''} color="initials" size={40}>
                  {' '}
                </Avatar>

                <Stack gap={4}>
                  <Text fw={500} lh={1}>
                    Token name
                  </Text>
                  <Text fz="xs" c="dimmed" lh={1}>
                    Symbol
                  </Text>
                </Stack>
              </Group>

              <Link href="/profile/token/info">
                <Button>Mint</Button>
              </Link>
            </Group>
          </Paper>

          {/* Contents */}
          <Stack gap={24}>
            <Group wrap="nowrap" align="start">
              <ThemeIcon size="xl" radius="md" variant="light">
                <PiRocketLaunch size={24} />
              </ThemeIcon>
              <Box>
                <Title order={4} fw={500}>
                  Reward participants
                </Title>
                <Text size="sm" c="dimmed">
                  Airdrop tokens to participants joining your activities
                </Text>
              </Box>
            </Group>

            <Group wrap="nowrap" align="start">
              <ThemeIcon size="xl" radius="md" variant="light">
                <PiHandHeart size={24} />
              </ThemeIcon>
              <Box>
                <Title order={4} fw={500}>
                  Reward donors
                </Title>
                <Text size="sm" c="dimmed">
                  Airdrop tokens to donors supporting your donation campaigns
                </Text>
              </Box>
            </Group>

            <Divider />
          </Stack>
        </Stack>
      </RwdLayout>

      <Space h={100} />
    </>
  )
}
