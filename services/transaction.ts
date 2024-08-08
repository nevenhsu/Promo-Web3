import axios from 'axios'
import type { TransactionData, Transaction, TTransaction } from '@/models/transaction'
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

// Get the transactions of the current user
export async function getTransactions(values: { page: number; limit: number; isAirdrop: boolean }) {
  const { page, limit } = values
  const isAirdrop = values.isAirdrop ? 'true' : 'false'

  const url = new URL('/api/u/transaction', window.location.origin)
  url.searchParams.append('page', page.toString())
  url.searchParams.append('limit', limit.toString())
  url.searchParams.append('isAirdrop', isAirdrop)
  // log url: http://localhost:3000/api/u/transaction?page=1&limit=10&isAirdrop=false

  const { data } = await axios.get<{ txs: TTransaction[]; total?: number }>(url.toString())
  return data
}
