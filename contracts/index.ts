import { getContract } from 'viem'
import { base, baseSepolia, arbitrumSepolia } from 'viem/chains'
import { computeTokenAddress } from '@/lib/web3/computeTokenAddress'
import TokenManagerJson from './TokenManager.sol/TokenManager.json'
import ActivityManagerJson from './NonfungibleActivityManager.sol/NonfungibleActivityManager.json'
import clubTokenJson from '@/contracts/ClubToken.sol/ClubToken.json'
import { unifyAddress } from '@/wallet/utils/helper'
import type { Address } from 'viem'
import type { TokenManager$Type } from './TokenManager.sol/TokenManager'
import type { ClubToken$Type } from './ClubToken.sol/ClubToken'
import type { NonfungibleActivityManager$Type } from './NonfungibleActivityManager.sol/NonfungibleActivityManager'
import type { Web3Client, GetContractReturnType } from '@/types/wallet'

export type Manager = {
  chainId: number
  address: Address
}

export const tokenManagers: { [id: string]: Manager } = {
  [baseSepolia.id]: {
    chainId: baseSepolia.id,
    address: unifyAddress('0xB44a6Ccee1D22B3998ea30CA5a373A7C2C12D39e'),
  },
  [arbitrumSepolia.id]: {
    chainId: arbitrumSepolia.id,
    address: unifyAddress('0xe431b55750440ee42a28f431a8da0ac844f9cb61'),
  },
}

export const activityManagers: { [id: string]: Manager } = {
  [baseSepolia.id]: {
    chainId: baseSepolia.id,
    address: unifyAddress('0xe431b55750440ee42a28f431a8da0ac844f9cb61'),
  },
}

export const getTokenManager = (
  client: Web3Client
): GetContractReturnType<TokenManager$Type['abi']> => {
  const manager = tokenManagers[client.chain!.id]
  if (!manager) {
    throw new Error(`Token manager not found for chain ${client.chain?.id}`)
  }

  const contract = getContract({
    client,
    address: manager.address,
    abi: TokenManagerJson.abi,
  }) as any

  return contract
}

export const getActivityManager = (
  client: Web3Client
): GetContractReturnType<NonfungibleActivityManager$Type['abi']> => {
  const manager = activityManagers[client.chain!.id]
  if (!manager) {
    throw new Error(`Token manager not found for chain ${client.chain?.id}`)
  }

  const contract = getContract({
    client,
    address: manager.address,
    abi: ActivityManagerJson.abi,
  }) as any

  return contract
}

export const getTokenContract = (
  client: Web3Client,
  owner: Address
): GetContractReturnType<ClubToken$Type['abi']> => {
  const manager = tokenManagers[client.chain!.id]
  if (!manager) {
    throw new Error(`Token manager not found for chain ${client.chain?.id}`)
  }

  const tokenAddress = computeTokenAddress({
    contract: manager.address,
    owner,
  })

  const contract = getContract({
    client,
    address: tokenAddress,
    abi: clubTokenJson.abi,
  }) as any

  return contract
}

export const getTokenContractByAddress = (
  client: Web3Client,
  address: Address
): GetContractReturnType<ClubToken$Type['abi']> => {
  const manager = tokenManagers[client.chain!.id]
  if (!manager) {
    throw new Error(`Token manager not found for chain ${client.chain?.id}`)
  }

  const contract = getContract({
    client,
    address,
    abi: clubTokenJson.abi,
  }) as any

  return contract
}
