import axios from 'axios'
import type { UserToken, TUserToken } from '@/models/userToken'

export async function getTokens() {
  const { data } = await axios.get<{ tokens: TUserToken[] }>('/api/u/userToken')
  return data
}

export type NewTokenValue = {
  docId: string
  iconURI: string
}

export async function updateToken(value: NewTokenValue) {
  const { data } = await axios.post<{ token: UserToken }>('/api/u/userToken', value)
  return data
}

type CheckTokenValue = {
  name: string
  symbol: string
  chainId: number
}

export async function checkToken(value: CheckTokenValue) {
  const { name, symbol, chainId } = value

  const { data } = await axios.get<{ valid: true }>('/api/u/userToken/check', {
    params: { name, symbol, chainId },
  })
  return data.valid
}

export type MintTokenValue = {
  chainId: number
  walletAddress: string
  iconURI: string
}

export async function mintToken(value: MintTokenValue) {
  const { data } = await axios.post<{ token: UserToken }>('/api/u/userToken/mint', value)
  return data
}
