'use client'

import { createWalletClient, custom, type WalletClient } from 'viem'
import { supportedChains } from '@/wallet/variables'
import type { WalletProviderValues } from '@/wallet/lib/getWalletProvider'

export function getWalletClient(
  chainId: number,
  walletProviderValues: WalletProviderValues
): WalletClient | undefined {
  const { provider, walletAddress } = walletProviderValues

  // set wallet client
  const chain = supportedChains.find(c => c.id === chainId)
  if (chain && provider && walletAddress) {
    // https://viem.sh/docs/clients/wallet#optional-hoist-the-account
    const walletClient = createWalletClient({
      account: walletAddress,
      chain,
      transport: custom(provider),
    })

    return walletClient
  }
}
