import axios from 'axios'
import type { TUserActivityStatusData } from '@/models/userActivityStatus'

// Get the activity statuses of the current user
export async function getActivityStatuses(values: { page: number; limit: number }) {
  const { page, limit } = values

  const url = new URL('/api/u/activityStatus', window.location.origin)
  url.searchParams.append('page', page.toString())
  url.searchParams.append('limit', limit.toString())
  // log url: http://localhost:3000/api/u/activityStatus?page=1&limit=10

  const { data } = await axios.get<{
    data: TUserActivityStatusData[]
    limit: number
    total?: number
  }>(url.toString())

  return data
}
