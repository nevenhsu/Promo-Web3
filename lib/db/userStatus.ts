import UserStatusModel from '@/models/userStatus'
import { ReferralLevel } from '@/types/db'

export async function getUserStatus(userId: string) {
  let userStatus = await UserStatusModel.findOne({ _user: userId })

  if (!userStatus) {
    userStatus = new UserStatusModel({ _user: userId })
    const doc = await userStatus.save()
    return doc
  }

  return userStatus
}

export async function addReferralNumber(userId: string, level: ReferralLevel) {
  // Increase the referral number based on the level
  const inc = level === ReferralLevel.First ? { referral1stNumber: 1 } : { referral2ndNumber: 1 }

  const status = await UserStatusModel.findOneAndUpdate(
    { _user: userId },
    { $inc: inc },
    { upsert: true, new: true }
  )

  return status
}
