'use client'

import * as _ from 'lodash-es'
import React, { createContext, useContext, useState } from 'react'
import { useWeb3 } from '@/wallet/Web3Context'
import { getPublicClient } from '@/wallet/lib/publicClients'
import { wait } from '@/wallet/utils/helper'
import { useContracts } from '@/wallet/hooks/useContracts'
import { TxStatus } from '@/types/db'
import type { Hash, SimulateContractReturnType, WriteContractReturnType } from 'viem'

type SimulateFn = (...args: any[]) => Promise<SimulateContractReturnType>
type WriteFn = (...args: any[]) => Promise<WriteContractReturnType>

export type Tx = {
  timestamp: number // unique id
  chainId: number
  contractAddr: string
  fnName: string
  status: TxStatus
  hash?: Hash
  description?: string
  error?: string
}

type AddTxValues = {
  contractAddr: string
  fnName: string
  fnArgs: any[]
  description?: string
}

type TxCallback = (values: {
  hash: Hash
  waitSuccess: Promise<boolean>
  timestamp: number // Date.now()
}) => Promise<void>

interface TxContextType {
  txs: Tx[]
  addTx: (
    values: AddTxValues,
    callback?: TxCallback
  ) => { waitTx: () => Promise<Hash | undefined>; timestamp: number } | undefined
}

const TxContext = createContext<TxContextType | undefined>(undefined)

export const TxProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { chainId } = useWeb3()
  const { getContract } = useContracts()

  const [txs, setTxs] = useState<Tx[]>([])

  const updateTx = (timestamp: number, newValue: Partial<Tx>) => {
    setTxs(prev => prev.map(o => (o.timestamp === timestamp ? { ...o, ...newValue } : o)))
  }

  const addTx = (values: AddTxValues, callback?: TxCallback) => {
    const { contractAddr, fnName, fnArgs, description } = values
    const contract = getContract(contractAddr)

    if (!chainId) return

    const simulateFn = contract?.simulate[fnName]
    const writeFn = contract?.write[fnName]

    const valid = !!contract && !!simulateFn && !!writeFn
    const status = valid ? TxStatus.Init : TxStatus.Error
    const timestamp = Date.now() // unique id

    const tx: Tx = {
      timestamp,
      chainId,
      contractAddr,
      fnName,
      status,
      description,
    }

    // add tx to list
    setTxs(prev => [...prev, tx])

    if (valid) {
      // send tx
      const txResult = sendTx({ timestamp, chainId }, { simulateFn, writeFn, fnArgs }, callback)

      const waitTx = async () => {
        const hash = await txResult
        return hash
      }

      return { timestamp, waitTx }
    }
  }

  const sendTx = async (
    data: { timestamp: number; chainId: number },
    fn: { simulateFn: SimulateFn; writeFn: WriteFn; fnArgs: any[] },
    callback?: TxCallback
  ) => {
    const { timestamp, chainId } = data
    const { simulateFn, writeFn, fnArgs } = fn
    try {
      await simulateFn(fnArgs)
      const hash = await writeFn(fnArgs)

      // update tx hash
      updateTx(timestamp, { hash, status: TxStatus.Pending })
      console.log(`Transaction hash: ${hash}`)

      // check tx status
      const waitSuccess = handleTxStatus(timestamp, chainId, hash)

      if (callback) {
        callback({ hash, waitSuccess, timestamp })
      }

      return hash
    } catch (err) {
      console.error(err)

      const msg = _.get(err, 'details') || _.get(err, 'message', 'Unknown error')
      const error = msg.includes('gas') ? 'Exceed gas limit. Please try again later.' : msg
      updateTx(timestamp, { status: TxStatus.Failed, error })
    }
  }

  const handleTxStatus = async (timestamp: number, chainId: number, hash: Hash) => {
    const success = await checkTxStatus(chainId, hash)
    updateTx(timestamp, {
      status: success ? TxStatus.Success : TxStatus.Failed,
      error: success ? '' : 'Transaction failed',
    })
    return success
  }

  return (
    <TxContext.Provider
      value={{
        txs,
        addTx,
      }}
    >
      {children}
    </TxContext.Provider>
  )
}

export const useTx = (): TxContextType => {
  const context = useContext(TxContext)
  if (context === undefined) {
    throw new Error('useTx must be used within an TxProvider')
  }
  return context
}

async function checkTxStatus(chainId: number, hash: Hash) {
  try {
    const client = getPublicClient(chainId)
    if (!client) return false

    const { status, blockNumber } = await client.getTransactionReceipt({ hash })

    console.log('TransactionReceipt', { status, blockNumber, hash })

    return status === 'success'
  } catch (err) {
    console.log('Transaction not found or not yet mined.', err)

    await wait(1000)
    return checkTxStatus(chainId, hash)
  }
}
