import TransactionModel, { type Transaction } from '@/models/transaction'
import { getUserWallet } from '@/lib/db/userWallet'

export async function saveTransaction(values: Omit<Transaction, '_fromWallet' | '_toWallet'>) {
  const { chainId, hash, from, to } = values

  const fromWallet = from ? await getUserWallet(from) : null
  const toWallet = to ? await getUserWallet(to) : null

  const tx = await TransactionModel.findOneAndUpdate(
    { chainId, hash },
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
  const tx = await TransactionModel.findOne({ chainId, hash })
  return tx
}
