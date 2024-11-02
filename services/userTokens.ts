import axios from 'axios'
import type { UserToken } from '@/models/userToken'
import type { Token } from '@/models/token'

export async function getUserToken() {
  const { data } = await axios.get<{ userToken?: UserToken; tokens: Token[] }>('/api/u/userToken')
  return data
}

export async function updateUserToken(data: {
  walletAddr: string
  name: string
  symbol: string
  cover: string
  coverURI: string
}) {
  const { data: userToken } = await axios.post<{ userToken: UserToken }>('/api/u/userToken', data)
  return userToken
}
