'use client'

import { Link, usePathname, useRouter } from '@/navigation'
import { useAppSelector } from '@/hooks/redux'
import { useLoginStatus } from '@/hooks/useLoginStatus'
import { usePromo } from '@/hooks/usePromo'
import { Group, Box, ActionIcon, Avatar } from '@mantine/core'
import Logo from '@/public/logo.svg'
import { PiCaretLeft } from 'react-icons/pi'

export default function Header() {
  const router = useRouter()
  const pathname = usePathname()
  usePromo() // Save promo code

  const { bothAuth } = useLoginStatus()
  const { data } = useAppSelector(state => state.user)

  const { name, details } = data
  const avatar = details?.avatar || ''

  const hasPreviousPage = pathname.split('/').length > 2

  return (
    <>
      <Group h="100%" px={16} justify="space-between">
        <Group gap="md">
          {hasPreviousPage ? (
            <ActionIcon
              onClick={() => router.back()}
              variant="transparent"
              color="dark"
              aria-label="Back"
            >
              <PiCaretLeft />
            </ActionIcon>
          ) : null}

          <Box w={48} h={48} ml={-6}>
            <Logo width="100%" height="100%" />
          </Box>
        </Group>

        <Group>
          {bothAuth ? (
            <Link href="/profile">
              <Avatar src={avatar}>{name ? name.substring(0, 1).toUpperCase() : ''}</Avatar>
            </Link>
          ) : null}
        </Group>
      </Group>
    </>
  )
}
