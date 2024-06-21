import { Erc20Permit, Erc20Permit__factory } from './typechain-types'
import { tokens as _tokens } from './tokens'

export type Tokens = { [symbol: string]: Erc20Permit | undefined }

export type Contracts = {
  tokens: Tokens
}

export const getTokens = (signer: any) => {
  const tokens: Tokens = {}

  _tokens.map(o => {
    tokens[o.symbol] = new Erc20Permit__factory(signer).attach(o.address) as Erc20Permit
  })

  return tokens
}
