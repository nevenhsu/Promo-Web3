import { fromUnixTime } from 'date-fns'
import { parseEventLogs } from 'viem'
import { getPublicClient } from '@/wallet/lib/publicClients'
import { getActivityManager, getTokenContractByAddress } from '@/contracts'
import { formatBalance } from '@/utils/math'
import { unifyAddress } from '@/wallet/utils/helper'
import type { Hash } from 'viem'

export async function getCreateLog(values: { chainId: number; hash: Hash }) {
  const { chainId, hash } = values
  const publicClient = getPublicClient(chainId)
  if (!publicClient) {
    throw new Error(`No public client found for chainId: ${chainId}`)
  }
  const activityManager = getActivityManager(publicClient)

  // From the event logs
  const receipt = await publicClient.getTransactionReceipt({ hash })
  const { status, blockNumber, logs } = receipt

  // Create event logs
  const [createEvent] = parseEventLogs({
    abi: activityManager.abi,
    logs,
    eventName: 'Create',
  })
  const { tokenId } = createEvent.args
  const nft = await getActivityNFT({ chainId, nftId: tokenId })
  const { timestamp } = await publicClient.getBlock({ blockNumber })

  return {
    success: status === 'success',
    timestamp: fromUnixTime(Number(timestamp.toString())),
    nft,
  }
}

export async function getActivityNFT(values: { chainId: number; nftId: number | bigint }) {
  const { chainId, nftId } = values
  const publicClient = getPublicClient(chainId)
  if (!publicClient) {
    throw new Error(`No public client found for chainId: ${chainId}`)
  }
  const activityManager = getActivityManager(publicClient)

  const nft = await activityManager.read.getActivity([BigInt(nftId)])
  if (!nft) {
    throw new Error(`Activity NFT not found: ${nftId}`)
  }

  const {
    token,
    startTime,
    endTime,
    owner,
    totalAmount,
    distributedAmount,
    feeAmount,
    refundedAmount,
  } = nft

  const tokenContract = getTokenContractByAddress(publicClient, token)
  const [symbol, decimals] = await Promise.all([
    tokenContract.read.symbol(),
    tokenContract.read.decimals(),
  ])

  return {
    nftId: Number(nftId.toString()),
    startTime: fromUnixTime(Number(startTime.toString())),
    endTime: fromUnixTime(Number(endTime.toString())),
    owner: unifyAddress(owner),
    token,
    symbol,
    decimals,
    totalAmount: formatBalance(totalAmount, decimals).toString(),
    distributedAmount: formatBalance(distributedAmount, decimals).toString(),
    feeAmount: formatBalance(feeAmount, decimals).toString(),
    refundedAmount: formatBalance(refundedAmount, decimals).toString(),
  }
}
