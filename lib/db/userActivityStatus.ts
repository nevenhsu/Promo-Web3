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

export async function countUserActivityStatus(userId: string, finalized: boolean) {
  const count = await UserActivityStatusModel.countDocuments({
    _user: userId,
    finalized: finalized ? true : { $in: [null, false] },
  })
  return count
}
