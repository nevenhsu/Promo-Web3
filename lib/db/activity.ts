import * as _ from 'lodash-es'
import { Types } from 'mongoose'
import { setMilliseconds } from 'date-fns'
import ActivityModel from '@/models/activity'
import UserActivityStatusModel from '@/models/userActivityStatus'
import { parseData } from './common'
import type { ActivityData, Activity } from '@/models/activity'

export type GetOptions = {
  page?: number
  limit?: number
}

export type GetFilters = {
  ongoing?: boolean
}

// TODO: add chainId filter

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
// Only for creator to create, update activities
// ========================

type ActivityParams = {
  userId: string
  chainId: number
}

export async function getCreatorActivities(params: ActivityParams, options?: GetOptions) {
  const { userId, chainId } = params
  const { page = 1 } = options || {}
  const limit = _.min([options?.limit || 10, 100]) || 1

  const activities = await ActivityModel.find({ _user: userId, chainId })
    .sort({ startTime: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean()

  // return the total number of transactions
  if (page === 1) {
    const total = await ActivityModel.countDocuments({ _user: userId, chainId })
    return { total, activities, limit }
  }

  return { activities, limit }
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

export async function createActivity(data: ActivityData & { _user?: Types.ObjectId | string }) {
  unifyData(data)

  const activity = new ActivityModel(data)

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

export async function updateActivity(_id: string, updateData: Partial<ActivityData | Activity>) {
  unifyData(updateData)

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

function unifyData(data: any) {
  // Set milliseconds to 0
  if (data.startTime) {
    data.startTime = setMilliseconds(data.startTime, 0)
  }

  if (data.endTime) {
    data.endTime = setMilliseconds(data.endTime, 0)
  }
}
