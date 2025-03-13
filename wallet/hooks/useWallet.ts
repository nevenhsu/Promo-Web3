'use client'

import { useState, useEffect } from 'react'
import { useWallets } from '@privy-io/react-auth'
import { getWalletClient } from '@/wallet/lib/getWalletClient'
import { toChainId } from '@/wallet/utils/network'
import { useAppSelector, useAppDispatch } from '@/hooks/redux'
import { setWalletLoading } from '@/store/slices/wallet'
import type { Hash } from 'viem'
import type { ConnectedWallet } from '@privy-io/react-auth'
import type { WalletClient } from '@/types/wallet'

// Get current state from Web3Context
// instead of using this hook directly

export function useWallet() {
  const dispatch = useAppDispatch()

  const { walletClientType } = useAppSelector(state => state.wallet)
  const { wallets } = useWallets()
  const [walletClient, setWalletClient] = useState<WalletClient>()

  // Find the wallet by the walletClientType
  const wallet = wallets.find(wallet => wallet.walletClientType === walletClientType)
  const chainId = toChainId(wallet?.chainId)
  const walletAddress: Hash | undefined = wallet?.address as any

  const setupWalletClient = async (wallet: ConnectedWallet, chainId: number) => {
    try {
      dispatch(setWalletLoading(true))
      const provider = await wallet.getEthereumProvider()
      setWalletClient(getWalletClient(chainId, provider, walletAddress!))
    } catch (err) {
      console.error(err)
      setWalletClient(undefined)
    } finally {
      dispatch(setWalletLoading(false))
    }
  }

  useEffect(() => {
    if (wallet && chainId) {
      console.log('EOA wallet:', wallet.address)
      setupWalletClient(wallet, chainId)
    }
  }, [wallet, chainId])

  return {
    wallet,
    walletClient,
  }
}
