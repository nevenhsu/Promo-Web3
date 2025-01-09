'use client'

import * as _ from 'lodash-es'
import { useState, useMemo } from 'react'
import { useTx, type TxCallback } from '@/wallet/TxContext'
import { useWeb3 } from '@/wallet/Web3Context'
import { getTokenManager } from '@/contracts'

export function useMint() {
  const { walletClient } = useWeb3()
  const { txs, addTx } = useTx()

  const [txTimestamp, setTxTimestamp] = useState(0)

  const tx = useMemo(() => {
    return txTimestamp ? _.find(txs, { timestamp: txTimestamp }) : undefined
  }, [txs, txTimestamp])

  const callMint = async (name: string, symbol: string, callback?: TxCallback) => {
    if (!walletClient) {
      throw new Error('No wallet connected')
    }

    const tokenManager = getTokenManager(walletClient)

    const description = `Mint ${name} (${symbol})`

    const result = addTx(
      {
        address: tokenManager.address,
        functionName: 'deploy',
        args: [name, symbol],
        abi: tokenManager.abi,
      },
      {
        description,
      },
      callback
    )

    if (result) {
      setTxTimestamp(result.timestamp)
    }
  }

  return { callMint, tx }
}
