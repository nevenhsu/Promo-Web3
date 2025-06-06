import UserTokenModel from '@/models/userToken'
import { uploadImage } from '@/lib/cloudinary'
import { isImageURI } from '@/utils/helper'
import type { UserWallet } from '@/models/userWallet'

export async function getUserTokens(userId: string) {
  const docs = await UserTokenModel.find({ _user: userId })
    .populate<{
      _wallet: UserWallet
    }>('_wallet')
    .lean()

  return docs.map(o => ({ ...o, decimals: 6 }))
}

export async function uploadTokenIcon(userId: string, name: string, iconURI: string) {
  // upload image to GCP
  if (isImageURI(iconURI)) {
    const path = `images/${userId}`
    const fileName = `token-${name}`
    const url = await uploadImage(iconURI, path, fileName, { width: 80, height: 80 })
    if (!url) {
      throw new Error('Failed to upload token cover')
    }
    return url
  }
}

export async function getUserToken(docId: string) {
  const doc = await UserTokenModel.findOne({ _id: docId }).lean()

  return doc
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

export async function getExistingTokens(value: { name: string; symbol: string; chainId: number }) {
  const { name, symbol, chainId } = value
  const tokens = await UserTokenModel.find({ chainId, $or: [{ name }, { symbol }] }).lean()
  return tokens
}

export async function getTokenBySymbol(value: { symbol: string; chainId: number }) {
  const { symbol, chainId } = value
  const token = await UserTokenModel.findOne({ chainId, symbol }).lean()
  return token
}
