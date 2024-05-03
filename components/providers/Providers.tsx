'use client'

import '@/utils/console'

import ReduxProvider from '@/store/ReduxProvider'
import ThemeProvider from './ThemeProvider'
import PrivyProvider from './PrivyProvider'
import AuthProvider from './AuthProvider'
import BackgroundTask from './BackgroundTask'

export default function Providers({ children }: React.PropsWithChildren) {
  return (
    <>
      <AuthProvider>
        <ReduxProvider>
          <ThemeProvider>
            <PrivyProvider>
              <>
                {children}
                <BackgroundTask />
              </>
            </PrivyProvider>
          </ThemeProvider>
        </ReduxProvider>
      </AuthProvider>
    </>
  )
}
