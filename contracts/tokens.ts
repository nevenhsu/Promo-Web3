type Erc20 = {
  name: string
  symbol: string
  decimal: number
  address: string
  icon: string
  isPermit: boolean
}

const MOCKT: Erc20 = {
  name: 'Mock Token',
  symbol: 'MOCKT',
  decimal: 18,
  address: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
  icon: '/icons/mock-token.svg',
  isPermit: true,
}

export const tokens = [MOCKT] as const
