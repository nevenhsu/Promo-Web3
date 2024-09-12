'use client'

import * as _ from 'lodash-es'
import { useEffect, useState } from 'react'
import { useWeb3 } from '@/wallet/Web3Context'
import { getTokens } from '@/contracts/tokens'
import { getContract as createContract } from 'viem'
import { unifyAddress } from '@/wallet/utils/helper'
import type { WalletClient, GetContractReturnType } from 'viem'

export type Contracts = {
  [address: string]: GetContractReturnType<unknown[], WalletClient> | undefined
}

export function useContracts() {
  const { walletClient } = useWeb3()
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

    // Set contracts
    setContracts(contracts)
  }

  useEffect(() => {
    // clear contracts
    setContracts({})

    // setup contracts
    const chainId = walletClient?.chain?.id
    if (walletClient && chainId) {
      setupContracts(walletClient, chainId)
    }
  }, [walletClient])

  return { contracts, getContract }
}
