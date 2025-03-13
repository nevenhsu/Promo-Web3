import { fromUnixTime } from 'date-fns'
import { getPublicClient } from '@/wallet/lib/publicClients'
import { formatBalance } from '@/utils/math'
import type { Hash } from 'viem'

export async function getEthTxLog(values: { chainId: number; hash: Hash }) {
  const { chainId, hash } = values
  const publicClient = getPublicClient(values.chainId)
  if (!publicClient) throw new Error(`No public client found for chainId: ${values.chainId}`)

  const [transaction, receipt] = await Promise.all([
    publicClient.getTransaction({ hash }),
    publicClient.getTransactionReceipt({ hash }),
  ])

  const { from, to, value, blockNumber } = transaction
  const { status } = receipt

  const { timestamp } = await publicClient.getBlock({ blockNumber })
  return {
    success: status === 'success',
    timestamp: fromUnixTime(Number(timestamp.toString())),
    from,
    to,
    amount: formatBalance(value, 18).toString(),
  }
}
