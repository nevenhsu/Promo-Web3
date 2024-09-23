import _ from 'lodash-es'
import Decimal from 'decimal.js'
import type { TUserActivityStatus } from '@/models/userActivityStatus'
import type { ActivityDetail, ActivityAirdrop } from '@/models/activity'
import { isTypeA } from '@/types/activitySetting'

export function calculateShare(
  setting: { type?: any; data?: any },
  details: ActivityDetail,
  airdrop: ActivityAirdrop,
  userStatus?: TUserActivityStatus
) {
  const { amount } = airdrop
  const { totalScore } = details
  const { totalScore: userScore = 0 } = userStatus || {}

  if (isTypeA(setting)) {
    const { maxTotalScore } = setting.data
    const maxScore = _.max([maxTotalScore, totalScore]) || 1 // as Denominator

    const shareRatio = userScore / maxScore
    const airdropAmount = new Decimal(amount).mul(shareRatio)

    return {
      shareRatio,
      airdropAmount,
      maxScore,
    }
  }

  // Default share calculation for type None
  const shareRatio = userScore / totalScore
  const airdropAmount = new Decimal(amount).mul(shareRatio)

  return {
    shareRatio,
    airdropAmount,
    maxScore: totalScore,
  }
}
