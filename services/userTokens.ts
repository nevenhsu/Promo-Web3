import axios from 'axios'
import type { UserToken, TUserToken } from '@/models/userToken'
import type { Token } from '@/models/token'

export async function getUserToken() {
  const { data } = await axios.get<{ userToken?: TUserToken; tokens: Token[] }>('/api/u/userToken')
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
