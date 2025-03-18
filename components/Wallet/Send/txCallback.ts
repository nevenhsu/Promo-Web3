import { createTransaction } from '@/services/transaction'
import { TxStatus, TxType } from '@/types/db'
import type { TxCallback } from '@/wallet/TxContext'

type Values = {
  to: string
  symbol: string
  type: TxType
  displayAmount: string
  contract?: string
}

export function saveTxCallback(values: Values) {
  const { to, symbol, type, displayAmount, contract } = values
  const callback: TxCallback = async ({
    hash,
    userOpHash,
    success,
    timestamp,
    chainId,
    account,
  }) => {
    const details = userOpHash ? { userOpHash } : {}
    try {
      const tx = await createTransaction({
        chainId,
        hash,
        from: account,
        type,
        to,
        token: {
          symbol: symbol,
          amount: displayAmount,
        },
        status: success ? TxStatus.Success : TxStatus.Failed,
        createdAt: new Date(timestamp),
        details,
        contract,
      })
    } catch (err) {
      console.error(err)
    }
  }

  return callback
}
