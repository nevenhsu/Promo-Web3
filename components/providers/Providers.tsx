'use client'

import '@/utils/console'

import { ModalsProvider } from '@mantine/modals'
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
            <ModalsProvider modalProps={{ size: 'lg' }}>
              <PrivyProvider>
                <>
                  {children}
                  <BackgroundTask />
                </>
              </PrivyProvider>
            </ModalsProvider>
          </ThemeProvider>
        </ReduxProvider>
      </AuthProvider>
    </>
  )
}
