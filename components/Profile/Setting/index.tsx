'use client'

import { useAppSelector } from '@/hooks/redux'
import { useSession } from 'next-auth/react'
import { Link } from '@/i18n/routing'
import { Group, Paper, Avatar, Stack, Space, Box, Divider } from '@mantine/core'
import { Title, Text, ActionIcon, Button, ThemeIcon } from '@mantine/core'
import RwdLayout from '@/components/share/RwdLayout'
import useLogout from '@/hooks/useLogout'
import { PiCaretRight, PiPencilSimpleLine, PiRocketLaunch } from 'react-icons/pi'
import { PiLinkSimpleHorizontal, PiSignOut } from 'react-icons/pi'

export default function ProfileSetting() {
  const { openLogoutModal } = useLogout()
  const { data: session } = useSession()
  const isAdmin = session?.user?.isAdmin

  const { data } = useAppSelector(state => state.user)
  const { username, name, details } = data

  return (
    <>
      <RwdLayout>
        <Stack>
          <Group justify="space-between" mb="md">
            <Title order={3}>Setting </Title>

            {/* Hide from users */}
            {isAdmin ? (
              <Link href="/admin">
                <Button size="xs" variant="outline" color="dark">
                  Go Admin
                </Button>
              </Link>
            ) : null}
          </Group>

          <Paper p="md" radius="sm" shadow="xs">
            <Group justify="space-between">
              <Group>
                <Avatar w={40} h={40} src={details?.avatar} />
                <Stack gap={4}>
                  <Title order={5} fw={500} lh={1}>
                    {name || 'No name'}
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

          {/* Account */}
          <Link href="/profile/account">
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
          </Link>

          <Divider my="md" />

          {/* Logout */}
          <Paper className="c-pointer" p="md" shadow="xs">
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
