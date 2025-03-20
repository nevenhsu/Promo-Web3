import { encodeFunctionData } from 'viem'
import { getPublicClient } from '@/wallet/lib/publicClients'
import { wait } from '@/wallet/utils/helper'
import type { Hash, Chain, Account } from 'viem'
import type { SimulateContractParameters, SendTransactionParameters } from 'viem'
import type { KernelClient, WalletClient } from '@/types/wallet'

type Data = { to: Hash; value: bigint; data?: Hash }
export type CalldataArgs = Data[]
export type Calldata = SendTransactionParameters<Chain, Account> & Data

export async function simulateTx(
  client: WalletClient | KernelClient,
  params: SimulateContractParameters
) {
  const chainId = client.chain.id
  const publicClient = getPublicClient(chainId)
  const { request } = await publicClient!.simulateContract({
    ...params,
    account: client.account,
  })

  const data = encodeFunctionData(params)
  const { abi, address, args, dataSuffix, functionName, value, ...others } = request
  const calldata: Calldata = {
    data: `${data}${dataSuffix ? dataSuffix.replace('0x', '') : ''}`,
    to: address,
    value: value || BigInt(0),
    ...others,
  }
  return {
    request,
    calldata,
  }
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

export function isKernelClient(client: WalletClient | KernelClient): client is KernelClient {
  return (client as KernelClient).sendUserOperation !== undefined
}

export function isWalletClient(client: WalletClient | KernelClient): client is WalletClient {
  return (client as WalletClient).sendTransaction !== undefined
}
