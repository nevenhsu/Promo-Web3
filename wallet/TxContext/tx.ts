import { encodeFunctionData } from 'viem'
import { getPublicClient } from '@/wallet/lib/publicClients'
import { wait } from '@/wallet/utils/helper'
import type { Hash, Chain, Account } from 'viem'
import type { SimulateContractParameters, SendTransactionParameters } from 'viem'
import type { KernelClient } from '@/types/wallet'

type Data = { to: Hash; value: bigint; data?: Hash }
export type CalldataArgs = Data[]
export type Calldata = SendTransactionParameters<Chain, Account> & Data

export function encodeFnData(params: SimulateContractParameters) {
  const data = encodeFunctionData(params)
  const { address, dataSuffix, value } = params
  const calldata: Calldata = {
    ...params,
    data: `${data}${dataSuffix ? dataSuffix.replace('0x', '') : ''}`,
    to: address,
    value: value || BigInt(0),
  }
  return calldata
}

export async function getReceipt(chainId: number, hash: Hash, retry = 5) {
  try {
    const publicClient = getPublicClient(chainId)
    const receipt = await publicClient!.waitForTransactionReceipt({ hash })

    const { status, from, transactionHash } = receipt
    const success = status === 'success'
    console.log('Receipt:', { success, status, from, transactionHash })

    return { success, status, from, transactionHash, receipt }
  } catch (err) {
    if (retry < 0) throw new Error('Transaction not found or not yet mined.')
    console.log('Transaction not found or not yet mined.', err)

    await wait(1000)
    return getReceipt(chainId, hash, retry - 1)
  }
}

export async function sendUserOp(client: KernelClient, data: CalldataArgs) {
  const callData = await client.account.encodeCalls(data)
  const userOpHash = await client.sendUserOperation({
    callData,
  })

  const wait = getOpReceipt(client, userOpHash)
  return { userOpHash, wait }
}

// View UserOp: https://jiffyscan.xyz/
async function getOpReceipt(client: KernelClient, userOpHash: Hash) {
  const result = await client.waitForUserOperationReceipt({ hash: userOpHash })

  const { success, reason, receipt, sender } = result
  const { transactionHash } = receipt
  console.log('Op Receipt:', { success, sender, userOpHash, reason, transactionHash })

  return { success, sender, userOpHash, reason, transactionHash, receipt, result }
}
