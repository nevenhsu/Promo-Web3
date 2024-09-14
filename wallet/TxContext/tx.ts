import { ENTRYPOINT_ADDRESS_V07, bundlerActions } from 'permissionless'
import { encodeFunctionData } from 'viem'
import { getPublicClient } from '@/wallet/lib/publicClients'
import { wait } from '@/wallet/utils/helper'
import type { Hash, SimulateContractParameters } from 'viem'
import type { KernelClient, WalletClient } from '@/types/wallet'

type Data = { to: Hash; value: bigint; data: Hash }
export type Calldata = Data | Data[]

export async function simulateTx(
  client: WalletClient | KernelClient,
  data: SimulateContractParameters
) {
  const chainId = client.chain.id
  const publicClient = getPublicClient(chainId)
  const { request } = await publicClient!.simulateContract({
    ...data,
    account: client.account,
  })

  const calldata = encodeFunctionData(data)
  return { request, calldata }
}

export async function writeTx(
  client: WalletClient | KernelClient,
  data: SimulateContractParameters
) {
  const { request } = await simulateTx(client, data)
  const hash = await client.writeContract(request)
  return { transactionHash: hash }
}

export async function getReceipt(chainId: number, hash: Hash, retry = 5) {
  try {
    const publicClient = getPublicClient(chainId)
    const receipt = await publicClient!.getTransactionReceipt({ hash })

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

export async function sendUserOp(client: KernelClient, data: Calldata) {
  const callData = await client.account.encodeCallData(data)

  const userOpHash = await client.sendUserOperation({
    userOperation: { callData },
  })

  const wait = getOpReceipt(client, userOpHash)
  return { userOpHash, wait }
}

// View UserOp: https://jiffyscan.xyz/
async function getOpReceipt(client: KernelClient, userOpHash: Hash) {
  const bundlerClient = client.extend(bundlerActions(ENTRYPOINT_ADDRESS_V07))
  const result = await bundlerClient.waitForUserOperationReceipt({
    hash: userOpHash,
  })

  const { success, reason, receipt, sender } = result
  const { transactionHash } = receipt

  console.log('Op Receipt:', { success, sender, userOpHash, reason, transactionHash })

  return { success, sender, userOpHash, reason, transactionHash, receipt, result }
}

export function isKernelClient(client: WalletClient | KernelClient): client is KernelClient {
  return (client as KernelClient).sendUserOperation !== undefined
}
