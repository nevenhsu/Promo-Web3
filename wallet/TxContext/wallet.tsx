import { getReceipt } from './tx'
import type { Hash } from 'viem'
import type { WalletClient } from '@/types/wallet'
import type { Calldata } from './tx'

export async function sendByWalletClient(client: WalletClient, calldata: Calldata) {
  let hash: Hash
  let success: boolean

  // Send transaction by wallet
  console.log('Send tx by wallet:', calldata)

  const { transactionHash, wait } = await sendTxByWallet(client, calldata)
  hash = transactionHash // for callback
  const result = await wait
  success = result.success

  return { hash, success }
}

const sendTxByWallet = async (client: WalletClient, calldata: Calldata) => {
  const transactionHash = await client.sendTransaction(calldata)
  const wait = getReceipt(client.chain.id, transactionHash)
  return { transactionHash, wait }
}
