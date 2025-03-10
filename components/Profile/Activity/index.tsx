'use client'

import { Link } from '@/i18n/routing'
import { Title, Stack, Space, Paper, Group, ActionIcon } from '@mantine/core'
import { Text, Button, ThemeIcon, Box } from '@mantine/core'
import RwdLayout from '@/components/share/RwdLayout'
import { ActivityCard } from './ActivityCard'
import { PiCoinVertical, PiCaretRight } from 'react-icons/pi'
import { useUserToken } from '@/store/contexts/app/userTokenContext'

export default function ProfileActivity() {
  const { fetchState } = useUserToken()

  const noToken = !fetchState.loading && !fetchState.value?.length

  return (
    <>
      <RwdLayout>
        <Stack gap="xl">
          <Stack gap="xs">
            <Group justify="space-between">
              <Title order={3}>Activity</Title>
              <Link href="/profile/activity/new">
                <Button size="sm" disabled={!fetchState.value?.length}>
                  New Activity
                </Button>
              </Link>
            </Group>

            <Text fz="sm" c="dimmed">
              Create an activity to engage with your supporters
            </Text>
          </Stack>

          {noToken ? (
            <Link href="/profile/token">
              <Paper p="md" shadow="xs">
                <Group justify="space-between" wrap="nowrap">
                  <Group wrap="nowrap">
                    <ThemeIcon size="xl" radius="md">
                      <PiCoinVertical size={24} />
                    </ThemeIcon>
                    <Box>
                      <Title order={4} fw={500}>
                        Mint token
                      </Title>
                      <Text size="xs" c="dimmed">
                        Create your own token as prize
                      </Text>
                    </Box>
                  </Group>
                  <ActionIcon color="dark">
                    <PiCaretRight size={24} />
                  </ActionIcon>
                </Group>
              </Paper>
            </Link>
          ) : null}
        </Stack>
      </RwdLayout>

      <Space h={100} />
    </>
  )
}
