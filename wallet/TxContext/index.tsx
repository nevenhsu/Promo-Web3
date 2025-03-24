'use client'

import * as _ from 'lodash-es'
import React, { createContext, useContext, useState } from 'react'
import { useWeb3 } from '@/wallet/Web3Context'
import { useErrorHandler } from './useErrorHandler'
import { TxStatus } from '@/types/db'
import { isKernelClient } from '@/wallet/utils/helper'
import { getReceipt, sendUserOp, simulateTx } from './tx'
import { sendByKernelClient } from './kernel'
import { sendByWalletClient } from './wallet'
import type { Hash, SimulateContractParameters } from 'viem'
import type { KernelClient, WalletClient } from '@/types/wallet'
import type { CalldataArgs, Calldata } from './tx'

export type TransactionParameters = Calldata & { native: boolean }
export type DataParams = TransactionParameters | SimulateContractParameters

export type Tx = {
  timestamp: number // unique id
  account: Hash // sender
  chainId: number
  status: TxStatus
  params: DataParams | DataParams[]
  hash?: Hash
  description?: string
  error?: string
}

type OtherValues = {
  description?: string
}

export type TxCallback = (values: {
  hash: Hash
  account: Hash // sender
  userOpHash?: Hash
  success: boolean
  timestamp: number // Date.now()
  chainId: number
  contract?: Hash
}) => Promise<void>

export type TxErrorHandle = (error: unknown) => void

export type AddTxReturn = { timestamp: number } | undefined

type AddTxFunc<T> = (
  data: T,
  others?: OtherValues,
  callback?: TxCallback,
  errorHandle?: TxErrorHandle
) => AddTxReturn

interface TxContextType {
  txs: Tx[]
  addTx: AddTxFunc<DataParams | DataParams[]>
}

const TxContext = createContext<TxContextType | undefined>(undefined)

export const TxProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { handleError, handleFundError } = useErrorHandler()
  const { walletAddress, walletClient } = useWeb3()
  const [txs, setTxs] = useState<Tx[]>([])

  const updateTx = (timestamp: number, newValue: Partial<Tx>) => {
    setTxs(prev => prev.map(o => (o.timestamp === timestamp ? { ...o, ...newValue } : o)))
  }

  // FIXME: refactor this by new function
  const addTx: AddTxFunc<DataParams | DataParams[]> = (data, others, callback, errorHandle) => {
    const chainId = walletClient?.chain.id
    if (!walletAddress || !chainId) return

    const timestamp = Date.now() // unique id

    // add tx to list
    setTxs(prev => [
      ...prev,
      {
        timestamp,
        chainId,
        params: data,
        status: TxStatus.Init,
        account: walletAddress,
        ...others,
      },
    ])

    if (isNativeData(data)) {
      // send tx
      sendTx(timestamp, data, callback, errorHandle)
    } else {
      // simulate tx
      sendContractTx(timestamp, data, callback, errorHandle)
    }

    return { timestamp }
  }

  const sendTxByKernelClient = async (
    timestamp: number,
    client: KernelClient,
    data: DataParams | DataParams[],
    callback?: TxCallback,
    errorHandle?: TxErrorHandle
  ) => {
    try {
      const chainId = client.chain.id
      if (!chainId || !client) {
        throw new Error('Kernel not found')
      }

      updateTx(timestamp, { status: TxStatus.Pending })

      const list = Array.isArray(data) ? data : [data]
      const values: Calldata[] = []

      // set calldata for each tx
      for (const d of list) {
        if (isNativeData(d)) {
          values.push(d)
        } else {
          const { calldata } = await simulateTx(client, d)
          values.push(calldata)
        }
      }

      const { success, hash, opHash } = await sendByKernelClient(client, values)
      console.log('Transaction', { hash, success })

      // update tx hash
      updateTx(timestamp, {
        hash,
        status: success ? TxStatus.Success : TxStatus.Failed,
        error: success ? '' : 'Transaction failed',
      })

      if (callback) {
        callback({
          hash,
          userOpHash: opHash,
          success,
          timestamp,
          chainId,
          account: client.account.address,
        })
      }
    } catch (err) {
      handleErr(err, timestamp, errorHandle)
    }
  }

  const sendTxByWalletClient = async (
    timestamp: number,
    client: WalletClient,
    data: DataParams,
    callback?: TxCallback,
    errorHandle?: TxErrorHandle
  ) => {
    try {
      const chainId = client.chain.id
      if (!chainId || !client) {
        throw new Error('Wallet not found')
      }

      updateTx(timestamp, { status: TxStatus.Pending })

      let value: Calldata
      // set calldata for each tx
      if (isNativeData(data)) {
        value = data
      } else {
        const { calldata } = await simulateTx(client, data)
        value = calldata
      }

      const { success, hash } = await sendByWalletClient(client, value)
      console.log('Transaction', { hash, success })

      // update tx hash
      updateTx(timestamp, {
        hash,
        status: success ? TxStatus.Success : TxStatus.Failed,
        error: success ? '' : 'Transaction failed',
      })

      if (callback) {
        callback({
          hash,
          success,
          timestamp,
          chainId,
          account: client.account.address,
        })
      }
    } catch (err) {
      handleErr(err, timestamp, errorHandle)
    }
  }

  const handleErr = async (err: unknown, timestamp: number, errorHandle?: TxErrorHandle) => {
    const msg = _.get(err, 'details') || _.get(err, 'message', 'Unknown error')
    const error = msg.includes('gas') ? 'Exceed gas limit. Please try again later.' : msg
    updateTx(timestamp, { status: TxStatus.Failed, error })

    handleFundError(err)

    if (errorHandle) {
      errorHandle(err)
    } else {
      handleError(err)
      console.error(err)
    }
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

function isNativeData(data: DataParams): data is TransactionParameters {
  return (data as TransactionParameters).native === true
}
