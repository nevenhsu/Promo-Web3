import axios from 'axios'
import type { UserToken, TUserToken } from '@/models/userToken'

export async function getUserTokens() {
  const { data } = await axios.get<{ tokens: TUserToken[] }>('/api/u/userToken')
  return data
}

export type UserTokenData = {
  docId: string
  icon: string
  iconURI: string
}

export async function updateUserToken(data: UserTokenData) {
  const { data: userToken } = await axios.post<{ userToken: UserToken }>('/api/u/userToken', data)
  return userToken
}

export async function checkUserToken(name: string, symbol: string) {
  const { data } = await axios.get<{ valid: true }>('/api/u/userToken/check', {
    params: { name, symbol },
  })
  return data.valid
}

export async function mintToken(chainId: number) {
  const { data } = await axios.post<{ token: Token }>('/api/u/userToken/mint', { chainId })
  return data
}
