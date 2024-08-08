import TransactionModel, { type Transaction } from '@/models/transaction'
import { getUserWallet, getUserWallets } from '@/lib/db/userWallet'
import { unifyAddress } from '@/wallet/utils/helper'
import { TxStatus, TxType } from '@/types/db'

export async function saveTransaction(values: Omit<Transaction, '_fromWallet' | '_toWallet'>) {
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
  const { page = 1, limit = 10 } = options || {}
  const { isAirdrop, status, type } = filter || {}

  const wallets = await getUserWallets(userId)
  const walletIds = wallets.map(wallet => wallet._id.toString())

  // Create the query
  const query: Record<string, any> = {
    $or: [{ _fromWallet: { $in: walletIds } }, { _toWallet: { $in: walletIds } }],
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
    const isSender = walletIds.includes(tx._fromWallet?.toString() || '')
    const isReceiver = walletIds.includes(tx._toWallet?.toString() || '')
    return { ...tx, isSender, isReceiver }
  })

  // return the total number of transactions
  if (page === 1) {
    const total = await TransactionModel.countDocuments(query)
    return { total, txs }
  }

  return { txs }
}
