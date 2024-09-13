'use client'

import { useEffect } from 'react'
import { useWeb3 } from '@/wallet/Web3Context'
import { updateWallet } from '@/services/userWallet'
import { useLoginStatus } from '@/hooks/useLoginStatus'

// save wallets to db

export function useSyncWallets() {
  const { bothAuth } = useLoginStatus()
  const { walletValues, walletAddress, onSmartAccount } = useWeb3()
  const { wallet } = walletValues

  useEffect(() => {
    if (!bothAuth) return

    if (wallet) {
      updateWallet({
        address: wallet.address,
        walletClientType: wallet.walletClientType,
        connectorType: wallet.connectorType,
        supported: true,
      }).catch(console.error)
    }
    if (walletAddress && onSmartAccount) {
      updateWallet({
        address: walletAddress,
        walletClientType: 'zerodev',
        connectorType: 'embedded',
        supported: true,
      }).catch(console.error)
    }
  }, [bothAuth, wallet, walletAddress, onSmartAccount])

  return null
}
