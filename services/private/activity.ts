import axios from 'axios'
import type { TActivity, ActivityData } from '@/models/activity'

const api = '/api/private/activity'

export const createActivity = async (newData: ActivityData): Promise<TActivity | undefined> => {
  try {
    const { data } = await axios.post<{ activity: TActivity }>(`${api}/create`, newData)
    return data.activity
  } catch (err) {
    console.error(err)
    return undefined
  }
}

export const updateActivity = async (
  _id: string,
  updateData: Partial<ActivityData>
): Promise<TActivity | undefined> => {
  try {
    const { data } = await axios.put<{ activity: TActivity }>(`${api}/update/${_id}`, {
      data: updateData,
    })
    return data.activity
  } catch (err) {
    console.error(err)
    return undefined
  }
}

export const getActivities = async (values: { page: number; limit: number }) => {
  const { page, limit } = values

  const url = new URL(api, window.location.origin)
  url.searchParams.append('page', page.toString())
  url.searchParams.append('limit', limit.toString())
  // log url: http://localhost:3000/api/private/activity?page=1&limit=10

  const { data } = await axios.get<{
    activities: TActivity[]
    limit: number
    total?: number
  }>(url.toString())
  return data
}
