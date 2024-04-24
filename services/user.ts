import axios from 'axios'
import type { User } from '@/models/user'
import type { BucketType, UserField } from '@/types/db'

type Response = { success: boolean; error?: string }
type GetUserInfo = Response & { user?: User }

export const getUserInfo = async (): Promise<User | undefined> => {
  try {
    const { data } = await axios.get<GetUserInfo>('/api/user/info')
    const { user, error } = data
    if (error) {
      throw new Error(error)
    }
    return user
  } catch (err) {
    console.error(err)
    return undefined
  }
}

export type UpdateUserBody = { field: UserField; value: any }
export const updateUser = async (body: UpdateUserBody) => {
  try {
    const res = await axios.patch<Response & { data: UpdateUserBody }>(`/api/user/update`, body)
    const { success, data } = res.data
    if (!success) {
      throw new Error('fail')
    }
    return data
  } catch (err) {
    console.error(err)
    return undefined
  }
}

export const uploadImage = async (dataURI: string, type: BucketType) => {
  // data:image/png;base64,iVBORw0...
  try {
    const { data } = await axios.post<{ url: string }>('/api/user/uploadImage', {
      dataURI,
      type,
    })
    return data.url
  } catch (err) {
    console.error(err)
    return undefined
  }
}
