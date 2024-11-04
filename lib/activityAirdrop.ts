import Decimal from 'decimal.js'
import { publicEnv } from '@/utils/env'
import type { TPublicActivity, Activity } from '@/models/activity'

const fee = publicEnv.activityFee

if (fee > 1 || fee < 0) {
  throw new Error('Invalid activity fee')
}

export function calcAirdropAmount(data: TPublicActivity | Activity) {
  const { airdrop, nft } = data
  const { amount } = airdrop
  const { nftId, distributedAmount, distributed } = nft || {}
  const amountNum = new Decimal(amount || 0)

  // for offchain data
  if (!nftId) {
    return amountNum
  }

  // not updated yet
  if (!distributed) {
    return amountNum.mul(1 - fee)
  }

  // distributed
  return new Decimal(distributedAmount || 0)
}
