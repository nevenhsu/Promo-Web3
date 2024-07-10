'use client'

import { useState, useEffect } from 'react'
import { useWallet } from '@/wallet/hooks/useWallet'
import { useSmartAccount } from '@/wallet/hooks/useSmartAccount'
import { toChainId } from '@/wallet/utils/network'
import type { EIP1193Provider } from '@privy-io/react-auth'
import type { KernelProvider } from '@/wallet/hooks/useSmartAccount'

export type WalletProvider = EIP1193Provider | KernelProvider

export function useWalletProvider() {
  const wallet = useWallet()
  const chainId = toChainId(wallet?.chainId)
  const { kernelProvider, accountAddress } = useSmartAccount(chainId)

  const [provider, setProvider] = useState<WalletProvider>()
  const [walletAddress, setWalletAddress] = useState('')
  const [isSmartAccount, setIsSmartAccount] = useState(Boolean(accountAddress))

  const getProvider = async () => {
    try {
      if (kernelProvider) {
        setProvider(kernelProvider)
        setWalletAddress(accountAddress)
        setIsSmartAccount(true)
      } else if (wallet) {
        const provider = await wallet.getEthereumProvider()

        setProvider(provider)
        setWalletAddress(wallet.address)
        setIsSmartAccount(false)
      } else if (provider) {
        // clear
        setProvider(undefined)
        setWalletAddress('')
        setIsSmartAccount(false)
      }
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    if (wallet) {
      getProvider()
    }
  }, [wallet, kernelProvider])

  return { chainId, provider, walletAddress, isSmartAccount }
}
