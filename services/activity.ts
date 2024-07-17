import axios from 'axios'
import type { TPublicActivity, ActivityDetail } from '@/models/activity'

type Response = {
  data: TPublicActivity[]
  hasMore: boolean
  nextSkip?: number
}

export const getPublicActivityDetails = async (slug: string) => {
  const { data } = await axios.get<{ details: ActivityDetail }>(`/api/public/activity/data/${slug}`)
  return data.details
}

export const getPublicActivities = async (
  ongoing: boolean,
  skip = 0,
  limit = 10,
  sort: 'desc' | 'asc' = 'desc'
): Promise<Response> => {
  const { data } = await axios.post<Response>('/api/public/activity', {
    ongoing,
    skip,
    limit,
    sort,
  })
  return data
}

export const getPublicActivitiesTotal = async () => {
  const { data } = await axios.get<{ ongoing: number; past: number }>('/api/public/activity/total')
  return data
}
