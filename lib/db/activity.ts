import ActivityModel from '@/models/activity'
import { setMilliseconds } from 'date-fns'
import type { Activity, ActivityDetail } from '@/models/activity'

type NewActivityData = {
  startTime: any
  endTime: any
  title: string
  description: string
  points: number
  activityType: number // ActivityType
  socialMedia: string // SocialMedia
  details: ActivityDetail
}

export async function createActivity(data: NewActivityData) {
  try {
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
  updateData: Partial<Omit<Activity, 'details'>>,
  updateDetails: Partial<ActivityDetail>
) {
  try {
    if (updateData.startTime) {
      updateData.startTime = setMilliseconds(updateData.startTime, 0)
    }
    if (updateData.endTime) {
      updateData.endTime = setMilliseconds(updateData.endTime, 0)
    }

    const parsedDetails = parseDetails(updateDetails)

    const updated = await ActivityModel.findOneAndUpdate(
      { index },
      { $set: { ...updateData, ...parsedDetails } },
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

export async function getActivity(index: number) {
  try {
    const activity = await ActivityModel.findOne({ index }).orFail()
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
