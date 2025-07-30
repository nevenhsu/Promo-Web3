import { Types } from 'mongoose'
import TokenModel from '@/models/token'
import { filterUserData } from '@/lib/db/user'
import type { TUUserToken } from '@/models/userToken'

export async function addTokenDoc(_user: string, _userToken: string) {
  return TokenModel.findOneAndUpdate(
    { _user, _userToken },
    { updatedAt: null },
    { upsert: true, new: true }
  )
}

export async function updateTokenDoc(_user: string, _userToken: string, totalBalance: string) {
  return TokenModel.findOneAndUpdate(
    { _user, _userToken },
    { totalBalance: Types.Decimal128.fromString(totalBalance), updatedAt: new Date() },
    { upsert: true, new: true }
  )
}

export async function clearTokenUpdatedAt(_user: string, userTokenIds: string[]) {
  return TokenModel.updateMany(
    { _user, _userToken: { $in: userTokenIds } },
    { updatedAt: null },
    { new: true }
  )
}

export async function getTokens(_user: string) {
  const docs = await TokenModel.find({ _user })
    .lean()
    .populate<{ _userToken: TUUserToken }>([{ path: '_userToken', populate: { path: '_user' } }])

  return docs.map(o => ({
    ...o,
    totalBalance: o.totalBalance.toString(),
    _userToken: { ...o._userToken, decimals: 6, _user: filterUserData(o._userToken._user) },
  }))
}
