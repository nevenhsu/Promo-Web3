import TransactionModel, { type Transaction } from '@/models/transaction'
import { getUserWallet } from '@/lib/db/userWallet'
import { unifyAddress } from '@/wallet/utils/helper'

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
