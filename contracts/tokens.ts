export type Erc20 = {
  name: string
  symbol: string
  decimal: number
  address: string
  logo: string
}

type Tokens = {
  [symbol: string]: Erc20
}

const MOCKT: Erc20 = {
  name: 'Mock Token',
  symbol: 'MOCKT',
  decimal: 18,
  address: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
  logo: '',
}

export const permitTokens: Tokens = { MOCKT } as const
