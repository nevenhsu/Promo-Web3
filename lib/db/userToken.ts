import UserTokenModel from '@/models/userToken'
import { getUserWallet } from '@/lib/db/userWallet'
import { getTokens } from '@/lib/db/token'

export async function getUserToken(userId: string) {
  return UserTokenModel.findOne({ _user: userId })
}

export async function updateUserToken(
  userId: string,
  data: Partial<{
    name: string
    symbol: string
    icon: string
  }>,
  walletAddr?: string
) {
  const _data = { ...data, _wallet: '' }

  // Check if data exists
  const userToken = await getUserToken(userId)
  _data._wallet = userToken?._wallet.toString() || ''

  if (userToken) {
    const token = await getTokens(userToken._id.toString())
    if (token.length) {
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
