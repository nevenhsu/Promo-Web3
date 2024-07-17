import * as _ from 'lodash-es'
import ActivityModel from '@/models/activity'
import UserActivityStatusModel from '@/models/userActivityStatus'
import { setMilliseconds } from 'date-fns'
import type { Activity, ActivityDetail, ActivityAirDrop } from '@/models/activity'

// ========================
// Public functions to fetch activities
// ========================

export async function getPublicActivitiesTotal(ongoing: boolean = true) {
  try {
    const now = new Date()
    const total = await ActivityModel.countDocuments({
      published: true,
      endTime: ongoing ? { $gt: now } : { $lte: now },
    }).exec()

    return total
  } catch (error) {
    console.error('Error getting activities total:', error)
    throw error
  }
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

  try {
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
  } catch (error) {
    console.error('Error getting activities:', error)
    throw error
  }
}

export async function getPublicActivity(slug: string) {
  try {
    const activity = await ActivityModel.findOne({
      slug,
      published: true,
    }).exec()

    return activity
  } catch (error) {
    console.error('Error getting activity:', error)
    throw error
  }
}

export async function getPublicActivityDetails(slug: string) {
  try {
    const data = await ActivityModel.findOne({
      slug,
      published: true,
    })
      .select('details')
      .exec()

    return data?.details
  } catch (error) {
    console.error('Error getting activity details:', error)
    throw error
  }
}

// ========================
// Only for admin to create, update, delete activities
// ========================

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
  try {
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
  } catch (error) {
    console.error('Error creating activity', error)
    throw error
  }
}

export async function updateActivity(
  index: number,
  updateData: Partial<Omit<Activity, 'details' | 'airdrop'>>,
  updateDetails: Partial<ActivityDetail>,
  updateAirdrop: Partial<ActivityAirDrop>
) {
  try {
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
  } catch (error) {
    console.error('Error updating activity:', error)
    throw error
  }
}

export async function deleteActivity(index: number) {
  try {
    const deleted = await ActivityModel.findOneAndDelete({ index })

    if (!deleted) {
      console.log('No activity found with the index.')
      return null
    }

    console.log('Deleted activity:', deleted)
    return deleted
  } catch (error) {
    console.error('Error deleting activity:', error)
    throw error
  }
}

export async function getAllActivity() {
  try {
    const activities = await ActivityModel.find().sort({ index: -1 })
    console.log('All activities:', activities.length)
    return activities
  } catch (error) {
    console.error('Error fetching all activities:', error)
    throw error
  }
}

export async function getActivity(slug: string) {
  try {
    const activity = await ActivityModel.findOne({ slug }).orFail()
    return activity
  } catch (error) {
    console.error('Error fetching activity:', error)
    return null
  }
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
