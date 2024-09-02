import axios from 'axios'
import type { TUserActivityStatus } from '@/models/userActivityStatus'

export const getUserActivityStatus = async (slug: string) => {
  const { data } = await axios.get<{ status: TUserActivityStatus | null }>(
    `/api/u/activityStatus/${slug}`
  )
  return data.status
}

export const resetUserActivityStatus = async (slug: string) => {
  const { data } = await axios.put<{ status: TUserActivityStatus }>(`/api/u/activityStatus/${slug}`)
  return data.status
}
