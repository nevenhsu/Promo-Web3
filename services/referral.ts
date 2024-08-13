import axios from 'axios'
import type { TReferee } from '@/models/referral'
import type { PublicUser, ReferralLevel } from '@/types/db'

export const getRefererByCode = async (code: string) => {
  const { data } = await axios.get<{ user: PublicUser }>(`/api/public/referral/${code}`)
  return data.user
}

export const getReferrer = async (): Promise<PublicUser | undefined> => {
  const { data } = await axios.get<{ referrer?: PublicUser }>('/api/u/referral')
  return data.referrer
}

export const createReferral = async (username: string) => {
  const res = await axios.put<{ referrer: PublicUser }>('/api/u/referral/create', {
    referrer: username,
  })
  const { referrer } = res.data
  return referrer
}

export const getReferralByLevel = async (values: {
  level: ReferralLevel
  page: number
  limit: number
}) => {
  const { page, limit, level } = values

  const url = new URL('/api/u/referral/list', window.location.origin)
  url.searchParams.append('page', page.toString())
  url.searchParams.append('limit', limit.toString())
  url.searchParams.append('level', level.toString())

  const { data } = await axios.get<{ referrals: TReferee[]; limit: number }>(url.toString())

  return data
}

export const getReferralCount = async () => {
  const { data } = await axios.get<{ lv1: number; lv2: number }>('/api/u/referral/count')
  return data
}
