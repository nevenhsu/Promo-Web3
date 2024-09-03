import axios from 'axios'
import type { User } from '@/models/user'
import type { Instagram } from '@/models/instagram'

export async function getToken(accessToken: string) {
  const { data } = await axios.put<{ instagram: Instagram; user: User }>('/api/u/instagram', {
    accessToken,
  })
  return data
}

export async function refreshToken() {
  const { data } = await axios.get<{ instagram?: Instagram; user: User }>(
    '/api/u/instagram/refresh'
  )
  return data
}
