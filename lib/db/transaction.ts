import * as _ from 'lodash-es'
import TransactionModel, { type Transaction } from '@/models/transaction'
import { getUserWallet } from '@/lib/db/userWallet'
import { unifyAddress } from '@/wallet/utils/helper'
import { TxStatus, TxType } from '@/types/db'
import type { User } from '@/models/user'

export async function saveTransaction(
  values: Omit<Transaction, '_fromWallet' | '_toWallet' | '_fromUser' | '_toUser'>
) {
  values.hash = unifyAddress(values.hash)
  values.from = unifyAddress(values.from)
  if (values.to) {
    values.to = unifyAddress(values.to)
  }
  if (values.contract) {
    values.contract = unifyAddress(values.contract)
  }

  const { chainId, hash, from, to } = values

  const fromWallet = await getUserWallet(from)
  const toWallet = to ? await getUserWallet(to) : null

  const tx = await TransactionModel.findOneAndUpdate(
    { chainId, hash: hash.toLowerCase() },
    {
      ...values,
      _fromWallet: fromWallet?._id,
      _toWallet: toWallet?._id,
      _fromUser: fromWallet?._user,
      _toUser: toWallet?._user,
    },
    {
      upsert: true,
      new: true,
    }
  )
  return tx
}

export async function getTransaction(chainId: number, hash: string) {
  const tx = await TransactionModel.findOne({ chainId, hash: hash.toLowerCase() })
  return tx
}

export type GetFilters = {
  isAirdrop?: boolean
  status?: TxStatus
  type?: TxType
}

export type GetOptions = {
  page?: number
  limit?: number
}

export async function getTransactions(userId: string, options?: GetOptions, filter?: GetFilters) {
  const { page = 1 } = options || {}
  const { isAirdrop, status, type } = filter || {}

  // Limit the number of transactions to 100
  const limit = _.min([options?.limit || 10, 100]) || 1

  // Create the query
  const query: Record<string, any> = {
    $or: [{ _fromUser: userId }, { _toUser: userId }],
  }
  if (isAirdrop !== undefined) {
    query.isAirdrop = isAirdrop
  }
  if (status) {
    query.status = status
  }
  if (type) {
    query.type = type
  }

  const data = await TransactionModel.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean()

  const txs = data.map(tx => {
    // Check if the transaction is made by the user
    const isSender = tx._fromUser?.toString() === userId
    const isReceiver = tx._toUser?.toString() === userId
    return { ...tx, isSender, isReceiver }
  })

  // return the total number of transactions
  if (page === 1) {
    const total = await TransactionModel.countDocuments(query)
    return { total, txs, limit }
  }

  return { txs, limit }
}

export async function getUserTransaction(userId: string, txId: string) {
  const tx = await TransactionModel.findOne({
    _id: txId,
    $or: [{ _fromUser: userId }, { _toUser: userId }],
  })
    .populate<{ _fromUser: User; _toUser: User }>(['_fromUser', '_toUser'])
    .lean()

  return tx
}
