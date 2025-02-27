import * as _ from 'lodash-es'
import { arbitrum, arbitrumSepolia } from 'viem/chains'
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
  [arbitrum.id]: [
    {
      chainId: arbitrum.id,
      name: 'USD Coin',
      symbol: 'USDC',
      decimals: 6,
      address: unifyAddress('0xaf88d065e77c8cc2239327c5edb3a432268e5831'),
      version: '2',
      icon: '/icons/usdc-token.svg',
      abi: ERC20.abi,
    },
  ],
  [arbitrumSepolia.id]: [
    {
      chainId: arbitrumSepolia.id,
      name: 'USD Coin',
      symbol: 'USDC',
      decimals: 6,
      address: unifyAddress('0x43660fBE273F7107C3f6Ce448a85f3C96a78367D'),
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
