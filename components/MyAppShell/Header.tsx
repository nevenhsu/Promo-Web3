'use client'

import { Link, usePathname } from '@/navigation'
import { useAppSelector } from '@/hooks/redux'
import { useLoginStatus } from '@/hooks/useLoginStatus'
import { usePromo } from '@/hooks/usePromo'
import { useGoBack } from '@/hooks/useGoBack'
import { Group, Box, ActionIcon, Avatar } from '@mantine/core'
import Logo from '@/public/logo.svg'
import { PiCaretLeft } from 'react-icons/pi'
import classes from './index.module.css'

export default function Header() {
  usePromo() // Save promo code
  const pathname = usePathname()

  const { canGoBack, goBack } = useGoBack()
  const { bothAuth } = useLoginStatus()
  const { data } = useAppSelector(state => state.user)

  // for user avatar
  const { name, username, details } = data
  const shortName =
    name
      ?.split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase() || username?.substring(0, 1).toUpperCase()

  // for back button
  const hasPreviousPage =
    pathname.split('/').length > 2 || ['/refer', '/profile'].includes(pathname)
  const showBack = canGoBack && hasPreviousPage

  return (
    <>
      <Box className={classes['header-bg']} />

      <Group h="100%" px={16} justify="space-between" pos="relative">
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
              <Avatar src={details?.avatar}>{shortName}</Avatar>
            </Link>
          ) : null}
        </Group>
      </Group>
    </>
  )
}
