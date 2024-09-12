'use client'

import * as _ from 'lodash-es'
import { getContract } from 'viem'
import type { WalletClient, GetContractReturnType, Hash } from 'viem'

export type Contracts = {
  [address: string]: GetContractReturnType<unknown[], WalletClient> | undefined
}

export type ContractData = {
  address: Hash
  abi: unknown[]
}

export function createContract(data: ContractData, client: WalletClient | undefined) {
  const chainId = client?.chain?.id

  if (!chainId) return

  // Create contract
  const { abi, address } = data
  const contract = getContract({
    abi,
    address,
    client,
  })

  return contract
}
