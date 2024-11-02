import TokenModel from '@/models/token'

export async function getTokens(userTokenId: string) {
  return TokenModel.find({ _userToken: userTokenId }).lean()
}
