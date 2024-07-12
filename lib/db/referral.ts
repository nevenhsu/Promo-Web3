import * as _ from 'lodash-es'
import ReferralModel from '@/models/referral'
import { addReferralNumber } from './userStatus'
import { ReferralLevel } from '@/types/db'
import type { TUser } from '@/models/user'

export async function createReferral(referrer: string, referee: string) {
  try {
    const referral = await _createReferral(referrer, referee, ReferralLevel.First)

    if (!referral) {
      return null
    }

    // If the referrer has a referrer, create a second-level referral
    const upperReferral = await getReferrer(referrer)
    if (upperReferral) {
      await _createReferral(upperReferral._referrer._id, referee, ReferralLevel.Second)
    }

    return referral
  } catch (err) {
    console.error(err)
    return err
  }
}

// Referrer and referee are userId
export async function _createReferral(referrer: string, referee: string, level: ReferralLevel) {
  try {
    // Check if the referrer and referee are the same
    if (referrer === referee) {
      return
    }

    // Check if the referral already exists
    const existing1 = await getReferral(referrer, referee)
    const existing2 = await getReferral(referee, referrer)
    if (existing1 || existing2) {
      return
    }

    const referral = new ReferralModel({ referrer, referee, level })
    await referral.save()

    await addReferralNumber(referrer, level)

    console.log('Referral created:', referral)

    return referral
  } catch (error) {
    console.error('Error creating referral:', error)
    throw error
  }
}

export async function getReferral(referrer: string, referee: string) {
  try {
    const referral = await ReferralModel.findOne({ referrer, referee })
    return referral
  } catch (error) {
    console.error('Error getting referral:', error)
    throw error
  }
}

export async function getReferrer(referee: string) {
  try {
    const referral = await ReferralModel.findOne({ referee }).populate<{ _referrer: TUser }>(
      '_referrer'
    )
    return referral
  } catch (error) {
    console.error('Error getting referrer:', error)
    throw error
  }
}

export async function updateReferralScore(
  referrer: string,
  referee: string,
  incrementalScore: number
) {
  try {
    const referral = await ReferralModel.findOneAndUpdate(
      { referrer, referee },
      { $inc: { score: incrementalScore } },
      { new: true } // Options to return the updated document
    )

    if (!referral) {
      console.log('No referral found with the specified IDs.')
      return null
    }

    console.log('Updated referral:', referral)

    return referral
  } catch (error) {
    console.error('Error updating referral:', error)
    throw error
  }
}

export async function getReferralByLevel(
  referrer: string,
  level: number,
  limit: number = 10,
  skip: number = 0,
  sort: 'desc' | 'asc' = 'desc'
) {
  const createdAt = sort === 'desc' ? -1 : 1
  const n = _.min([limit, 100]) || 1

  try {
    const referral = await ReferralModel.find({ referrer, level })
      .sort({ createdAt })
      .limit(n)
      .skip(skip)
      .populate<{ _referee: TUser }>('_referee')
      .exec()

    return referral
  } catch (error) {
    console.error('Error getting referral:', error)
    throw error
  }
}
