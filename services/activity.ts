import axios from 'axios'
import type { TPublicActivity, ActivityDetail, TActivity } from '@/models/activity'

// ====================
// Public Activity
// ====================

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

// ====================
// Owned Activity
// ====================

export async function getOwnedActivity(slug: string) {
  const { data } = await axios.get<{
    activity: TActivity
  }>(`/api/u/activity/${slug}`)

  return data.activity
}

export type UpdateData = {
  title: string
  description: string
  details: {
    externalLink: string
  }
  setting: {
    data: {
      maxTotalScore: number
      minFollowers: number
    }
  }
  published: boolean
}

export async function updateOwnedActivity(slug: string, data: Partial<UpdateData>) {
  const { data: updated } = await axios.put<{ activity: TActivity }>(`/api/u/activity/${slug}`, {
    data,
  })

  return updated.activity
}
