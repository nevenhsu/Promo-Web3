import { PrivyProvider } from '@privy-io/react-auth'
import { Web3Provider } from './Web3Context'
import { TxProvider } from './TxContext'
import { defaultChain, supportedChains } from './variables'

export default function MyPrivyProvider({ children }: React.PropsWithChildren) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID}
      config={{
        defaultChain,
        supportedChains,
        embeddedWallets: {
          createOnLogin: 'all-users',
        },
        appearance: {
          // theme: publicEnv.defaultColorScheme,
        },
      }}
    >
      <Web3Provider>
        <TxProvider>{children}</TxProvider>
      </Web3Provider>
    </PrivyProvider>
  )
}
