'use client'

import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { DatesProvider } from '@mantine/dates'
import { theme } from '@/theme'
import { resolver } from '@/theme/cssVariables'
import { publicEnv } from '@/utils/env'

const { defaultColorScheme, timezone } = publicEnv

export default function ThemeProvider({ children }: React.PropsWithChildren) {
  return (
    <MantineProvider
      theme={theme}
      cssVariablesResolver={resolver}
      defaultColorScheme={defaultColorScheme}
    >
      <DatesProvider settings={{ timezone }}>
        <>
          {children}
          <Notifications />
        </>
      </DatesProvider>
    </MantineProvider>
  )
}
