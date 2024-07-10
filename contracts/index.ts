import { Erc20Permit__factory, type Erc20Permit } from './typechain-types'
import { tokens as _tokens } from './tokens'
import { unifyAddress } from '@/wallet/utils/helper'
import type { Signer } from 'ethers'

export type Tokens = { [address: string]: Erc20Permit | undefined }

export const getTokens = (chainId: number, signer: Signer) => {
  const tokens: Tokens = {}

  _tokens
    .filter(o => o.chainId === chainId)
    .map(o => {
      tokens[unifyAddress(o.address)] = new Erc20Permit__factory(signer).attach(
        o.address
      ) as Erc20Permit
    })

  return tokens
}
