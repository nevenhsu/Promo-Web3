'use client'

import * as _ from 'lodash-es'
import React, { createContext, useContext, useState } from 'react'
import { useWeb3 } from '@/wallet/Web3Context'
import { useErrorHandler } from './useErrorHandler'
import { TxStatus } from '@/types/db'
import { isKernelClient } from '@/wallet/utils/helper'
import { getReceipt, sendUserOp, simulateTx } from './tx'
import type { Hash, SimulateContractParameters } from 'viem'
import type { KernelClient, WalletClient } from '@/types/wallet'
import type { CalldataArgs, Calldata } from './tx'

export type TransactionParameters = Calldata & { native: boolean }
export type DataParams = TransactionParameters | SimulateContractParameters

export type Tx = {
  timestamp: number // unique id
  chainId: number
  status: TxStatus
  params: DataParams
  hash?: Hash
  description?: string
  error?: string
}

type OtherValues = {
  description?: string
}

export type TxCallback = (values: {
  hash: Hash
  userOpHash?: Hash
  success: boolean
  timestamp: number // Date.now()
  chainId: number
  account: Hash
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
  addTx: AddTxFunc<DataParams>
}

const TxContext = createContext<TxContextType | undefined>(undefined)

export const TxProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { handleError, handleFundError } = useErrorHandler()
  const { walletAddress, walletClient } = useWeb3()
  const [txs, setTxs] = useState<Tx[]>([])

  const updateTx = (timestamp: number, newValue: Partial<Tx>) => {
    setTxs(prev => prev.map(o => (o.timestamp === timestamp ? { ...o, ...newValue } : o)))
  }

  const addTx: AddTxFunc<DataParams> = (data, others, callback, errorHandle) => {
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

  const sendContractTx = async (
    timestamp: number,
    data: SimulateContractParameters,
    callback?: TxCallback,
    errorHandle?: TxErrorHandle
  ) => {
    try {
      const chainId = walletClient?.chain.id
      if (!chainId || !walletClient) {
        throw new Error('Wallet not found')
      }

      updateTx(timestamp, { status: TxStatus.Pending })
      const { calldata } = await simulateTx(walletClient, data)

      await sendTx(timestamp, calldata, callback, errorHandle)
    } catch (err) {
      const error = _.get(err, 'details') || _.get(err, 'message', 'Unknown error')
      updateTx(timestamp, { status: TxStatus.Failed, error })

      handleFundError(err)

      if (errorHandle) {
        errorHandle(err)
      } else {
        handleError(err)
        console.error(err)
      }
    }
  }

  const sendTx = async (
    timestamp: number,
    data: Calldata,
    callback?: TxCallback,
    errorHandle?: TxErrorHandle
  ) => {
    try {
      const chainId = walletClient?.chain.id
      if (!chainId || !walletClient) {
        throw new Error('Wallet not found')
      }

      updateTx(timestamp, { status: TxStatus.Pending })

      const { success, hash, opHash } = await sendAndWait(walletClient, data)
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
          account: walletClient.account.address,
        })
      }
    } catch (err) {
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
  }

  const sendAndWait = async (client: WalletClient | KernelClient, calldata: Calldata) => {
    let hash: Hash
    let success: boolean
    let opHash: Hash | undefined

    if (isKernelClient(client)) {
      // Send transaction by smart account
      console.log('Send tx by smart account:', calldata)

      const { userOpHash, wait } = await sendTxBySmartAccount(client, [calldata])
      opHash = userOpHash // for callback
      const result = await wait
      hash = result.transactionHash
      success = result.success
    } else {
      // Send transaction by wallet
      console.log('Send tx by wallet:', calldata)

      const { transactionHash, wait } = await sendTxByWallet(client, calldata)
      hash = transactionHash // for callback
      const result = await wait
      success = result.success
    }

    return { hash, success, opHash }
  }

  const sendTxByWallet = async (client: WalletClient, calldata: Calldata) => {
    const transactionHash = await client.sendTransaction(calldata)
    const wait = getReceipt(client.chain.id, transactionHash)
    return { transactionHash, wait }
  }

  const sendTxBySmartAccount = async (client: KernelClient, args: CalldataArgs) => {
    const { userOpHash, wait } = await sendUserOp(client, args)
    return { userOpHash, wait }
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
