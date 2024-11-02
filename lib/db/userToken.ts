import UserTokenModel from '@/models/userToken'
import TokenModel from '@/models/token'
import { getUserWallet } from '@/lib/db/userWallet'

export async function getUserToken(userId: string) {
  return UserTokenModel.findOne({ _user: userId })
}

export async function updateUserToken(
  userId: string,
  data: {
    name: string
    symbol: string
    cover: string
  },
  walletAddr?: string
) {
  const _data = { ...data, _wallet: '' }

  // Check if data exists
  const userToken = await getUserToken(userId)
  _data._wallet = userToken?._wallet.toString() || ''

  if (userToken) {
    const token = await TokenModel.find({ _userToken: userToken._id })
    if (token) {
      // Overwrite name and symbol if token exists
      _data.name = userToken.name
      _data.symbol = userToken.symbol
    }
  } else {
    // Check if wallet exists
    const wallet = walletAddr ? await getUserWallet(walletAddr) : null
    if (!wallet) {
      throw new Error('Wallet not found')
    }
    _data._wallet = wallet._id.toString()
  }

  const doc = await UserTokenModel.findOneAndUpdate(
    { _user: userId },
    { _user: userId, ..._data },
    { upsert: true, new: true }
  )

  return doc
}
