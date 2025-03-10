'use client'

import '@/utils/console'

import { ModalsProvider } from '@mantine/modals'
import ReduxProvider from '@/store/ReduxProvider'
import ThemeProvider from './ThemeProvider'
import PrivyProvider from '@/wallet/PrivyProvider'
import AuthProvider from './AuthProvider'
import { ReferralProvider } from '@/store/contexts/app/referralContext'
import { AirdropProvider } from '@/store/contexts/app/airdropContext'
import { ActivityProvider } from '@/store/contexts/app/activityContext'
import { TransactionProvider } from '@/store/contexts/app/transactionContext'
import { ActivityStatusProvider } from '@/store/contexts/app/activityStatusContext'
import { UserTokenProvider } from '@/store/contexts/app/userTokenContext'
import { TokenBalanceProvider } from '@/store/contexts/app/tokenBalanceContext'
import BackgroundTask from './BackgroundTask'

export default function Providers({ children }: React.PropsWithChildren) {
  return (
    <>
      <AuthProvider>
        <ReduxProvider>
          <ThemeProvider>
            <DataProviders>
              <PrivyProvider>
                <ModalsProvider modalProps={{ centered: true }}>
                  <>
                    {children}
                    <BackgroundTask />
                  </>
                </ModalsProvider>
              </PrivyProvider>
            </DataProviders>
          </ThemeProvider>
        </ReduxProvider>
      </AuthProvider>
    </>
  )
}

function DataProviders({ children }: React.PropsWithChildren) {
  return (
    <>
      <TokenBalanceProvider>
        <UserTokenProvider>
          <ReferralProvider>
            <ActivityProvider>
              <TransactionProvider>
                <AirdropProvider>
                  <ActivityStatusProvider>{children}</ActivityStatusProvider>
                </AirdropProvider>
              </TransactionProvider>
            </ActivityProvider>
          </ReferralProvider>
        </UserTokenProvider>
      </TokenBalanceProvider>
    </>
  )
}
