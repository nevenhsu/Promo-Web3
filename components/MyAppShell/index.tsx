'use client'

import { usePathname } from '@/navigation'
import { useDisclosure } from '@mantine/hooks'
import { useMediaQuery } from '@mantine/hooks'
import { AppShell } from '@mantine/core'
import Header from './Header'
import MobileFooter from './MobileFooter'

export default function MyAppShell({ children }: React.PropsWithChildren) {
  const matches = useMediaQuery('(min-width: 36em)')

  const [opened, { toggle }] = useDisclosure()
  const atHome = usePathname() === '/'

  return (
    <AppShell
      header={{ height: 64 }}
      navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened, desktop: true } }}
    >
      <AppShell.Header>
        <Header />
      </AppShell.Header>

      <AppShell.Main>{children}</AppShell.Main>

      {atHome ? null : (
        <AppShell.Footer>
          <MobileFooter />
        </AppShell.Footer>
      )}
    </AppShell>
  )
}
