import axios from 'axios'
import type { TransactionData, Transaction } from '@/models/transaction'
import type { TxStatus } from '@/types/db'

// Create a transaction for the current user
export async function createTransaction(value: TransactionData & { status: TxStatus }) {
  const { data } = await axios.put<{ tx: Transaction }>('/api/u/transaction', value)
  return data.tx
}

// Update the status of a transaction
export async function updateTransactionStatus(values: {
  chainId: number
  hash: string
  status: TxStatus
}) {
  const { data } = await axios.post<{ tx: Transaction }>('/api/u/transaction', values)
  return data.tx
}
