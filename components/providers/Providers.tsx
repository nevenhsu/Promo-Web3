'use client'

import '@/utils/console'

import ReduxProvider from '@/store/ReduxProvider'
import ThemeProvider from './ThemeProvider'
import PrivyProvider from '@/wallet/PrivyProvider'
import AuthProvider from './AuthProvider'
import { ReferralProvider } from '@/store/contexts/app/referralContext'
import { ActivityProvider } from '@/store/contexts/app/activityContext'
import { TransactionProvider } from '@/store/contexts/app/transactionContext'
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
      <ReferralProvider>
        <ActivityProvider>
          <TransactionProvider>{children}</TransactionProvider>
        </ActivityProvider>
      </ReferralProvider>
    </>
  )
}
