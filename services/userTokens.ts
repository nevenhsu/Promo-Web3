import axios from 'axios'
import type { UserToken, TUserToken } from '@/models/userToken'

export async function getUserTokens() {
  const { data } = await axios.get<{ tokens: TUserToken[] }>('/api/u/userToken')
  return data
}

export type NewUserTokenValue = {
  docId: string
  icon: string
  iconURI: string
}

export async function updateUserToken(value: NewUserTokenValue) {
  const { data } = await axios.post<{ token: UserToken }>('/api/u/userToken', value)
  return data
}

export async function checkUserToken(name: string, symbol: string, chainId: number) {
  const { data } = await axios.get<{ valid: true }>('/api/u/userToken/check', {
    params: { name, symbol, chainId },
  })
  return data.valid
}

export async function mintToken(chainId: number, walletId: string, iconURI: string) {
  const { data } = await axios.post<{ token: UserToken }>('/api/u/userToken/mint', {
    chainId,
    walletId,
    iconURI,
  })
  return data
}
