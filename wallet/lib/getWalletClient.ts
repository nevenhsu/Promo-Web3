'use client'

import { createWalletClient, custom } from 'viem'
import { supportedChains } from '@/wallet/variables'
import type { Hash, WalletClient } from 'viem'
import type { EIP1193Provider } from '@privy-io/react-auth'

export function getWalletClient(
  chainId: number,
  provider: EIP1193Provider,
  account: Hash
): WalletClient | undefined {
  // set wallet client
  const chain = supportedChains.find(c => c.id === chainId)
  if (chain) {
    // https://viem.sh/docs/clients/wallet#optional-hoist-the-account
    const walletClient = createWalletClient({
      account,
      chain,
      transport: custom(provider),
    })

    return walletClient
  }
}
