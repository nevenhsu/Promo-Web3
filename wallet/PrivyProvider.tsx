import { PrivyProvider } from '@privy-io/react-auth'
import { Web3Provider } from './Web3Context'
import { TxProvider } from './TxContext'
import { defaultChain, supportedChains } from './variables'
import { publicEnv } from '@/utils/env'
import { colors } from '@/theme/colors'

export default function MyPrivyProvider({ children }: React.PropsWithChildren) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID}
      config={{
        defaultChain,
        supportedChains,
        loginMethods: ['email', 'wallet', 'google', 'twitter'],
        embeddedWallets: {
          createOnLogin: 'all-users',
          showWalletUIs: false,
        },
        appearance: {
          theme: publicEnv.defaultColorScheme,
          accentColor: colors.orange[5] as `#${string}`,
          logo: `${publicEnv.baseUrl}/logo.svg`,
        },
        legal: {
          termsAndConditionsUrl: `${publicEnv.baseUrl}/page/terms`,
          privacyPolicyUrl: `${publicEnv.baseUrl}/page/privacy-policy`,
        },
      }}
    >
      <Web3Provider>
        <TxProvider>{children}</TxProvider>
      </Web3Provider>
    </PrivyProvider>
  )
}
