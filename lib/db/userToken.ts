import UserTokenModel from '@/models/userToken'
import type { UserWallet } from '@/models/userWallet'

export async function getUserTokens(userId: string) {
  const docs = await UserTokenModel.find({ _user: userId })
    .populate<{
      _wallet: UserWallet
    }>('_wallet')
    .lean()

  return docs
}

export async function updateUserToken(
  docId: string,
  data: Partial<{
    icon: string
  }>
) {
  const doc = await UserTokenModel.findOneAndUpdate({ _id: docId }, data, { new: true })

  return doc
}

export async function getExistingTokens(name: string, symbol: string) {
  const tokens = await UserTokenModel.find({ $or: [{ name }, { symbol }] }).lean()
  return tokens
}
