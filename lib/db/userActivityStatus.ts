import UserActivityStatusModel from '@/models/userActivityStatus'
import { ActivityStatus } from '@/types/db'

export async function getUserActivityStatus(userId: string, activityId: string) {
  try {
    const doc = await UserActivityStatusModel.findOne({
      _user: userId,
      _activity: activityId,
    })

    return doc
  } catch (error) {
    console.error('Error finding user activity status:', error)
    throw error
  }
}

export async function updateUserActivityStatus(
  userId: string,
  activityId: string,
  status: ActivityStatus
) {
  try {
    const doc = await UserActivityStatusModel.findOneAndUpdate(
      { _user: userId, _activity: activityId },
      { status, updatedAt: new Date() },
      { upsert: true, new: true }
    )

    return doc
  } catch (error) {
    console.error('Error adding user activity status:', error)
    throw error
  }
}
