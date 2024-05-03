'use client'

import { MantineProvider } from '@mantine/core'
import { ModalsProvider } from '@mantine/modals'
import { Notifications } from '@mantine/notifications'
import { theme } from '@/theme'
import { resolver } from '@/theme/cssVariables'
import { publicEnv } from '@/utils/env'

export default function ThemeProvider({ children }: React.PropsWithChildren) {
  return (
    <MantineProvider
      theme={theme}
      cssVariablesResolver={resolver}
      defaultColorScheme={publicEnv.defaultColorScheme}
    >
      <Notifications />
      <ModalsProvider modalProps={{ centered: true }}>{children}</ModalsProvider>
    </MantineProvider>
  )
}
