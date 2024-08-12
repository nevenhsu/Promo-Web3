import * as _ from 'lodash-es'
import UserActivityStatusModel, { type TUserActivityStatusData } from '@/models/userActivityStatus'
import { ActivityStatus } from '@/types/db'
import type { Activity } from '@/models/activity'

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

export type GetOptions = {
  page?: number
  limit?: number
}

export async function getUserActivityStatuses(userId: string, options?: GetOptions) {
  const { page = 1 } = options || {}

  // Limit the number of transactions to 100
  const limit = _.min([options?.limit || 10, 100]) || 1

  const data = await UserActivityStatusModel.find({ _user: userId })
    .sort({ updatedAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate<{ _activity: Activity }>('_activity')
    .lean()

  if (page === 1) {
    const total = await UserActivityStatusModel.countDocuments({ _user: userId })
    return { data, limit, total }
  }

  return { data, limit }
}

export async function getOngoingActivityStatuses(userId: string) {
  const data: TUserActivityStatusData[] = await UserActivityStatusModel.find({
    _user: userId,
    finalized: { $in: [null, false] },
  })
    .populate<{ _activity: Activity }>('_activity')
    .lean()

  return data
}
