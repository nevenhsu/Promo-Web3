import axios from 'axios'
import type { TUser } from '@/models/user'

export const getUserByUsername = async (username: string): Promise<TUser | undefined> => {
  try {
    const { data } = await axios.get<{ user: TUser }>(`/api/private/user/${username}`)
    const { user } = data
    return user
  } catch (err) {
    console.error(err)
    return undefined
  }
}
