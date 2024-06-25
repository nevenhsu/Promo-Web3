'use client'

import { useState, useEffect } from 'react'
import { useWallet } from '@/wallet/hooks/useWallet'
import { useSmartAccount } from '@/wallet/hooks/useSmartAccount'
import { toChainId } from '@/wallet/utils/network'
import type { EIP1193Provider } from '@privy-io/react-auth'
import type { AccountClient } from '@/wallet/hooks/useSmartAccount'

export type WalletProvider = EIP1193Provider | AccountClient

export function useWalletProvider() {
  const wallet = useWallet()
  const accountClient = useSmartAccount(toChainId(wallet?.chainId))

  const [provider, setProvider] = useState<WalletProvider | undefined>()
  const [walletAddress, setWalletAddress] = useState('')

  const getProvider = async () => {
    try {
      if (accountClient) {
        setProvider(accountClient)
        setWalletAddress(accountClient.account.address)
      } else if (wallet) {
        const provider = await wallet.getEthereumProvider()
        setProvider(provider)
        setWalletAddress(wallet.address)
      } else if (provider) {
        // clear provider
        setProvider(undefined)
      }
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    if (wallet) {
      getProvider()
    }
  }, [wallet, accountClient])

  return { provider, walletAddress }
}
