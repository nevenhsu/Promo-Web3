import axios from 'axios'
import type { TUser, LinkedAccount } from '@/models/user'
import type { ReferralCode } from '@/models/referralCode'
import type { PublicUser } from '@/types/db'

export type UserData = {
  user: TUser
  referralData: ReferralCode
}

export type ProfileData = {
  name: string
  username: string
  avatarURI: string
}

export const getUserInfo = async () => {
  const { data } = await axios.get<UserData>('/api/u/user')
  return data
}

export const updateUser = async (body: Partial<TUser>) => {
  const res = await axios.put<{ user: TUser }>(`/api/u/user/update`, body)
  const { user } = res.data
  return user
}

export const updateProfile = async (body: ProfileData) => {
  const res = await axios.put<{ user: TUser }>(`/api/u/user/updateProfile`, body)
  const { user } = res.data
  return user
}

export const uploadImage = async (dataURI: string, name: string) => {
  // data:image/png;base64,iVBORw0...
  const { data } = await axios.put<{ url: string }>('/api/u/uploadImage', {
    dataURI,
    name,
  })
  return data.url
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

export const updateLinkAccount = async (data: LinkedAccount) => {
  const res = await axios.put<{ user: TUser }>(`/api/u/user/linkAccount`, data)
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
