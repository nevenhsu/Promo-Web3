'use client'

import { Link, usePathname, useRouter } from '@/navigation'
import { useAppSelector } from '@/hooks/redux'
import { usePrivy } from '@privy-io/react-auth'
import { Group, Box, ActionIcon } from '@mantine/core'
import { Avatar } from '@mantine/core'
import Logo from '@/public/images/logo.svg'
import { PiCaretLeft } from 'react-icons/pi'

export default function Header() {
  const router = useRouter()
  const pathname = usePathname()

  const { authenticated } = usePrivy()
  const { data } = useAppSelector(state => state.user)

  const avatar = data.details?.avatar || ''
  const hasPreviousPage = pathname.split('/').length > 2

  return (
    <>
      <Group h="100%" px={24} gap="xs" justify="space-between">
        <>
          {hasPreviousPage ? (
            <ActionIcon size="lg" onClick={() => router.back()}>
              <PiCaretLeft />
            </ActionIcon>
          ) : (
            <Link href="/">
              <Box w={40} h={40}>
                <Logo />
              </Box>
            </Link>
          )}
        </>

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
