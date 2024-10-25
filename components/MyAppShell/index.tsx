'use client'

import { usePathname } from '@/i18n/routing'
import { useMediaQuery } from '@mantine/hooks'
import { useLoginStatus } from '@/hooks/useLoginStatus'
import { AppShell } from '@mantine/core'
import Header from './Header'
import { MobileMenu, NavMenu } from './Menu'
import { variables } from '@/theme/cssVariables'

export default function MyAppShell({ children }: React.PropsWithChildren) {
  const matches = useMediaQuery('(min-width: 36em)')
  const pathname = usePathname()
  const noMenu = pathname === '/' || pathname.startsWith('/page')
  const { bothAuth } = useLoginStatus()

  const showMenu = !noMenu && bothAuth
  const showFooter = showMenu && !matches
  const showNavbar = showMenu && matches

  return (
    <AppShell
      header={{ ...variables.header }}
      navbar={{
        width: 160,
        breakpoint: '35.99em',
        collapsed: { mobile: !showNavbar, desktop: !showNavbar },
      }}
      footer={{ height: 56, collapsed: !showFooter }}
      withBorder={false}
      styles={{
        header: { background: 'transparent' },
      }}
    >
      <AppShell.Header>
        <Header />
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <NavMenu />
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>

      <AppShell.Footer>
        <MobileMenu />
      </AppShell.Footer>
    </AppShell>
  )
}
