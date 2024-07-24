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

export async function getPublicActivities(
  ongoing: boolean = true,
  skip: number = 0,
  limit: number = 10,
  sort: 'desc' | 'asc' = 'desc',
  userId?: string // for joined status
) {
  const index = sort === 'asc' ? 1 : -1
  const n = _.min([limit, 100]) || 1

  const now = new Date()
  const activities = await ActivityModel.find({
    published: true,
    endTime: ongoing ? { $gt: now } : { $lte: now },
  })
    .sort({ index })
    .skip(skip)
    .limit(n)
    .exec()

  const joinedIds: { [id: string]: boolean } = {}

  if (userId && activities.length > 0) {
    const activityIds = activities.map(activity => activity._id)
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
  return activities.map(activity => {
    const joined = joinedIds[activity._id.toString()] || false
    const doc = activity.toJSON()
    return { ...doc, joined }
  })
}

export async function getPublicActivity(slug: string) {
  const activity = await ActivityModel.findOne({
    slug,
    published: true,
  }).exec()

  return activity
}

export async function getPublicActivityDetails(slug: string) {
  const data = await ActivityModel.findOne({
    slug,
    published: true,
  })
    .select('details')
    .exec()

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
    .exec()

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
  const activities = await ActivityModel.find().sort({ index: -1 })
  console.log('All activities:', activities.length)
  return activities
}

export async function getActivity(slug: string) {
  const activity = await ActivityModel.findOne({ slug }).orFail()
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
