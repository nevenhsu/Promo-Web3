'use client'

import * as _ from 'lodash-es'
import { getContract } from 'viem'
import type { WalletClient, GetContractReturnType, Hash, Abi } from 'viem'

export type Contracts = {
  [address: string]: GetContractReturnType<unknown[], WalletClient> | undefined
}

export type ContractData = {
  address?: Hash
  abi?: Abi
}

export function createContract(data: ContractData, client: WalletClient | undefined) {
  const { abi, address } = data
  if (!client || !abi || !address) return

  // Create contract
  const contract = getContract({
    abi,
    address,
    client,
  })

  return contract
}
