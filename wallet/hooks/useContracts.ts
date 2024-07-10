'use client'

import { useEffect, useState } from 'react'
import { getTokens } from '@/contracts'
import { Web3Provider } from '@ethersproject/providers'
import { useWalletProvider } from '@/wallet/hooks/useWalletProvider'
import type { Erc20Permit } from '@/contracts/typechain-types'

export type Contract = Erc20Permit // | OtherContractType
export type Contracts = { [address: string]: Contract | undefined }

export default function useContracts() {
  const [contracts, setContracts] = useState<Contracts>({})
  const { chainId, provider, walletAddress, isSmartAccount } = useWalletProvider()

  const getContracts = async () => {
    if (!chainId || !provider) return

    // The "any" network will allow spontaneous network changes
    const ethersProvider = new Web3Provider(provider, 'any')
    const signer = await ethersProvider.getSigner()
    // @ts-expect-error JsonRpcSigner does not exist on type Signer
    const tokens = getTokens(chainId, signer)

    setContracts({
      ...tokens,
    })
  }

  useEffect(() => {
    if (chainId && provider) {
      getContracts()
    } else {
      setContracts({})
    }
  }, [chainId, provider, walletAddress]) // assuming signer is a dependency

  return { chainId, contracts, walletAddress, isSmartAccount }
}
