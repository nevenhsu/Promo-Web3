import { fromUnixTime } from 'date-fns'
import { parseEventLogs, isAddressEqual } from 'viem'
import { getPublicClient } from '@/wallet/lib/publicClients'
import { getTokenContractByAddress } from '@/contracts'
import { formatBalance } from '@/utils/math'
import type { Hash } from 'viem'

export async function getTransferLog(values: { chainId: number; contract: Hash; hash: Hash }) {
  const { chainId, contract, hash } = values
  const publicClient = getPublicClient(chainId)
  if (!publicClient) throw new Error(`No public client found for chainId: ${chainId}`)

  const token = getTokenContractByAddress(publicClient, contract)
  const receipt = await publicClient.getTransactionReceipt({ hash })
  const [transferEvent] = parseEventLogs({
    abi: token.abi,
    logs: receipt.logs,
    eventName: 'Transfer',
  })

  const { status, blockNumber } = receipt
  const { address, args } = transferEvent

  if (!isAddressEqual(address, contract)) {
    throw new Error('Contract address mismatch')
  }

  // Get block timestamp, token symbol and decimals
  const [block, symbol, decimals] = await Promise.all([
    publicClient.getBlock({ blockNumber }),
    token.read.symbol(),
    token.read.decimals(),
  ])
  const { timestamp } = block

  return {
    success: status === 'success',
    timestamp: fromUnixTime(Number(timestamp.toString())),
    symbol,
    decimals,
    from: args.from,
    to: args.to,
    amount: formatBalance(args.value, decimals).toString(),
  }
}
