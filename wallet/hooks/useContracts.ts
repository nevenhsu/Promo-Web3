'use client'

import { useEffect, useState } from 'react'
import { useWallet } from '@/wallet/hooks/useWallet'
import { getTokens, type Contracts } from '@/contracts'

export default function useContracts() {
  const [contracts, setContracts] = useState<Contracts>({ tokens: {} })

  const wallet = useWallet()

  const getContracts = async () => {
    if (!wallet) return

    const provider = await wallet.getEthersProvider()
    const signer = await provider.getSigner()
    const tokens = getTokens(signer)

    setContracts({
      tokens,
    })
  }

  useEffect(() => {
    if (wallet) {
      getContracts()
    }
  }, [wallet]) // assuming signer is a dependency

  return contracts
}
