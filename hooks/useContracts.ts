'use client'

import { useEffect, useState } from 'react'
import { useWallets } from '@privy-io/react-auth'
import { getToken, type Contracts } from '@/contracts'

export default function useContracts() {
  const [contracts, setContracts] = useState<Contracts>()

  const { wallets } = useWallets()
  const [wallet] = wallets

  const getContracts = async () => {
    const provider = await wallet.getEthersProvider()
    const signer = await provider.getSigner()
    const token = getToken(signer)

    setContracts({
      token,
    })
  }

  useEffect(() => {
    if (wallet) {
      getContracts()
    }
  }, [wallet]) // assuming signer is a dependency

  return contracts
}
