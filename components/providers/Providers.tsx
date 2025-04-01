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
import { CreatorActivityProvider } from '@/store/contexts/app/creator/activityContext'
import BackgroundTask from './BackgroundTask'

export default function Providers({ children }: React.PropsWithChildren) {
  return (
    <>
      <AuthProvider>
        <ReduxProvider>
          <ThemeProvider>
            <ModalsProvider modalProps={{ centered: true }}>
              <DataProviders>
                <PrivyProvider>
                  <Web3DataProviders>
                    <>
                      {children}
                      <BackgroundTask />
                    </>
                  </Web3DataProviders>
                </PrivyProvider>
              </DataProviders>
            </ModalsProvider>
          </ThemeProvider>
        </ReduxProvider>
      </AuthProvider>
    </>
  )
}

// DataProviders is above PrivyProvider
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

// Web3DataProviders is under PrivyProvider
function Web3DataProviders({ children }: React.PropsWithChildren) {
  return (
    <>
      <CreatorActivityProvider>{children}</CreatorActivityProvider>
    </>
  )
}
