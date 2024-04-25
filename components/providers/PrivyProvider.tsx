// Replace this with any of the networks listed at https://wagmi.sh/core/chains#supported-chains
import { base } from '@wagmi/chains'
import { PrivyProvider } from '@privy-io/react-auth'
import { ZeroDevProvider } from '@zerodev/privy'
import { colors } from '@/theme/colors'

export default function MyPrivyProvider({ children }: React.PropsWithChildren) {
  return (
    <ZeroDevProvider projectId={process.env.NEXT_PUBLIC_ZERODEV_PROJECT_ID}>
      <PrivyProvider
        appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID}
        config={{
          defaultChain: base,
          supportedChains: [base],
          embeddedWallets: {
            createOnLogin: 'users-without-wallets',
          },
          appearance: {
            // theme: env.defaultColorScheme,
            accentColor: colors.dark[5] as `#${string}`,
          },
        }}
      >
        {children}
      </PrivyProvider>
    </ZeroDevProvider>
  )
}
