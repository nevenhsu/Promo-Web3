'use client'

import { useEffect } from 'react'
import { Link, usePathname, useRouter } from '@/navigation'
import { useSearchParams } from 'next/navigation'
import { useLocalStorage } from 'react-use'
import { useAppSelector } from '@/hooks/redux'
import { usePrivy } from '@privy-io/react-auth'
import { Group, Box, ActionIcon, Avatar } from '@mantine/core'
import Logo from '@/public/icons/logo.svg'
import { PiCaretLeft } from 'react-icons/pi'

export default function Header() {
  const router = useRouter()
  const pathname = usePathname()

  const { authenticated } = usePrivy()
  const { data, _id } = useAppSelector(state => state.user)

  const { name, details } = data
  const avatar = details?.avatar || ''

  const hasPreviousPage = pathname.split('/').length > 2

  // Get promo code from query params
  const searchParams = useSearchParams()
  const promo = searchParams.get('promo') || ''
  const [_promo, setPromo] = useLocalStorage<string>('promo', promo)

  useEffect(() => {
    if (promo && promo !== _promo) {
      setPromo(promo)
    }
  }, [promo, _promo])

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

          <Box w={64} h={64} ml={-16}>
            <Logo width="100%" height="100%" />
          </Box>
        </Group>

        <Group>
          {authenticated && Boolean(_id) ? (
            <Link href="/profile">
              <Avatar src={avatar}>{name ? name.substring(0, 1).toUpperCase() : ''}</Avatar>
            </Link>
          ) : null}
        </Group>
      </Group>
    </>
  )
}
