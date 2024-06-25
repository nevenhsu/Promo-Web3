'use client'

import { useEffect, useState } from 'react'
import { getTokens, type Contracts } from '@/contracts'
import { Web3Provider } from '@ethersproject/providers'
import { useWalletProvider } from '@/wallet/hooks/useWalletProvider'

export default function useContracts() {
  const [contracts, setContracts] = useState<Contracts>({ tokens: {} })
  const { provider, walletAddress } = useWalletProvider()

  const getContracts = async () => {
    if (!provider) return

    // The "any" network will allow spontaneous network changes
    const ethersProvider = new Web3Provider(provider, 'any')
    const signer = await ethersProvider.getSigner()
    const tokens = getTokens(signer)

    setContracts({
      tokens,
    })
  }

  useEffect(() => {
    if (provider) {
      getContracts()
    }
  }, [provider]) // assuming signer is a dependency

  return { contracts, walletAddress }
}
