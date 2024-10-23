import axios from 'axios'
import type { UserStatus } from '@/models/userStatus'

export type TUserStatus = {
  status: UserStatus
  progress: {
    total: number
    finalized: number
    ongoing: number
  }
}

export const getUserStatus = async () => {
  const { data } = await axios.get<TUserStatus>('/api/u/status')
  return data
}
