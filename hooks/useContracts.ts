'use client'

import { useEffect, useState } from 'react'
import { useWallet } from '@/hooks/useWallet'
import { getPermitTokens, type Contracts } from '@/contracts'

export default function useContracts() {
  const [contracts, setContracts] = useState<Contracts>({})

  const wallet = useWallet()

  const getContracts = async () => {
    const provider = await wallet!.getEthersProvider()
    const signer = await provider.getSigner()
    const permitTokens = getPermitTokens(signer)

    setContracts({
      permitTokens,
    })
  }

  useEffect(() => {
    if (wallet) {
      getContracts()
    }
  }, [wallet]) // assuming signer is a dependency

  return contracts
}
