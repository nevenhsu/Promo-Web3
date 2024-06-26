import { Erc20Permit, Erc20Permit__factory } from './typechain-types'
import { tokens as _tokens } from './tokens'
import type { Signer } from 'ethers'

export type Tokens = { [symbol: string]: Erc20Permit | undefined }

export type Contracts = {
  tokens: Tokens
}

export const getTokens = (chainId: number, signer: Signer) => {
  const tokens: Tokens = {}

  _tokens
    .filter(o => o.chainId === chainId)
    .map(o => {
      tokens[o.symbol] = new Erc20Permit__factory(signer).attach(o.address) as Erc20Permit
    })

  return tokens
}
