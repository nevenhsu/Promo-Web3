import * as _ from 'lodash-es'
import ActivityModel from '@/models/activity'
import UserActivityStatusModel from '@/models/userActivityStatus'
import { setMilliseconds } from 'date-fns'
import type { Activity, ActivityDetail, ActivityAirDrop } from '@/models/activity'

// ========================
// Public functions to fetch activities
// ========================

export async function getPublicActivitiesTotal(ongoing: boolean = true) {
  const now = new Date()
  const total = await ActivityModel.countDocuments({
    published: true,
    endTime: ongoing ? { $gt: now } : { $lte: now },
  }).exec()

  return total
}

export type GetOptions = {
  page?: number
  limit?: number
}

export type GetFilters = {
  ongoing?: boolean
}

export async function getPublicActivities(
  options?: GetOptions,
  filter?: GetFilters,
  userId?: string // for joined status
) {
  const { page = 1 } = options || {}
  const { ongoing } = filter || {}

  // Limit the number of transactions to 100
  const limit = _.min([options?.limit || 10, 100]) || 1

  // Create the query
  const query: Record<string, any> = {
    published: true,
  }
  if (ongoing !== undefined) {
    const now = new Date()
    query.endTime = ongoing ? { $gt: now } : { $lte: now }
  }

  const docs = await ActivityModel.find(query)
    .sort({ startTime: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean()

  const joinedIds: { [id: string]: boolean } = {}

  if (userId && docs.length > 0) {
    const activityIds = docs.map(activity => activity._id)
    const activityStatus = await UserActivityStatusModel.find({
      _activity: { $in: activityIds },
      _user: userId,
      status: { $gte: 0 },
    })
    activityStatus.forEach(o => {
      joinedIds[o._activity.toString()] = true
    })
  }

  // add join status to activities
  const activities = docs.map(doc => {
    const joined = joinedIds[doc._id.toString()] || false
    return { ...doc, joined }
  })

  // return the total number of transactions
  if (page === 1) {
    const total = await ActivityModel.countDocuments(query)
    return { total, activities, limit }
  }

  return { activities, limit }
}

export async function getPublicActivity(slug: string) {
  const activity = await ActivityModel.findOne({
    slug,
    published: true,
  }).lean()

  return activity
}

export async function getPublicActivityDetails(slug: string) {
  const data = await ActivityModel.findOne({
    slug,
    published: true,
  })
    .select('details')
    .lean()

  return data?.details
}

// ========================
// Only for admin to create, update, delete activities
// ========================

export async function getActivityId(slug: string) {
  const data = await ActivityModel.findOne({
    slug,
  })
    .select('index')
    .lean()

  return data?._id.toString()
}

type NewActivityData = {
  startTime: any
  endTime: any
  title: string
  slug: string
  description: string
  activityType: number // ActivityType
  socialMedia: string // SocialMedia
  details: ActivityDetail
  airdrop: ActivityAirDrop
}

export async function createActivity(data: NewActivityData) {
  if (!data.slug) {
    throw new Error('Slug is required.')
  }

  const existing = await getActivity(data.slug)
  if (existing) {
    throw new Error('Activity with the same slug already exists.')
  }

  const activity = new ActivityModel({
    ...data,
    startTime: setMilliseconds(data.startTime, 0),
    endTime: setMilliseconds(data.endTime, 0),
  })
  await activity.save()

  console.log('Activity created:', activity)
  return activity
}

export async function updateActivity(
  index: number,
  updateData: Partial<Omit<Activity, 'details' | 'airdrop'>>,
  updateDetails: Partial<ActivityDetail>,
  updateAirdrop: Partial<ActivityAirDrop>
) {
  if (updateData.startTime) {
    updateData.startTime = setMilliseconds(updateData.startTime, 0)
  }
  if (updateData.endTime) {
    updateData.endTime = setMilliseconds(updateData.endTime, 0)
  }

  const parsedDetails = parseDetails(updateDetails)
  const parsedAirdrop = parseAirdrop(updateAirdrop)

  const updated = await ActivityModel.findOneAndUpdate(
    { index },
    { $set: { ...updateData, ...parsedDetails, ...parsedAirdrop } },
    { new: true } // Options to return the updated document
  )

  if (!updated) {
    console.log('No activity found with the index.')
    return null
  }

  console.log('Updated activity:', updated)

  return updated
}

export async function deleteActivity(index: number) {
  const deleted = await ActivityModel.findOneAndDelete({ index })

  if (!deleted) {
    console.log('No activity found with the index.')
    return null
  }

  console.log('Deleted activity:', deleted)
  return deleted
}

export async function getAllActivity() {
  const activities = await ActivityModel.find().sort({ index: -1 }).lean()
  console.log('All activities:', activities.length)
  return activities
}

export async function getActivity(slug: string) {
  const activity = await ActivityModel.findOne({ slug }).lean().orFail()
  return activity
}

function parseDetails(newDetail: Partial<ActivityDetail>) {
  const parsed: { [key: string]: any } = {}

  for (const [key, value] of Object.entries(newDetail)) {
    parsed[`details.${key}`] = value
  }

  return parsed
}

function parseAirdrop(newDetail: Partial<ActivityAirDrop>) {
  const parsed: { [key: string]: any } = {}

  for (const [key, value] of Object.entries(newDetail)) {
    parsed[`airdrop.${key}`] = value
  }

  return parsed
}
