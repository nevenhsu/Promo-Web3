'use client'

import { useAppSelector } from '@/hooks/redux'
import { Link } from '@/navigation'
import { Group, Avatar, Stack, Title, Text, Divider, ActionIcon, Button } from '@mantine/core'
import RwdLayout from '@/components/share/RwdLayout'
import { PiCaretRight } from 'react-icons/pi'
import classes from './index.module.css'

export default function Profile() {
  const { _id, fetched, data } = useAppSelector(state => state.user)
  const { username, name, details } = data

  return (
    <Stack className={classes.root} gap={24}>
      <RwdLayout>
        <Stack>
          <Group>
            <Avatar w={64} h={64} src={details?.avatar} />
            <Stack gap={4}>
              <Title order={5}>{name ? name : 'Full name'}</Title>
              <Text fz={14} c="dimmed">
                {username ? `@${username}` : 'Username'}
              </Text>
            </Stack>
          </Group>

          {/* TODO: Hide from users */}
          <Link href="/admin">
            <Button size="compact-xs">Go Admin</Button>
          </Link>
        </Stack>
      </RwdLayout>

      <RwdLayout>
        <Stack className={classes.menu}>
          {/* Profile */}
          <Group justify="space-between">
            <Stack gap={4}>
              <Title order={6}>Personal information</Title>
              <Text>Update your profile</Text>
            </Stack>
            <ActionIcon>
              <PiCaretRight />
            </ActionIcon>
          </Group>
          <Divider />

          {/* Wallet */}
          <Group justify="space-between">
            <Stack gap={4}>
              <Title order={6}>Wallet configuration</Title>
              <Text>Setup your wallet</Text>
            </Stack>
            <ActionIcon>
              <PiCaretRight />
            </ActionIcon>
          </Group>
        </Stack>
      </RwdLayout>
    </Stack>
  )
}
