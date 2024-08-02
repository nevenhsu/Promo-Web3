'use client'

import type { EIP1193Provider } from '@privy-io/react-auth'
import type { KernelProvider, SmartAccountValues } from '@/wallet/lib/getSmartAccount'
import type { Hash } from 'viem'
import type { ConnectedWallet } from '@privy-io/react-auth'

export type WalletProvider = EIP1193Provider | KernelProvider

export type WalletProviderValues = {
  provider: WalletProvider
  walletAddress: Hash
  isSmartAccount: boolean
}

export async function getWalletProvider(
  wallet: ConnectedWallet,
  smartAccountValues?: SmartAccountValues
): Promise<WalletProviderValues> {
  if (smartAccountValues) {
    const { kernelProvider, smartAccountAddress } = smartAccountValues
    return { provider: kernelProvider, walletAddress: smartAccountAddress, isSmartAccount: true }
  }

  const provider = await wallet.getEthereumProvider()
  return { provider, walletAddress: wallet.address as Hash, isSmartAccount: false }
}
