import { baseSepolia, arbitrum, arbitrumSepolia } from 'viem/chains'
import ERC20 from '@/contracts/abi/ERC20.json'
import Erc20Permit from '@/contracts/abi/Erc20Permit.json'

export type Erc20 = {
  chainId: number
  name: string
  symbol: string
  decimal: number
  address: `0x${string}`
  version: string
  isPermit: boolean
  icon: string
  abi: Array<any>
}

export const tokens: { [id: string]: Erc20[] } = {
  [baseSepolia.id]: [
    {
      chainId: baseSepolia.id,
      name: 'USDC',
      symbol: 'USDC',
      decimal: 6,
      address: '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
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
      address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
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
      address: '0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d',
      version: '2',
      isPermit: true,
      icon: '/icons/usdc-token.svg',
      abi: Erc20Permit.abi,
    },
  ],
} as const

export function getTokens(chainId?: number) {
  if (!chainId) return []
  return tokens[chainId] || []
}

export function getToken(chainId?: number, symbol?: string) {
  const tokens = getTokens(chainId)
  return tokens.find(o => o.chainId === chainId && o.symbol === symbol)
}
