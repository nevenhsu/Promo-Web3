import axios from 'axios'
import type { Activity, TActivity, ActivityDetail } from '@/models/activity'

const api = '/api/private/activity'

export const createActivity = async (
  newData: Omit<Activity, 'index'>
): Promise<TActivity | undefined> => {
  try {
    const { data } = await axios.post<{ activity: TActivity }>(`${api}/create`, {
      ...newData,
      startTime: newData.startTime.toISOString(),
      endTime: newData.endTime.toISOString(),
    })
    return data.activity
  } catch (err) {
    console.error(err)
    return undefined
  }
}

export const updateActivity = async (
  index: number,
  updateData: Partial<Omit<Activity, 'details' | 'index'>>,
  updateDetail: Partial<ActivityDetail>
): Promise<TActivity | undefined> => {
  try {
    const { data } = await axios.put<{ activity: TActivity }>(`${api}/update/${index}`, {
      data: updateData,
      details: updateDetail,
    })
    return data.activity
  } catch (err) {
    console.error(err)
    return undefined
  }
}

export const deleteActivity = async (index: number): Promise<TActivity | undefined> => {
  try {
    const { data } = await axios.delete<{ activity: TActivity }>(`${api}/delete/${index}`)
    return data.activity
  } catch (err) {
    console.error(err)
    return undefined
  }
}

export const getAllActivities = async (): Promise<TActivity[] | undefined> => {
  try {
    const { data } = await axios.get<{ activities: TActivity[] }>(api)
    return data.activities
  } catch (err) {
    console.error(err)
    return undefined
  }
}
