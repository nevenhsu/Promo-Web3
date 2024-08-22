import * as _ from 'lodash-es'
import { baseSepolia, arbitrum, arbitrumSepolia } from 'viem/chains'
import ERC20 from '@/contracts/abi/ERC20.json'
import Erc20Permit from '@/contracts/abi/Erc20Permit.json'
import { unifyAddress } from '@/wallet/utils/helper'
import type { Hash } from 'viem'

export type Erc20 = {
  chainId: number
  name: string
  symbol: string
  decimal: number
  address: Hash
  version: string
  isPermit: boolean
  icon: string
  abi: unknown[]
}

export const tokens: { [id: string]: Erc20[] } = {
  [baseSepolia.id]: [
    {
      chainId: baseSepolia.id,
      name: 'USDC',
      symbol: 'USDC',
      decimal: 6,
      address: unifyAddress('0x036CbD53842c5426634e7929541eC2318f3dCF7e'),
      version: '2',
      isPermit: true,
      icon: '/icons/usdc-token.svg',
      abi: Erc20Permit.abi,
    },
  ],
  [arbitrum.id]: [
    {
      chainId: arbitrum.id,
      name: 'USD Coin',
      symbol: 'USDC',
      decimal: 6,
      address: unifyAddress('0xaf88d065e77c8cc2239327c5edb3a432268e5831'),
      version: '2',
      isPermit: true,
      icon: '/icons/usdc-token.svg',
      abi: Erc20Permit.abi,
    },
  ],
  [arbitrumSepolia.id]: [
    {
      chainId: arbitrumSepolia.id,
      name: 'USD Coin',
      symbol: 'USDC',
      decimal: 6,
      address: unifyAddress('0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d'),
      version: '2',
      isPermit: true,
      icon: '/icons/usdc-token.svg',
      abi: Erc20Permit.abi,
    },
    {
      chainId: arbitrumSepolia.id,
      name: 'SharX',
      symbol: 'SHX',
      decimal: 18,
      address: unifyAddress('0x52b1010586Bc3861d4B578774Be87AD5919Ef804'),
      version: '1',
      isPermit: true,
      icon: '/icons/sharx-token.svg',
      abi: Erc20Permit.abi,
    },
  ],
} as const

export const symbols = _.uniq(_.flatMap(Object.values(tokens), o => o.map(o => o.symbol)))
export const allTokens = _.flatMap(Object.values(tokens), o => o)

export function getTokens(chainId?: number) {
  if (!chainId) return []
  return tokens[chainId] || []
}

export function getToken(chainId?: number, symbol?: string) {
  const tokens = getTokens(chainId)
  return tokens.find(o => o.chainId === chainId && o.symbol === symbol)
}
