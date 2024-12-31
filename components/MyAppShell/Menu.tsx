'use client'

import { usePathname as _usePathname } from 'next/navigation'
import { usePathname } from '@/i18n/routing'
import { Link } from '@/i18n/routing'
import { useAppSelector } from '@/hooks/redux'
import { Group, Stack, Text, Button } from '@mantine/core'
import { PiHouse, PiRocket, PiTrophy, PiCardholder } from 'react-icons/pi'
import { PiUserCircle, PiRocketLaunch, PiGear } from 'react-icons/pi'
import classes from './index.module.css'

const NavStack = Stack.withProps({ align: 'center', gap: 4 })

export function MobileMenu() {
  const { data } = useAppSelector(state => state.user)
  const { username } = data
  const currentIndex = useCurrentPage(username)

  const getProps = (index: number) => {
    const isCurrentPage = currentIndex === index
    return { c: isCurrentPage ? 'orange' : 'black' }
  }

  return (
    <>
      <Group className={classes.mobileMenu} h={56} grow>
        <Link href="/home">
          <NavStack {...getProps(0)}>
            <PiHouse size={24} />
            <Text fz="xs">Home</Text>
          </NavStack>
        </Link>
        <Link href="/activity">
          <NavStack {...getProps(1)}>
            <PiRocket size={24} />
            <Text fz="xs">Activity</Text>
          </NavStack>
        </Link>
        <Link href="/record">
          <NavStack {...getProps(2)}>
            <PiTrophy size={24} />
            <Text fz="xs">Record</Text>
          </NavStack>
        </Link>
        <Link href="/wallet">
          <NavStack {...getProps(3)}>
            <PiCardholder size={24} />
            <Text fz="xs">Wallet</Text>
          </NavStack>
        </Link>
      </Group>
    </>
  )
}

const NavButton = Button.withProps({
  w: '100%',
  size: 'compact-md',
  pl: 0,
  justify: 'left',
  radius: 'xs',
  fw: 400,
})

export function NavMenu() {
  const { data } = useAppSelector(state => state.user)
  const { username } = data

  const currentIndex = useCurrentPage(username)

  const getProps = (index: number) => {
    const isCurrentPage = currentIndex === index
    return { color: isCurrentPage ? '' : 'black' }
  }

  return (
    <>
      <Stack gap="lg">
        <Link href="/home">
          <NavButton variant="transparent" leftSection={<PiHouse size={18} />} {...getProps(0)}>
            Home
          </NavButton>
        </Link>
        <Link href="/activity">
          <NavButton variant="transparent" leftSection={<PiRocket size={18} />} {...getProps(1)}>
            Activity
          </NavButton>
        </Link>
        <Link href="/record">
          <NavButton variant="transparent" leftSection={<PiTrophy size={18} />} {...getProps(2)}>
            Record
          </NavButton>
        </Link>
        <Link href="/wallet">
          <NavButton
            variant="transparent"
            leftSection={<PiCardholder size={18} />}
            {...getProps(3)}
          >
            Wallet
          </NavButton>
        </Link>

        {username ? (
          <Link
            href={{
              pathname: '/u/[username]',
              params: { username },
            }}
          >
            <NavButton
              variant="transparent"
              leftSection={<PiUserCircle size={18} />}
              {...getProps(4)}
            >
              Profile
            </NavButton>
          </Link>
        ) : null}

        <Link href="/refer">
          <NavButton
            variant="transparent"
            leftSection={<PiRocketLaunch size={18} />}
            {...getProps(5)}
          >
            Referral
          </NavButton>
        </Link>

        <Link href="/profile/setting">
          <NavButton variant="transparent" leftSection={<PiGear size={18} />} {...getProps(6)}>
            Setting
          </NavButton>
        </Link>
      </Stack>
    </>
  )
}

function useCurrentPage(username?: string) {
  const pathname = usePathname()
  const _pathname = _usePathname()
  if (pathname.startsWith('/home')) return 0
  if (pathname.startsWith('/activity')) return 1
  if (pathname.startsWith('/record')) return 2
  if (pathname.startsWith('/wallet')) return 3
  if (_pathname.includes(`/u/${username}`)) return 4
  if (pathname.startsWith('/refer')) return 5
  if (pathname.startsWith('/profile')) return 6
  return -1
}
