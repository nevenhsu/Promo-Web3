import axios from 'axios'
import type { TAirdrop } from '@/models/airdrop'

export async function getAirdrops(values: { page: number; limit: number }) {
  const { page, limit } = values

  const url = new URL('/api/u/airdrop', window.location.origin)
  url.searchParams.append('page', page.toString())
  url.searchParams.append('limit', limit.toString())
  // log url: http://localhost:3000/api/u/airdrop?page=1&limit=10

  const { data } = await axios.get<{
    airdrops: TAirdrop[]
    limit: number
    total?: number
  }>(url.toString())

  return data
}
