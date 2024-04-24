'use client'

import { useRouter } from 'next/navigation'
import { useAppSelector } from '@/hooks/redux'
import { AspectRatio, Box, Image, Group, Avatar, Button, Text } from '@mantine/core'
import TitleBar from '@/components/TitleBar'
import type { User } from '@/models/user'

type ProfileProps = {
  user: User | undefined
}

export default function UserProfile({ user }: ProfileProps) {
  const router = useRouter()

  const { _id, fetched } = useAppSelector(state => state.user)
  const isLogin = Boolean(_id) && fetched
  const isSelf = isLogin && _id === user?._id.toString()

  if (!user?._id) {
    return (
      <Box>
        <TitleBar title="Not Found" />
      </Box>
    )
  }

  const userId = user._id.toString()

  return (
    <Box mb={80}>
      <TitleBar title={user.name || ''} />
      <Box
        style={{
          position: 'relative',
          left: -16,
          width: 'calc(100dvw + 32px)',
        }}
      >
        <AspectRatio ratio={1}>
          <Image src="https://s.mj.run/VF7GlGMHYKY" alt="" />
        </AspectRatio>
      </Box>

      <Group justify="space-between" mt={32}>
        <Avatar w={64} h={64} src={user?.details?.avatar} />
        {isSelf ? (
          <Button variant="outline" color="gray" size="xs">
            Setting
          </Button>
        ) : (
          <Button variant="outline" color="gray" size="xs">
            Follow
          </Button>
        )}
      </Group>
      <Group mt={16}>
        <Text>@{user.username}</Text>
      </Group>
    </Box>
  )
}
