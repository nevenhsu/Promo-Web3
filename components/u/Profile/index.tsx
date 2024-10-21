'use client'

import RwdLayout from '@/components/share/RwdLayout'
import { Space, Group, Stack, Box, AspectRatio, Avatar, Text, Tabs } from '@mantine/core'
import { PiCrownSimple, PiHandHeart, PiRocket } from 'react-icons/pi'
import type { User } from '@/models/user'

enum Tab {
  Ranking = 'ranking',
  Activity = 'activity',
  Donate = 'donate',
}

export default function UserProfile({ data }: { data: User }) {
  const { name, username, details, linkedAccounts } = data
  const { bio, cover, avatar, link } = details || {}

  return (
    <>
      <AspectRatio ratio={4 / 1}>
        {cover ? (
          <img
            src={cover}
            alt="cover"
            style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <Box bg="gray.1" />
        )}
      </AspectRatio>

      <RwdLayout pt={0}>
        <Box mb={-16}>
          <Box pos="relative" top={-32}>
            <Avatar src={avatar} name={name || username} color="initials" size={64} />
          </Box>
        </Box>

        <Stack mb="lg">
          <Group justify="space-between">
            <Box>
              <Text fz="lg" fw={500}>
                {name}
              </Text>
              <Text fz="xs" c="dimmed">
                {`@${username}`}
              </Text>
            </Box>
            <Box></Box>
          </Group>

          <Text fz="sm" c="dimmed">
            {bio}
          </Text>
        </Stack>

        <Tabs defaultValue={Tab.Ranking}>
          <Tabs.List grow>
            <Tabs.Tab value={Tab.Ranking} leftSection={<PiCrownSimple size={16} />}>
              Ranking
            </Tabs.Tab>
            <Tabs.Tab value={Tab.Activity} leftSection={<PiRocket size={16} />}>
              Activity
            </Tabs.Tab>
            <Tabs.Tab value={Tab.Donate} leftSection={<PiHandHeart size={16} />}>
              Donate
            </Tabs.Tab>
          </Tabs.List>
        </Tabs>
      </RwdLayout>

      <Space h={100} />
    </>
  )
}
