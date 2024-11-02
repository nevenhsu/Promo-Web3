import axios from 'axios'
import type { UserToken } from '@/models/userToken'
import type { Token } from '@/models/token'

export async function getUserToken() {
  const { data } = await axios.get<{ userToken?: UserToken; tokens: Token[] }>('/api/u/userToken')
  return data
}

export type UserTokenData = {
  walletAddr: string
  name: string
  symbol: string
  icon: string
  iconURI: string
}

export async function updateUserToken(data: UserTokenData) {
  const { data: userToken } = await axios.post<{ userToken: UserToken }>('/api/u/userToken', data)
  return userToken
}
