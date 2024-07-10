export type Erc20 = {
  chainId: number
  name: string
  symbol: string
  decimal: number
  address: string
  version: string
  isPermit: boolean
  icon: string
}

const MOCKT: Erc20 = {
  chainId: 31337, // hardhat
  name: 'Mock Token',
  symbol: 'MOCKT',
  decimal: 18,
  address: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
  version: '',
  isPermit: true,
  icon: '/icons/mock-token.svg',
}

const USDC: Erc20 = {
  chainId: 84532, // Base Sepolia
  name: 'USDC',
  symbol: 'USDC',
  decimal: 6,
  address: '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
  version: '2',
  isPermit: true,
  icon: '/icons/usdc-token.svg',
}

export const tokens = [MOCKT, USDC] as const

export function getTokens(chainId?: number) {
  if (!chainId) return []
  return tokens.filter(o => o.chainId === chainId)
}

export function getToken(chainId?: number, symbol?: string) {
  const tokens = getTokens(chainId)
  return tokens.find(o => o.chainId === chainId && o.symbol === symbol)
}
