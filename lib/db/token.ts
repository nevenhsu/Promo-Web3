import { Types } from 'mongoose'
import TokenModel from '@/models/token'

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
