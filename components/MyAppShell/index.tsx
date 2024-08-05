'use client'

import { usePathname } from '@/navigation'
import { useDisclosure } from '@mantine/hooks'
import { useMediaQuery } from '@mantine/hooks'
import { AppShell } from '@mantine/core'
import Header from './Header'
import MobileFooter from './MobileFooter'
import { variables } from '@/theme/cssVariables'

export default function MyAppShell({ children }: React.PropsWithChildren) {
  const matches = useMediaQuery('(min-width: 36em)')
  const atHome = usePathname() === '/'

  const [opened, { toggle }] = useDisclosure()

  return (
    <AppShell
      header={{ ...variables.header }}
      navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened, desktop: true } }}
      withBorder={false}
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
