import axios from 'axios'
import type { TPublicActivity, ActivityDetail } from '@/models/activity'

export const getPublicActivityDetails = async (slug: string) => {
  if (!slug) return null
  const { data } = await axios.get<{ details: ActivityDetail }>(`/api/public/activity/data/${slug}`)
  return data.details
}

export async function getPublicActivities(values: {
  page: number
  limit: number
  ongoing: boolean
}) {
  const { page, limit } = values
  const ongoing = values.ongoing ? 'true' : 'false'

  const url = new URL('/api/public/activity', window.location.origin)
  url.searchParams.append('page', page.toString())
  url.searchParams.append('limit', limit.toString())
  url.searchParams.append('ongoing', ongoing)
  // log url: http://localhost:3000/api/public/activity?page=1&limit=10&ongoing=true

  const { data } = await axios.get<{
    activities: TPublicActivity[]
    limit: number
    total?: number
  }>(url.toString())
  return data
}
