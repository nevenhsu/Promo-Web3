'use client'

import { useAppSelector } from '@/hooks/redux'
import { Link } from '@/navigation'
import { Group, Paper, Avatar, Stack, Space, Box, Divider } from '@mantine/core'
import { Title, Text, ActionIcon, Button, ThemeIcon } from '@mantine/core'
import RwdLayout from '@/components/share/RwdLayout'
import useLogout from '@/hooks/useLogout'
import { PiCaretRight, PiPencilSimpleLine, PiRocketLaunch } from 'react-icons/pi'
import { PiUserCircle, PiLinkSimpleHorizontal, PiSignOut } from 'react-icons/pi'
import classes from './index.module.css'

export default function Profile() {
  const { openLogoutModal } = useLogout()

  const { _id, fetched, data } = useAppSelector(state => state.user)
  const { username, name, details } = data

  return (
    <>
      <RwdLayout>
        <Stack>
          <Group justify="space-between" mb="md">
            <Title order={3}>Profile </Title>

            {/* TODO: Hide from users */}
            <Link href="/admin">
              <Button size="xs" variant="outline" color="black">
                Go Admin
              </Button>
            </Link>
          </Group>

          <Paper p="md" radius="sm" shadow="xs">
            <Group justify="space-between">
              <Group>
                <Avatar w={40} h={40} src={details?.avatar} />
                <Stack gap={4}>
                  <Title order={5} fw={500} lh={1}>
                    {name || 'Unset name'}
                  </Title>
                  <Text fz="xs" lh={1} c="dimmed">
                    {username ? `@${username}` : '-'}
                  </Text>
                </Stack>
              </Group>

              <Link href="/profile/info">
                <ActionIcon color="dark">
                  <PiPencilSimpleLine size={20} />
                </ActionIcon>
              </Link>
            </Group>
          </Paper>

          {/* Refer */}
          <Link href="/refer">
            <Paper p="md" shadow="xs">
              <Group justify="space-between" wrap="nowrap">
                <Group wrap="nowrap" gap={20}>
                  <ThemeIcon size="lg" radius="sm">
                    <PiRocketLaunch size={24} />
                  </ThemeIcon>
                  <Box>
                    <Title order={5} fw={500}>
                      Earn more score
                    </Title>
                    <Text size="xs" c="dimmed">
                      Refer your friends & earn up to 10% score every time your friends gain
                    </Text>
                  </Box>
                </Group>
                <ActionIcon color="dark">
                  <PiCaretRight size={20} />
                </ActionIcon>
              </Group>
            </Paper>
          </Link>

          <Divider my="md" />

          {/* Personal Info */}
          <Link href="/profile/info">
            <Paper p="md" shadow="xs">
              <Group justify="space-between">
                <Group gap={20}>
                  <ThemeIcon size="lg" radius="xl" variant="light">
                    <PiUserCircle size={24} />
                  </ThemeIcon>
                  <Text fw={500}>Personal Info</Text>
                </Group>
                <ActionIcon color="dark">
                  <PiCaretRight size={20} />
                </ActionIcon>
              </Group>
            </Paper>
          </Link>

          {/* Account */}
          <Paper p="md" shadow="xs">
            <Group justify="space-between">
              <Group gap={20}>
                <ThemeIcon size="lg" radius="xl" variant="light">
                  <PiLinkSimpleHorizontal size={24} />
                </ThemeIcon>
                <Text fw={500}>Linked Accounts</Text>
              </Group>
              <ActionIcon color="dark">
                <PiCaretRight size={20} />
              </ActionIcon>
            </Group>
          </Paper>

          <Divider my="md" />

          {/* Logout */}
          <Paper p="md" shadow="xs">
            <Group gap={20} onClick={openLogoutModal}>
              <ThemeIcon size="lg" radius="xl" variant="light" color="red">
                <PiSignOut size={24} />
              </ThemeIcon>
              <Text fw={500} c="red">
                Log out
              </Text>
            </Group>
          </Paper>
        </Stack>
      </RwdLayout>

      <Space h={100} />
    </>
  )
}
