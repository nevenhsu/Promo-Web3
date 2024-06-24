// Replace this with any of the networks listed at https://wagmi.sh/core/chains#supported-chains
import { base, hardhat } from 'viem/chains'
import { PrivyProvider } from '@privy-io/react-auth'
import { ZeroDevProvider } from '@zerodev/privy'
import { ContractProvider } from './ContractContext'
import { publicEnv } from '@/utils/env'

const chain = publicEnv.isProd ? base : hardhat

export default function MyPrivyProvider({ children }: React.PropsWithChildren) {
  return (
    <ZeroDevProvider projectId={process.env.NEXT_PUBLIC_ZERODEV_PROJECT_ID}>
      <PrivyProvider
        appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID}
        config={{
          defaultChain: chain,
          supportedChains: [chain],
          embeddedWallets: {
            createOnLogin: 'users-without-wallets',
          },
          appearance: {
            // theme: env.defaultColorScheme,
          },
        }}
      >
        <ContractProvider>{children}</ContractProvider>
      </PrivyProvider>
    </ZeroDevProvider>
  )
}
