import axios from 'axios'
import type { TReferral, TReferee } from '@/models/referral'
import type { PublicUser, ReferralLevel } from '@/types/db'

export const getReferrer = async (): Promise<PublicUser | undefined> => {
  try {
    const { data } = await axios.get<{ referrer: PublicUser }>('/api/u/referral')
    const { referrer } = data
    return referrer
  } catch (err) {
    console.error(err)
    return undefined
  }
}

// referrer is the username
export const createReferral = async (referrer: string) => {
  try {
    const res = await axios.put<{ referral: TReferral }>('/api/u/referral/create', {
      referrer,
    })
    const { referral } = res.data
    return referral
  } catch (err) {
    console.error(err)
    return undefined
  }
}

export const getReferralByLevel = async (
  level: ReferralLevel,
  limit: number = 10,
  skip: number = 0,
  sort: 'desc' | 'asc' = 'desc'
) => {
  try {
    const res = await axios.post<{ referrals: TReferee[] }>('/api/u/referral/list', {
      level,
      limit,
      skip,
      sort,
    })
    const { referrals } = res.data
    return referrals
  } catch (err) {
    console.error(err)
    return []
  }
}
