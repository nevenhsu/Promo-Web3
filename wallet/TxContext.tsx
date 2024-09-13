'use client'

import * as _ from 'lodash-es'
import React, { createContext, useContext, useState } from 'react'
import { useWeb3 } from '@/wallet/Web3Context'
import { getPublicClient } from '@/wallet/lib/publicClients'
import { wait } from '@/wallet/utils/helper'
import { TxStatus } from '@/types/db'
import type { Hash, SimulateContractParameters, WalletClient } from 'viem'

type NativeData = { to: Hash; value: bigint }

export type Tx = {
  timestamp: number // unique id
  chainId: number
  status: TxStatus
  params: NativeData | SimulateContractParameters
  hash?: Hash
  description?: string
  error?: string
}

type OtherValues = {
  description?: string
}

type TxCallback = (values: {
  hash: Hash
  waitSuccess: Promise<boolean>
  timestamp: number // Date.now()
  chainId: number
  account: Hash
}) => Promise<void>

export type TxResult = { timestamp: number; waitTx: () => Promise<Hash | undefined> } | undefined

type AddTxFunc<T> = (data: T, others: OtherValues, callback?: TxCallback) => TxResult

interface TxContextType {
  txs: Tx[]
  addNativeTx: AddTxFunc<NativeData>
  addContractTx: AddTxFunc<SimulateContractParameters>
}

const TxContext = createContext<TxContextType | undefined>(undefined)

export const TxProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { walletClient, onSmartAccount, smartAccountValues } = useWeb3()
  const [txs, setTxs] = useState<Tx[]>([])

  const updateTx = (timestamp: number, newValue: Partial<Tx>) => {
    setTxs(prev => prev.map(o => (o.timestamp === timestamp ? { ...o, ...newValue } : o)))
  }

  // For native token transfer
  const addNativeTx: AddTxFunc<NativeData> = (data, others, callback) => {
    const chainId = walletClient?.chain?.id
    if (!walletClient || !chainId || !data.to || !data.value) return

    const timestamp = Date.now() // unique id

    const tx: Tx = {
      timestamp,
      chainId,
      params: {
        ...data,
      },
      status: TxStatus.Init,
      ...others,
    }

    // add tx to list
    setTxs(prev => [...prev, tx])

    if (data.to && data.value) {
      // send tx
      const txResult = sendNativeTx(
        timestamp,
        {
          to: data.to,
          value: data.value,
        },
        callback
      )

      const waitTx = async () => {
        const hash = await txResult
        return hash
      }

      return { waitTx, timestamp }
    }
  }

  const sendNativeTx = async (
    timestamp: number,
    data: { to: Hash; value: bigint },
    callback?: TxCallback
  ) => {
    try {
      const chainId = walletClient?.chain?.id
      if (!chainId || !walletClient.account) {
        throw new Error('Wallet not found')
      }

      // FIXME: UserOperation reverted during simulation with reason: 0x
      // @ts-ignore
      const hash = await walletClient.sendTransaction({
        ...data,
      })

      // update tx hash
      updateTx(timestamp, { hash, status: TxStatus.Pending })
      console.log(`Transaction hash: ${hash}`)

      // check tx status

      const waitSuccess = handleTxStatus(timestamp, chainId, hash)

      if (callback) {
        callback({ hash, waitSuccess, timestamp, chainId, account: walletClient.account.address })
      }

      return hash
    } catch (err) {
      console.error(err)

      const msg = _.get(err, 'details') || _.get(err, 'message', 'Unknown error')
      const error = msg.includes('gas') ? 'Exceed gas limit. Please try again later.' : msg
      updateTx(timestamp, { status: TxStatus.Failed, error })
    }
  }

  // For contract interaction
  const addContractTx: AddTxFunc<SimulateContractParameters> = (data, others, callback) => {
    const timestamp = Date.now() // unique id

    const chainId = walletClient?.chain?.id
    if (!chainId) return

    const tx: Tx = {
      timestamp,
      chainId,
      params: data,
      status: TxStatus.Init,
      ...others,
    }

    // add tx to list
    setTxs(prev => [...prev, tx])

    // send tx
    const txResult = sendContractTx(timestamp, walletClient, data, callback)

    const waitTx = async () => {
      const hash = await txResult
      return hash
    }

    return { waitTx, timestamp }
  }

  const sendContractTx = async (
    timestamp: number,
    walletClient: WalletClient,
    data: SimulateContractParameters,
    callback?: TxCallback
  ) => {
    try {
      const chainId = walletClient.chain?.id
      if (!chainId || !walletClient.account) {
        throw new Error('Wallet not found')
      }

      const publicClient = getPublicClient(chainId)
      const { request } = await publicClient!.simulateContract({
        ...data,
        account: walletClient.account,
      })

      const hash = await walletClient.writeContract(request)

      // update tx hash
      updateTx(timestamp, { hash, status: TxStatus.Pending })
      console.log(`Transaction hash: ${hash}`)

      // check tx status
      const waitSuccess = handleTxStatus(timestamp, chainId, hash)

      if (callback) {
        callback({ hash, waitSuccess, timestamp, chainId, account: walletClient.account.address })
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
        addNativeTx,
        addContractTx,
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
    const publicClient = getPublicClient(chainId)
    const { status, blockNumber } = await publicClient!.getTransactionReceipt({ hash })

    console.log('TransactionReceipt', { status, blockNumber, hash })

    return status === 'success'
  } catch (err) {
    console.log('Transaction not found or not yet mined.', err)

    await wait(1000)
    return checkTxStatus(chainId, hash)
  }
}
