import axios from 'axios'
import { type UserWallet } from '@/models/userWallet'

export const updateWallet = async (values: Omit<UserWallet, '_user'>) => {
  const { data } = await axios.post<UserWallet>('/api/u/wallet', values)
  return data
}
