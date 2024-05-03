'use client'

import { useAppSelector } from '@/hooks/redux'
import { AspectRatio, Box, Image, Group, Avatar, Button, Text } from '@mantine/core'
import TitleBar from '@/components/TitleBar'

export default function UserProfile() {
  const { _id, fetched, data } = useAppSelector(state => state.user)
  const { username, name, details } = data

  return (
    <Box>
      <Group justify="space-between" mt={32}>
        <Avatar w={64} h={64} src={details?.avatar} />
        <Button variant="outline" color="gray" size="xs">
          Setting
        </Button>
      </Group>
      <Group mt={16}>
        <Text>@{username}</Text>
      </Group>
    </Box>
  )
}
