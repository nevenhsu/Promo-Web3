'use client'

import { usePathname } from '@/navigation'
import { useDisclosure } from '@mantine/hooks'
import { useMediaQuery } from '@mantine/hooks'
import { useLoginStatus } from '@/hooks/useLoginStatus'
import { AppShell } from '@mantine/core'
import Header from './Header'
import MobileFooter from './MobileFooter'
import { variables } from '@/theme/cssVariables'

export default function MyAppShell({ children }: React.PropsWithChildren) {
  const matches = useMediaQuery('(min-width: 36em)')
  const atHome = usePathname() === '/'

  const [opened, { toggle }] = useDisclosure()
  const { bothAuth } = useLoginStatus()

  return (
    <AppShell
      header={{ ...variables.header }}
      navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened, desktop: true } }}
      withBorder={false}
      styles={{
        header: { background: 'transparent' },
      }}
    >
      <AppShell.Header>
        <Header />
      </AppShell.Header>

      <AppShell.Main>{children}</AppShell.Main>

      {atHome || !bothAuth ? null : (
        <AppShell.Footer>
          <MobileFooter />
        </AppShell.Footer>
      )}
    </AppShell>
  )
}
