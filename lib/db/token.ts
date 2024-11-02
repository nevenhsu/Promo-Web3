import TokenModel from '@/models/token'
import { tokenManagers } from '@/contracts'
import { computeTokenAddress } from '@/contracts/computeTokenAddress'
import type { TUserToken } from '@/models/userToken'

export async function getTokens(userTokenId: string) {
  return TokenModel.find({ _userToken: userTokenId }).lean()
}

export async function saveToken(userToken: TUserToken, chainId: number) {
  const _userToken = userToken._id.toString()
  const manager = tokenManagers[chainId]
  const owner = userToken._wallet.address

  if (!manager || !manager.address) {
    throw new Error(`Token manager not found for chain ${chainId}`)
  }

  if (!owner) {
    throw new Error('Token owner wallet not found')
  }

  const tokens = await getTokens(_userToken)
  const token = tokens.find(t => t.chainId === chainId)
  if (token) {
    return token
  }

  const contractAddr = computeTokenAddress({
    contract: manager.address,
    owner,
  })

  const doc = await TokenModel.findOneAndUpdate(
    { _userToken, chainId },
    { _userToken, chainId, contractAddr },
    { upsert: true, new: true }
  )

  return doc
}
