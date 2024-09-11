'use client'

import * as _ from 'lodash-es'
import { useState, useEffect } from 'react'
import { getTokens } from '@/contracts/tokens'
import { getContract as createContract } from 'viem'
import { unifyAddress } from '@/wallet/utils/helper'
import type { WalletClient, GetContractReturnType } from 'viem'

export type Contracts = {
  [address: string]: GetContractReturnType<unknown[], WalletClient> | undefined
}

export function useContracts(walletClient?: WalletClient) {
  const [contracts, setContracts] = useState<Contracts>({})

  const getContract = (address: string) => {
    return _.get(contracts, [unifyAddress(address)])
  }

  const setupContracts = (client: WalletClient, chainId: number) => {
    // Token contracts
    const tokens = getTokens(chainId)
    const contracts: Contracts = {}
    _.forEach(tokens, token => {
      const { abi, address } = token
      const contract = createContract({
        abi,
        address,
        client,
      })

      contracts[unifyAddress(address)] = contract
    })
    setContracts(contracts)
  }

  useEffect(() => {
    const chainId = walletClient?.chain?.id
    if (walletClient && chainId) {
      setupContracts(walletClient, chainId)
    } else {
      setContracts({})
    }
  }, [walletClient])

  return { contracts, getContract }
}
