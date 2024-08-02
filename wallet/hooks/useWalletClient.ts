'use client'

import { useEffect, useState } from 'react'
import { createWalletClient, custom, type WalletClient } from 'viem'
import { supportedChains } from '@/wallet/variables'
import type { useWalletProvider } from '@/wallet/hooks/useWalletProvider'

type WalletProviderValues = ReturnType<typeof useWalletProvider>
type WalletClientParams = {
  chainId?: number
  walletProviderValues: WalletProviderValues
}

export function useWalletClient({ walletProviderValues, chainId }: WalletClientParams) {
  const { provider, walletAddress } = walletProviderValues
  const [walletClient, setWalletClient] = useState<WalletClient>()

  useEffect(() => {
    const chain = supportedChains.find(c => c.id === chainId)
    if (chain && provider && walletAddress) {
      // https://viem.sh/docs/clients/wallet#optional-hoist-the-account
      const client = createWalletClient({
        account: walletAddress,
        chain,
        transport: custom(provider),
      })
      setWalletClient(client)
    } else {
      setWalletClient(undefined)
    }
  }, [provider, chainId])

  return { walletClient }
}
