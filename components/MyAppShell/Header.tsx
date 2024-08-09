'use client'

import { Link, usePathname } from '@/navigation'
import { useAppSelector } from '@/hooks/redux'
import { useLoginStatus } from '@/hooks/useLoginStatus'
import { usePromo } from '@/hooks/usePromo'
import { useGoBack } from '@/hooks/useGoBack'
import { Group, Box, ActionIcon, Avatar } from '@mantine/core'
import Logo from '@/public/logo.svg'
import { PiCaretLeft } from 'react-icons/pi'

export default function Header() {
  usePromo() // Save promo code
  const pathname = usePathname()

  const { canGoBack, goBack } = useGoBack()
  const { bothAuth } = useLoginStatus()
  const { data } = useAppSelector(state => state.user)

  const { name, details } = data
  const avatar = details?.avatar || ''

  const hasPreviousPage = pathname.split('/').length > 2
  const showBack = canGoBack && hasPreviousPage

  return (
    <>
      <Group h="100%" px={16} justify="space-between">
        <Group gap="md">
          {showBack ? (
            <ActionIcon
              onClick={() => goBack()}
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
