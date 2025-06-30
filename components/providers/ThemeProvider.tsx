'use client'

import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { DatesProvider } from '@mantine/dates'
import { theme } from '@/theme'
import { resolver } from '@/theme/cssVariables'
import { publicEnv } from '@/utils/env'
import 'dayjs/locale/zh-TW'

const { defaultColorScheme } = publicEnv

export default function ThemeProvider({ children }: React.PropsWithChildren) {
  return (
    <MantineProvider
      theme={theme}
      cssVariablesResolver={resolver}
      defaultColorScheme={defaultColorScheme}
    >
      <DatesProvider settings={{ locale: 'zhTW' }}>
        <>
          {children}
          <Notifications />
        </>
      </DatesProvider>
    </MantineProvider>
  )
}
