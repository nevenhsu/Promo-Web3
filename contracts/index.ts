import { getContract } from 'viem'
import { arbitrum, arbitrumSepolia } from 'viem/chains'
import { computeTokenAddress } from '@/lib/web3/computeTokenAddress'
import TokenManagerJson from './TokenManager.sol/TokenManager.json'
import ActivityManagerJson from './NonfungibleActivityManager.sol/NonfungibleActivityManager.json'
import clubTokenJson from '@/contracts/ClubToken.sol/ClubToken.json'
import type { Address } from 'viem'
import type { TokenManager$Type } from './TokenManager.sol/TokenManager'
import type { ClubToken$Type } from './ClubToken.sol/ClubToken'
import type { NonfungibleActivityManager$Type } from './NonfungibleActivityManager.sol/NonfungibleActivityManager'
import type { WalletClient, PublicClient, GetContractReturnType } from '@/types/wallet'

export type Manager = {
  chainId: number
  address: Address
}

export const tokenManagers: { [id: string]: Manager } = {
  [arbitrumSepolia.id]: {
    chainId: arbitrumSepolia.id,
    address: '0xd8f490482caeb6fa7c8acd12e5b1ca556167c643',
  },
}

export const activityManagers: { [id: string]: Manager } = {
  [arbitrumSepolia.id]: {
    chainId: arbitrumSepolia.id,
    address: '0x811ae1947816113aa6c47df69a1db9efc242251e',
  },
}

export const getTokenManager = (
  client: WalletClient
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
  client: WalletClient | PublicClient
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
  client: WalletClient | PublicClient,
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
  client: WalletClient | PublicClient,
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
