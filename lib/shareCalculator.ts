import * as _ from 'lodash-es'
import Decimal from 'decimal.js'
import { isTypeA } from '@/types/activitySetting'
import type { ActivityDetail, ActivityAirdrop } from '@/models/activity'

export function calculateShare(
  setting: { type?: any; data?: any },
  details: ActivityDetail,
  airdrop: ActivityAirdrop,
  userStatus?: { totalScore: number }
): {
  shareRatio: Decimal
  airdropAmount: Decimal
  maxScore: number
} {
  const { amount } = airdrop
  const { totalScore } = details
  const { totalScore: userScore = 0 } = userStatus || {}

  if (totalScore <= 0 || userScore <= 0) {
    return {
      shareRatio: new Decimal(0),
      airdropAmount: new Decimal(0),
      maxScore: 0,
    }
  }

  if (isTypeA(setting)) {
    const { maxTotalScore } = setting.data
    if (!maxTotalScore) {
      throw new Error('Max total score is required for type A')
    }

    const maxScore = _.max([maxTotalScore, totalScore])!
    const shareRatio = new Decimal(userScore).div(maxScore)
    const airdropAmount = new Decimal(amount).mul(shareRatio)

    return {
      shareRatio,
      airdropAmount,
      maxScore,
    }
  }

  // Default share calculation for type None
  const shareRatio = new Decimal(userScore).div(totalScore)
  const airdropAmount = new Decimal(amount).mul(shareRatio)

  return {
    shareRatio,
    airdropAmount,
    maxScore: totalScore,
  }
}
