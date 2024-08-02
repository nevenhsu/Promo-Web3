'use client'

import * as _ from 'lodash-es'
import { useState, useEffect, useCallback } from 'react'
import { getTokens } from '@/contracts/tokens'
import { getContract as createContract } from 'viem'
import { unifyAddress } from '@/wallet/utils/helper'
import type { WalletClient, GetContractReturnType } from 'viem'

type UseBalanceParams = {
  chainId?: number
  walletClient?: WalletClient
}

type Contracts = {
  [address: string]: GetContractReturnType<unknown[], WalletClient> | undefined
}

export function useContracts({ chainId, walletClient }: UseBalanceParams) {
  const [contracts, setContracts] = useState<Contracts>({})
  const [ready, setReady] = useState(false)

  const getContract = useCallback(
    (address: string) => {
      return contracts[unifyAddress(address)]
    },
    [contracts]
  )

  useEffect(() => {
    setReady(false) // Reset ready state

    if (walletClient && chainId) {
      // Token contracts
      const tokens = getTokens(chainId)
      const contracts: Contracts = {}
      _.forEach(tokens, token => {
        const { abi, address } = token
        const contract = createContract({
          abi,
          address,
          client: walletClient,
        })

        // @ts-ignore
        contracts[unifyAddress(address)] = contract
      })
      setContracts(contracts)
      setReady(true)
    } else {
      setContracts({}) // Clear contracts
    }
  }, [walletClient, chainId])

  return { contracts, ready, getContract }
}
