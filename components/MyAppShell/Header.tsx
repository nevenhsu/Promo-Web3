'use client'

import { Link, usePathname, useRouter } from '@/navigation'
import { useAppSelector } from '@/hooks/redux'
import { usePrivy } from '@privy-io/react-auth'
import { Group, Box, Button } from '@mantine/core'
import { Avatar } from '@mantine/core'
import Logo from '@/public/images/logo.svg'
import { PiArrowLeft } from 'react-icons/pi'

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
            <Button
              variant="transparent"
              c="var(--mantine-color-text)"
              size="sm"
              leftSection={<PiArrowLeft size={16} />}
              onClick={() => router.back()}
              pl={0}
            >
              Back
            </Button>
          ) : (
            <Box w={40} h={40}>
              <Logo />
            </Box>
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
