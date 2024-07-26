import axios from 'axios'
import type { TUser } from '@/models/user'
import type { BucketType, PublicUser } from '@/types/db'

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

export const getPublicUser = async (username: string): Promise<PublicUser | undefined> => {
  try {
    const { data } = await axios.get<{ user: PublicUser }>(`/api/public/user/${username}`)
    const { user } = data
    return user
  } catch (err) {
    console.error(err)
    return undefined
  }
}

export const updateLinkAccount = async (userId: string, platform: string, username?: string) => {
  const res = await axios.put<{ user: TUser }>(`/api/u/user/linkAccount`, {
    userId,
    platform,
    username,
  })
  const { user } = res.data
  return user
}

export const deleteLinkAccount = async (platform: string) => {
  const res = await axios.delete<{ user: TUser }>(`/api/u/user/linkAccount`, {
    data: { platform },
  })
  const { user } = res.data
  return user
}
