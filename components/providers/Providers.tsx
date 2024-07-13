'use client'

import '@/utils/console'

import ReduxProvider from '@/store/ReduxProvider'
import ThemeProvider from './ThemeProvider'
import PrivyProvider from '@/wallet/PrivyProvider'
import AuthProvider from './AuthProvider'
import { ReferralProvider } from '@/store/contexts/user/referralContext'
import BackgroundTask from './BackgroundTask'

export default function Providers({ children }: React.PropsWithChildren) {
  return (
    <>
      <AuthProvider>
        <ReduxProvider>
          <ThemeProvider>
            <PrivyProvider>
              <DataProviders>
                <>
                  {children}
                  <BackgroundTask />
                </>
              </DataProviders>
            </PrivyProvider>
          </ThemeProvider>
        </ReduxProvider>
      </AuthProvider>
    </>
  )
}

function DataProviders({ children }: React.PropsWithChildren) {
  return (
    <>
      <ReferralProvider>{children}</ReferralProvider>
    </>
  )
}
