'use client'

import { useState, useEffect } from 'react'
import { useWallet } from '@/wallet/hooks/useWallet'
import type { useSmartAccount } from '@/wallet/hooks/useSmartAccount'
import type { EIP1193Provider } from '@privy-io/react-auth'
import type { KernelProvider } from '@/wallet/hooks/useSmartAccount'

export type WalletProvider = EIP1193Provider | KernelProvider

type SmartAccountValues = ReturnType<typeof useSmartAccount>

export function useWalletProvider({ kernelProvider, smartAccountAddress }: SmartAccountValues) {
  const wallet = useWallet()

  const [provider, setProvider] = useState<WalletProvider>()
  const [walletAddress, setWalletAddress] = useState<string>()
  const [isSmartAccount, setIsSmartAccount] = useState(Boolean(smartAccountAddress))

  const getProvider = async () => {
    try {
      if (kernelProvider) {
        setProvider(kernelProvider)
        setWalletAddress(smartAccountAddress)
        setIsSmartAccount(true)
      } else if (wallet) {
        const provider = await wallet.getEthereumProvider()

        setProvider(provider)
        setWalletAddress(wallet.address)
        setIsSmartAccount(false)
      } else if (provider) {
        // clear
        setProvider(undefined)
        setWalletAddress(undefined)
        setIsSmartAccount(false)
      }
    } catch (err) {
      // TODO: handle error
      console.error(err)
    }
  }

  useEffect(() => {
    getProvider()
  }, [wallet, kernelProvider])

  return { provider, walletAddress, isSmartAccount }
}
