import * as _ from 'lodash-es'
import ReferralModel from '@/models/referral'
import { addReferralNumber } from './userStatus'
import { ReferralLevel } from '@/types/db'
import type { TUser } from '@/models/user'

export async function createReferral(_referrer: string, _referee: string) {
  const referral = await _createReferral(_referrer, _referee, ReferralLevel.First)

  if (!referral) {
    return null
  }

  // If the referrer has a referrer, create a second-level referral
  const upperReferral = await getReferrer(_referrer)
  if (upperReferral) {
    await _createReferral(upperReferral._referrer._id.toString(), _referee, ReferralLevel.Second)
  }

  return referral
}

// Referrer and referee are userId
export async function _createReferral(_referrer: string, _referee: string, level: ReferralLevel) {
  // Check if the referrer and referee are the same
  if (_referrer === _referee) {
    return
  }

  // Check if the referral already exists
  const existing1 = await getReferral(_referrer, _referee)
  const existing2 = await getReferral(_referee, _referrer)
  if (existing1 || existing2) {
    return
  }

  const referral = new ReferralModel({ _referrer, _referee, level })
  await referral.save()

  await addReferralNumber(_referrer, level)

  console.log('Referral created:', referral)

  return referral
}

export async function getReferral(_referrer: string, _referee: string) {
  const referral = await ReferralModel.findOne({ _referrer, _referee }).lean()
  return referral
}

export async function getReferrer(_referee: string) {
  const referral = await ReferralModel.findOne({
    _referee,
    level: ReferralLevel.First,
  })
    .lean()
    .populate<{ _referrer: TUser }>('_referrer')

  return referral
}

export async function updateReferralScore(
  _referrer: string,
  _referee: string,
  incrementalScore: number
) {
  const referral = await ReferralModel.findOneAndUpdate(
    { _referrer, _referee },
    { $inc: { score: incrementalScore } },
    { new: true } // Options to return the updated document
  )

  if (!referral) {
    console.log('No referral found with the specified IDs.')
    return null
  }

  return referral
}

export type GetOptions = {
  page?: number
  limit?: number
}

export async function getReferralByLevel(_referrer: string, level: number, options?: GetOptions) {
  const { page = 1 } = options || {}

  // Limit the number of transactions to 100
  const limit = _.min([options?.limit || 10, 100]) || 1

  const docs = await ReferralModel.find({ _referrer, level })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean()
    .populate<{ _referee: TUser }>('_referee')

  return { docs, limit }
}

export async function getReferralCount(_referrer: string, level: number) {
  const count = await ReferralModel.countDocuments({ _referrer, level })
  return count
}
