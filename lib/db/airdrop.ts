import * as _ from 'lodash-es'
import AirdropModel from '@/models/airdrop'

export type GetOptions = {
  page?: number
  limit?: number
}

export async function getAirdrops(userId: string, options?: GetOptions) {
  const { page = 1 } = options || {}
  const limit = _.min([options?.limit || 10, 100]) || 1
  const query = { _user: userId }

  const raw = await AirdropModel.find(query)
    .skip((page - 1) * limit)
    .limit(limit)
    .lean()

  const airdrops = raw.map(o => {
    return {
      ...o,
      receivedAmount: o.receivedAmount?.toString() || '0',
      pendingAmount: o.pendingAmount?.toString() || '0',
    }
  })

  // return the total number of transactions
  if (page === 1) {
    const total = await AirdropModel.countDocuments(query)
    return { total, airdrops, limit }
  }

  return { airdrops, limit }
}
