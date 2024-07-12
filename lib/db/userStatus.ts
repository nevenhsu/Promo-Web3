import UserStatusModel, { type UserStatus } from '@/models/userStatus'
import { ReferralLevel } from '@/types/db'

export async function getUserStatus(userId: string) {
  try {
    const userStatus = await UserStatusModel.findOne({ _user: userId })

    if (!userStatus) {
      const newStatus = new UserStatusModel({ _user: userId })
      const doc = await newStatus.save()
      return doc
    }

    return userStatus
  } catch (error) {
    console.error('Error finding user status:', error)
    throw error
  }
}

export async function addReferralNumber(userId: string, level: ReferralLevel) {
  try {
    const userStatus = await getUserStatus(userId)

    switch (level) {
      case ReferralLevel.First:
        userStatus.referral1stNumber++
        console.log('userStatus: increase referral1stNumber', userId)
        break
      case ReferralLevel.Second:
        userStatus.referral2ndNumber++
        console.log('userStatus: increase referral2ndNumber', userId)
        break
      default:
        break
    }

    await userStatus.save()
  } catch (error) {
    console.error('Error increasing user status:', error)
    throw error
  }
}
