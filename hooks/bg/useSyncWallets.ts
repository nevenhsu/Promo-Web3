'use client'

import { useEffect } from 'react'
import { useWallet } from '@/wallet/hooks/useWallet'
import { useWeb3 } from '@/wallet/Web3Context'
import { updateWallet } from '@/services/userWallet'
import { useLoginStatus } from '@/hooks/useLoginStatus'

// save wallets to db

export function useSyncWallets() {
  const wallet = useWallet()
  const { walletProviderValues } = useWeb3()
  const { bothAuth } = useLoginStatus()

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
    if (walletProviderValues && walletProviderValues.isSmartAccount) {
      updateWallet({
        address: walletProviderValues.walletAddress,
        walletClientType: 'zerodev',
        connectorType: 'embedded',
        supported: true,
      }).catch(console.error)
    }
  }, [bothAuth, wallet, walletProviderValues])

  return null
}
