import axios from 'axios'
import type { TUserStatus } from '@/models/userStatus'

export const getUserStatus = async () => {
  const { data } = await axios.get<{ status: TUserStatus }>('/api/u/status')
  return data.status
}
