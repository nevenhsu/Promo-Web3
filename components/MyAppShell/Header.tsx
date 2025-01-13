'use client'

import Image from 'next/image'
import { Link, usePathname } from '@/i18n/routing'
import { useMediaQuery } from '@mantine/hooks'
import { useAppSelector } from '@/hooks/redux'
import { useLoginStatus } from '@/hooks/useLoginStatus'
import { useGoBack } from '@/hooks/useGoBack'
import { useClickLogin } from '@/hooks/useLogin'
import { Group, Box, ActionIcon, Avatar, Button } from '@mantine/core'
import NetworkButton from '@/components/Wallet/NetworkButton'
import { PiCaretLeft } from 'react-icons/pi'
import classes from './index.module.css'

export default function Header() {
  const matches = useMediaQuery('(min-width: 36em)')
  const pathname = usePathname()
  const { canGoBack, goBack } = useGoBack()
  const { bothAuth, nextAuthFail } = useLoginStatus()
  const { data } = useAppSelector(state => state.user)
  const { clickLogin, loading } = useClickLogin()

  // for user avatar
  const { name, username, details } = data

  // for back button
  const mobileBack = !matches && ['/refer'].includes(pathname)
  const hasPreviousPage = pathname.split('/').length > 2 || mobileBack
  const showBack = canGoBack && hasPreviousPage

  return (
    <>
      <Box className={classes['header-bg']} />

      <Group h="100%" px={16} justify="space-between" pos="relative" wrap="nowrap">
        <Group gap="md" wrap="nowrap">
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

          <Link href="/">
            <Box className="c-pointer" w={48} h={48} ml={-6}>
              <Image src="/logo.svg" width={48} height={48} alt="" />
            </Box>
          </Link>
        </Group>

        <Group wrap="nowrap">
          <NetworkButton />

          {bothAuth && username ? (
            <Link
              href={{
                pathname: '/u/[username]',
                params: { username },
              }}
            >
              <Avatar src={details?.avatar} name={name || username} color="initials" />
            </Link>
          ) : null}
          {nextAuthFail ? (
            <Button variant="outline" size="sm" onClick={clickLogin} loading={loading}>
              Login
            </Button>
          ) : null}
        </Group>
      </Group>
    </>
  )
}
