'use client'

import { useState, useEffect } from 'react'
import { useWallets } from '@privy-io/react-auth'
import { getWalletClient } from '@/wallet/lib/getWalletClient'
import { toChainId } from '@/wallet/utils/network'
import type { WalletClient, Hash } from 'viem'
import type { ConnectedWallet } from '@privy-io/react-auth'

// Get current wallet values from Web3Context
// instead of using this hook directly

export function useWallet() {
  const { wallets } = useWallets()
  const [walletClientType, _setWalletClientType] = useState('privy')
  const [walletClient, setWalletClient] = useState<WalletClient>()
  const [loading, setLoading] = useState(true)

  // Find the wallet by the walletClientType
  const wallet = wallets.find(wallet => wallet.walletClientType === walletClientType)
  const chainId = toChainId(wallet?.chainId)
  const walletClientTypes = wallets.map(wallet => wallet.walletClientType)
  const walletAddress: Hash | undefined = wallet?.address as any

  const setWalletClientType = (type: string) => {
    if (walletClientTypes.includes(type)) {
      _setWalletClientType(type)
    }
  }

  const setupWalletClient = async (wallet: ConnectedWallet, chainId: number) => {
    try {
      setLoading(true)
      const provider = await wallet.getEthereumProvider()
      setWalletClient(getWalletClient(chainId, provider, walletAddress!))
    } catch (err) {
      console.error(err)
      setWalletClient(undefined)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (wallet && chainId) {
      console.log('Current wallet:', wallet.address)
      setupWalletClient(wallet, chainId)
    }
  }, [wallet, chainId])

  return {
    wallet,
    walletAddress,
    walletClient,
    walletClientType,
    walletClientTypes,
    loading,
    setWalletClientType,
  }
}
