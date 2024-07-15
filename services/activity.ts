import axios from 'axios'
import type { TPublicActivity } from '@/models/activity'

type Response = {
  data: TPublicActivity[]
  hasMore: boolean
  nextSkip?: number
}

export const getPublicActivities = async (
  ongoing: boolean,
  skip = 0,
  sort = 'desc',
  limit = 10
): Promise<Response> => {
  const { data } = await axios.post<Response>('/api/public/activity', {
    ongoing,
    skip,
    sort,
    limit,
  })
  return data
}
