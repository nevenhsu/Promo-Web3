import axios from 'axios'
import type { UserStatus } from '@/models/userStatus'
import type { Airdrop } from '@/models/airdrop'

export type TUserStatus = {
  status: UserStatus
  airdrops: Airdrop[]
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
