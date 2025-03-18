import * as _ from 'lodash-es'
import { base, baseSepolia, arbitrumSepolia } from 'viem/chains'
import ERC20 from './abi/ERC20.json'
import { unifyAddress } from '@/wallet/utils/helper'
import type { Hash } from 'viem'

export type ETH = {
  name: 'Ethereum'
  symbol: 'ETH'
  decimals: 18
  icon: '/icons/eth.svg'
  isNative: true
}

export type Erc20 = {
  chainId: number
  name: string
  symbol: string
  decimals: number
  address: Hash
  version: string
  icon: string
  abi: any[]
}

export type Token = ETH | Erc20

export const eth: ETH = {
  name: 'Ethereum',
  symbol: 'ETH',
  decimals: 18,
  icon: '/icons/eth.svg',
  isNative: true,
}

export const tokens: { [id: string]: Erc20[] } = {
  [base.id]: [
    {
      chainId: base.id,
      name: 'USD Coin',
      symbol: 'USDC',
      decimals: 6,
      address: unifyAddress('0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'),
      version: '2',
      icon: '/icons/usdc-token.svg',
      abi: ERC20.abi,
    },
  ],
  [baseSepolia.id]: [
    {
      chainId: baseSepolia.id,
      name: 'USD Coin',
      symbol: 'USDC',
      decimals: 6,
      address: unifyAddress('0x43660fbe273f7107c3f6ce448a85f3c96a78367d'),
      version: '2',
      icon: '/icons/usdc-token.svg',
      abi: ERC20.abi,
    },
  ],
  [arbitrumSepolia.id]: [
    {
      chainId: baseSepolia.id,
      name: 'USD Coin',
      symbol: 'USDC',
      decimals: 6,
      address: unifyAddress('0x7e47449dfacaa7f27e48964f33e995d16a65d3cf'),
      version: '2',
      icon: '/icons/usdc-token.svg',
      abi: ERC20.abi,
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

export function isErc20(token: object): token is Erc20 {
  return token && 'address' in token
}

export function isETH(token: object): token is ETH {
  return token && 'isNative' in token
}

export function getTokenInfo(symbol: string) {
  switch (symbol) {
    case 'ETH':
      return { name: 'Ethereum', icon: '/icons/eth.svg' }
    case 'USDC':
      return { name: 'USD Coin', icon: '/icons/usdc-token.svg' }
    default:
      return { name: 'Not Found', icon: '/icons/token.svg' }
  }
}
