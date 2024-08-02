'use client'

import { useEffect, useState } from 'react'
import { createWalletClient, custom, type WalletClient } from 'viem'
import { supportedChains } from '@/wallet/variables'
import type { WalletProvider } from '@/wallet/hooks/useWalletProvider'

type WalletClientParams = { chainId?: number; provider?: WalletProvider }

export function useWalletClient({ provider, chainId }: WalletClientParams) {
  const [walletClient, setWalletClient] = useState<WalletClient>()

  useEffect(() => {
    const chain = supportedChains.find(c => c.id === chainId)
    if (provider && chain) {
      const client = createWalletClient({
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
