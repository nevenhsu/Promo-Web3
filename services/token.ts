import axios from 'axios'
import type { TTokenDoc } from '@/models/token'
import type { UpdateWriteOpResult } from 'mongoose'

export async function getTokenDocs() {
  const { data } = await axios.get<{ tokens: TTokenDoc[] }>('/api/u/token')
  return data
}

export async function clearTokenUpdatedAt(value: { userTokenIds: string[] }) {
  const { data } = await axios.post<{ result: UpdateWriteOpResult }>('/api/u/token', value)
  return data
}
