'use client'

import { useAppSelector } from '@/hooks/redux'
import { Link } from '@/navigation'
import { Group, Paper, Avatar, Stack, Space } from '@mantine/core'
import { Title, Text, ActionIcon, Button } from '@mantine/core'
import RwdLayout from '@/components/share/RwdLayout'
import useLogout from '@/hooks/useLogout'
import { PiCaretRight, PiPencilSimple } from 'react-icons/pi'
import classes from './index.module.css'

export default function Profile() {
  const { openLogoutModal } = useLogout()

  const { _id, fetched, data } = useAppSelector(state => state.user)
  const { username, name, details } = data

  return (
    <>
      <RwdLayout>
        <Stack gap="lg">
          <Group justify="space-between">
            <Title order={4}>Profile </Title>

            {/* TODO: Hide from users */}
            <Link href="/admin">
              <Button size="compact-xs">Go Admin</Button>
            </Link>
          </Group>

          <Paper c="white" p="md" bg="blue">
            <Group justify="space-between">
              <Group>
                <Avatar w={64} h={64} color="white" src={details?.avatar} />
                <Stack gap={4}>
                  <Title order={5}>{name ? name : 'Hello!'}</Title>
                  <Text fz="sm">{username ? `@${username}` : '-'}</Text>
                </Stack>
              </Group>

              <Link href="/profile/info">
                <ActionIcon color="white">
                  <PiPencilSimple size={20} />
                </ActionIcon>
              </Link>
            </Group>
          </Paper>

          <Paper withBorder p="md">
            <Stack className={classes.menu} gap="xl">
              {/* Item */}
              <Group justify="space-between">
                <Stack gap={4}>
                  <Text fw={500}>Linked Account</Text>
                  <Text fz="xs" c="dimmed">
                    Update your linked accounts
                  </Text>
                </Stack>
                <ActionIcon>
                  <PiCaretRight />
                </ActionIcon>
              </Group>

              {/* Item */}
              <Group justify="space-between">
                <Stack gap={4}>
                  <Text fw={500}>Wallet Configuration</Text>
                  <Text fz="xs" c="dimmed">
                    Manage your crypto wallet
                  </Text>
                </Stack>
                <ActionIcon>
                  <PiCaretRight />
                </ActionIcon>
              </Group>

              {/* Item */}
              <Group justify="space-between" onClick={() => openLogoutModal()}>
                <Stack gap={4}>
                  <Text fw={500}>Log Out</Text>
                  <Text fz="xs" c="dimmed">
                    Log out on this device
                  </Text>
                </Stack>
                <ActionIcon>
                  <PiCaretRight />
                </ActionIcon>
              </Group>
            </Stack>
          </Paper>

          <Space />

          <Title order={5}>More </Title>

          <Paper withBorder p="md">
            <Stack className={classes.menu} gap="xl">
              {/* Item */}
              <Group justify="space-between">
                <Text fw={500}>Help & Support</Text>
                <ActionIcon>
                  <PiCaretRight />
                </ActionIcon>
              </Group>

              {/* Item */}
              <Group justify="space-between">
                <Text fw={500}>About App</Text>
                <ActionIcon>
                  <PiCaretRight />
                </ActionIcon>
              </Group>
            </Stack>
          </Paper>
        </Stack>

        <Space h={100} />
      </RwdLayout>
    </>
  )
}
