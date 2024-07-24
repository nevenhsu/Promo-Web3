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
    await _createReferral(upperReferral._referrer._id, _referee, ReferralLevel.Second)
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
  const referral = await ReferralModel.findOne({ _referrer, _referee })
  return referral
}

export async function getReferrer(_referee: string) {
  const referral = await ReferralModel.findOne({
    _referee,
    level: ReferralLevel.First,
  }).populate<{ _referrer: TUser }>('_referrer')
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

  console.log('Updated referral:', referral)

  return referral
}

export async function getReferralByLevel(
  _referrer: string,
  level: number,
  skip: number = 0,
  sort: 'desc' | 'asc' = 'desc',
  limit: number = 10
) {
  const createdAt = sort === 'desc' ? -1 : 1
  const n = _.min([limit, 100]) || 1

  const referral = await ReferralModel.find({ _referrer, level })
    .sort({ createdAt })
    .skip(skip)
    .limit(n)
    .populate<{ _referee: TUser }>('_referee')
    .exec()

  return referral
}
