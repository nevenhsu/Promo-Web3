import { getContract } from 'viem'
import { arbitrum, arbitrumSepolia } from 'viem/chains'
import { computeTokenAddress } from '@/lib/web3/computeTokenAddress'
import TokenManagerJson from './TokenManager.sol/TokenManager.json'
import ActivityManagerJson from './NonfungibleActivityManager.sol/NonfungibleActivityManager.json'
import clubTokenJson from '@/contracts/ClubToken.sol/ClubToken.json'
import type { Address, GetContractReturnType } from 'viem'
import type { TokenManager$Type } from './TokenManager.sol/TokenManager'
import type { ClubToken$Type } from './ClubToken.sol/ClubToken'
import type { NonfungibleActivityManager$Type } from './NonfungibleActivityManager.sol/NonfungibleActivityManager'
import type { WalletClient } from '@/types/wallet'

export type Manager = {
  chainId: number
  address: Address
}

const tokenManagers: { [id: string]: Manager } = {
  [arbitrumSepolia.id]: {
    chainId: arbitrumSepolia.id,
    address: '0x1431061a22a96E407bA64558dc3751cce1093711',
  },
}

const activityManagers: { [id: string]: Manager } = {
  [arbitrumSepolia.id]: {
    chainId: arbitrumSepolia.id,
    address: '0x1431061a22a96E407bA64558dc3751cce1093711',
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
    abi: TokenManagerJson.abi as any,
  })

  return contract
}

export const getActivityManager = (
  client: WalletClient
): GetContractReturnType<NonfungibleActivityManager$Type['abi']> => {
  const manager = activityManagers[client.chain!.id]
  if (!manager) {
    throw new Error(`Token manager not found for chain ${client.chain?.id}`)
  }

  const contract = getContract({
    client,
    address: manager.address,
    abi: ActivityManagerJson.abi as any,
  })

  return contract
}

export const getTokenContract = (
  client: WalletClient,
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
    abi: clubTokenJson.abi as any,
  })

  return contract
}
