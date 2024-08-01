'use client'

import { useEffect, useState, useCallback } from 'react'
import { getTokenContracts } from '@/contracts'
import { Web3Provider } from '@ethersproject/providers'
import { unifyAddress } from '@/wallet/utils/helper'
import type { useWalletProvider, WalletProvider } from '@/wallet/hooks/useWalletProvider'
import type { Erc20Permit } from '@/contracts/typechain-types'

type WalletProviderValues = ReturnType<typeof useWalletProvider>

type Contract = Erc20Permit // | OtherContractType
type Contracts = { [address: string]: Contract | undefined }

type ContractParams = {
  chainId?: number
  walletProviderValues: WalletProviderValues
}

export function useContracts({ chainId, walletProviderValues }: ContractParams) {
  const [ready, setReady] = useState(false) // ready to use contracts
  const [contracts, setContracts] = useState<Contracts>({})
  const { provider } = walletProviderValues

  const getContract = useCallback(
    (address?: string) => {
      if (!address) return
      return contracts[unifyAddress(address)]
    },
    [contracts]
  )

  const getContracts = async (provider: WalletProvider) => {
    try {
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
    } catch (err) {
      // TODO: handle error
      console.error(err)
      setContracts({})
      setReady(false)
    }
  }

  useEffect(() => {
    setReady(false)

    if (provider) {
      getContracts(provider)
    } else {
      setContracts({})
      setReady(false)
    }
  }, [provider]) // assuming signer is a dependency

  return { contracts, ready, getContract }
}
