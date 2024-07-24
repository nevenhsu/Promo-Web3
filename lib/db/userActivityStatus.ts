import UserActivityStatusModel from '@/models/userActivityStatus'
import { ActivityStatus } from '@/types/db'

export async function getUserActivityStatus(userId: string, activityId: string) {
  const doc = await UserActivityStatusModel.findOne({
    _user: userId,
    _activity: activityId,
  })

  return doc
}

export async function updateUserActivityStatus(
  userId: string,
  activityId: string,
  status: ActivityStatus
) {
  const doc = await UserActivityStatusModel.findOneAndUpdate(
    { _user: userId, _activity: activityId },
    { status, updatedAt: new Date() },
    { upsert: true, new: true }
  )

  return doc
}
