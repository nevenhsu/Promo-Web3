'use client'

import { Link } from '@/navigation'
import { useAppSelector } from '@/hooks/redux'
import { usePrivy } from '@privy-io/react-auth'
import { Group, Box } from '@mantine/core'
import { Avatar } from '@mantine/core'
import Logo from '@/public/images/logo.svg'

export default function Header() {
  const { authenticated } = usePrivy()
  const { data } = useAppSelector(state => state.user)

  const avatar = data.details?.avatar || ''

  return (
    <>
      <Group h="100%" px={24} gap="xs" justify="space-between">
        <Link href="/">
          <Box w={40} h={40}>
            <Logo />
          </Box>
        </Link>

        <Group>
          {authenticated ? (
            <Link href="/profile">
              <Avatar src={avatar} />
            </Link>
          ) : null}
        </Group>
      </Group>
    </>
  )
}
