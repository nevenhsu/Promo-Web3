import TokenModel from '@/models/token'

export async function addTokenDoc(_user: string, _userToken: string) {
  return TokenModel.findOneAndUpdate(
    { _user, _userToken },
    { updatedAt: null },
    { upsert: true, new: true }
  )
}
