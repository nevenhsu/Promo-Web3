import { Erc20Permit__factory, type Erc20Permit } from './typechain-types'
import { getTokens as _getTokens } from './tokens'
import type { Signer } from 'ethers'

export const getTokenContracts = (chainId: number, signer: Signer) => {
  const results = _getTokens(chainId).map(token => {
    const contract = new Erc20Permit__factory(signer).attach(token.address) as Erc20Permit

    return { contract, token }
  })

  return results
}
