import * as _ from 'lodash-es'
import { setMilliseconds } from 'date-fns'
import ActivityModel from '@/models/activity'
import UserActivityStatusModel from '@/models/userActivityStatus'
import { parseData } from './common'
import type { ActivityData } from '@/models/activity'

export type GetOptions = {
  page?: number
  limit?: number
}

export type GetFilters = {
  ongoing?: boolean
}

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
    if (ongoing) {
      query.startTime = { $lte: now }
    }
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

  console.log('Activity found:', { slug, activity })

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

export async function getActivityBySlug(slug: string) {
  const data = await ActivityModel.findOne({
    slug,
  }).lean()

  return data
}

export async function createActivity(data: ActivityData) {
  const activity = new ActivityModel({
    ...data,
    startTime: setMilliseconds(data.startTime, 0),
    endTime: setMilliseconds(data.endTime, 0),
  })

  if (!activity.slug) {
    activity.slug = activity._id.toString()
  } else {
    const doc = await getActivityBySlug(data.slug)
    if (doc) {
      throw new Error('Activity with the same slug already exists.')
    }
  }

  await activity.save()

  console.log('Activity created:', activity)
  return activity
}

export async function updateActivity(_id: string, updateData: Partial<ActivityData>) {
  if (updateData.startTime) {
    updateData.startTime = setMilliseconds(updateData.startTime, 0)
  }
  if (updateData.endTime) {
    updateData.endTime = setMilliseconds(updateData.endTime, 0)
  }

  const { setting, ...rest } = updateData
  const parsedData = parseData(rest)
  if (setting) {
    parsedData.setting = setting
  }

  const updated = await ActivityModel.findOneAndUpdate(
    { _id },
    { $set: parsedData },
    { new: true } // Options to return the updated document
  )

  if (!updated) {
    console.log('No activity found with the id.')
    return null
  }

  return updated
}

export async function getActivities(options?: GetOptions) {
  const { page = 1 } = options || {}
  const limit = _.min([options?.limit || 10, 100]) || 1

  const activities = await ActivityModel.find({})
    .sort({ startTime: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean()

  // return the total number of transactions
  if (page === 1) {
    const total = await ActivityModel.countDocuments({})
    return { total, activities, limit }
  }

  return { activities, limit }
}
