import * as _ from 'lodash-es'
import { Erc20Permit, Erc20Permit__factory } from './typechain-types'
import { permitTokens } from './tokens'

export type PermitTokens = { [symbol: string]: Erc20Permit | undefined }

export type Contracts = {
  permitTokens?: PermitTokens
}

export const getPermitTokens = (signer: any) => {
  const tokens: PermitTokens = {}

  _.forEach(permitTokens, o => {
    tokens[o.symbol] = new Erc20Permit__factory(signer).attach(o.address) as Erc20Permit
  })

  return tokens
}
