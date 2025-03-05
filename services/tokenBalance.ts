import axios from 'axios'
import type { TTokenBalance } from '@/models/tokenBalance'

export async function getBalancesOfAll() {
  const { data } = await axios.get<{ tokens: TTokenBalance[] }>('/api/u/tokenBalance')
  return data
}

export async function updateTokenBalance(value: { symbol: string; chainId: number }) {
  const { data } = await axios.post<{ tokens: TTokenBalance[] }>('/api/u/tokenBalance', value)
  return data
}
