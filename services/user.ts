import axios from 'axios'
import type { TUser } from '@/models/user'
import type { BucketType } from '@/types/db'

export const getUserInfo = async (): Promise<TUser | undefined> => {
  try {
    const { data } = await axios.get<{ user: TUser }>('/api/u/user')
    const { user } = data
    return user
  } catch (err) {
    console.error(err)
    return undefined
  }
}

export const updateUser = async (body: Partial<TUser>) => {
  try {
    const res = await axios.put<{ user: TUser }>(`/api/u/user/update`, body)
    const { user } = res.data
    return user
  } catch (err) {
    console.error(err)
    return undefined
  }
}

export const uploadImage = async (dataURI: string, type: BucketType) => {
  // data:image/png;base64,iVBORw0...
  try {
    const { data } = await axios.post<{ url: string }>('/api/u/user/uploadImage', {
      dataURI,
      type,
    })
    return data.url
  } catch (err) {
    console.error(err)
    return undefined
  }
}
