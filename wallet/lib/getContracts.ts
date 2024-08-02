'use client'

import * as _ from 'lodash-es'
import { getTokens } from '@/contracts/tokens'
import { getContract as createContract } from 'viem'
import { unifyAddress } from '@/wallet/utils/helper'
import type { WalletClient, GetContractReturnType } from 'viem'

export type Contracts = {
  [address: string]: GetContractReturnType<unknown[], WalletClient> | undefined
}

export function getContracts(chainId: number, walletClient: WalletClient): Contracts {
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

    contracts[unifyAddress(address)] = contract
  })

  return contracts
}

export function getContract(address: string, contracts?: Contracts) {
  return _.get(contracts, [unifyAddress(address)])
}
