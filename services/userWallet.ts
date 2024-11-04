import axios from 'axios'
import type { WalletData, UserWallet } from '@/models/userWallet'

export const updateWallet = async (values: WalletData) => {
  const { data } = await axios.post<UserWallet>('/api/u/wallet', values)
  return data
}
