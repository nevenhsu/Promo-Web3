'use client'

import { useEffect, useState } from 'react'
import { getTokenContracts } from '@/contracts'
import { Web3Provider } from '@ethersproject/providers'
import { useWalletProvider } from '@/wallet/hooks/useWalletProvider'
import { unifyAddress } from '@/wallet/utils/helper'
import type { Erc20Permit } from '@/contracts/typechain-types'

export type Contract = Erc20Permit // | OtherContractType
export type Contracts = { [address: string]: Contract | undefined }

export default function useContracts() {
  const [ready, setReady] = useState(false) // ready to use contracts
  const [contracts, setContracts] = useState<Contracts>({})
  const { chainId, provider, walletAddress, isSmartAccount } = useWalletProvider()

  const getContracts = async () => {
    if (!chainId || !provider) return

    // The "any" network will allow spontaneous network changes
    const ethersProvider = new Web3Provider(provider, 'any')
    const signer = await ethersProvider.getSigner()

    // @ts-expect-error JsonRpcSigner does not exist on type Signer
    const tokenContracts = getTokenContracts(chainId, signer)

    const results: Contracts = {}
    tokenContracts.forEach(({ contract, token }) => {
      results[unifyAddress(token.address)] = contract
    })

    setContracts(results)
    setReady(true)
  }

  useEffect(() => {
    setReady(false)

    if (chainId && provider) {
      getContracts()
    } else {
      setContracts({})
      setReady(true)
    }
  }, [chainId, provider, walletAddress]) // assuming signer is a dependency

  const getContract = (address?: string) => {
    if (!address) return
    return contracts[unifyAddress(address)]
  }

  return { chainId, contracts, walletAddress, isSmartAccount, ready, getContract }
}
