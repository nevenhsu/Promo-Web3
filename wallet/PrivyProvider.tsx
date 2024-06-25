import { PrivyProvider } from '@privy-io/react-auth'
import { ContractProvider } from './ContractContext'
import { defaultChain, supportedChains } from './variables'

export default function MyPrivyProvider({ children }: React.PropsWithChildren) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID}
      config={{
        defaultChain,
        supportedChains,
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
        appearance: {
          // theme: publicEnv.defaultColorScheme,
        },
      }}
    >
      <ContractProvider>{children}</ContractProvider>
    </PrivyProvider>
  )
}
