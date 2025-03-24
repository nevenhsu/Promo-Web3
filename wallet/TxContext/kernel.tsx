import * as _ from 'lodash-es'
import type { Hash } from 'viem'
import type { CalldataArgs, Calldata } from './tx'
import type { KernelClient } from '@/types/wallet'

export async function sendByKernelClient(client: KernelClient, calldata: Calldata | Calldata[]) {
  let hash: Hash
  let success: boolean
  let opHash: Hash

  // Send transaction by smart account
  console.log('Send tx by smart account:', calldata)
  const value = Array.isArray(calldata) ? calldata : [calldata]
  const { userOpHash, wait } = await sendTxBySmartAccount(client, value)
  opHash = userOpHash // for callback
  const result = await wait
  hash = result.transactionHash
  success = result.success

  return { hash, success, opHash }
}

// View UserOp: https://jiffyscan.xyz/
async function getOpReceipt(client: KernelClient, userOpHash: Hash) {
  const result = await client.waitForUserOperationReceipt({ hash: userOpHash })

  const { success, reason, receipt, sender } = result
  const { transactionHash } = receipt
  console.log('Op Receipt:', { success, sender, userOpHash, reason, transactionHash })

  return { success, sender, userOpHash, reason, transactionHash, receipt, result }
}

async function sendUserOp(client: KernelClient, data: CalldataArgs) {
  const callData = await client.account.encodeCalls(data)
  const userOpHash = await client.sendUserOperation({
    callData,
  })

  const wait = getOpReceipt(client, userOpHash)
  return { userOpHash, wait }
}

async function sendTxBySmartAccount(client: KernelClient, args: CalldataArgs) {
  const { userOpHash, wait } = await sendUserOp(client, args)
  return { userOpHash, wait }
}
