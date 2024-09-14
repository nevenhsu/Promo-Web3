'use client'

import * as _ from 'lodash-es'
import React, { createContext, useContext, useState } from 'react'
import { useWeb3 } from '@/wallet/Web3Context'
import { TxStatus } from '@/types/db'
import { writeTx, getReceipt, sendUserOp, isKernelClient, type Calldata } from './tx'
import type { Hash, SimulateContractParameters } from 'viem'
import type { KernelClient, WalletClient } from '@/types/wallet'

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
  userOpHash?: Hash
  waitSuccess: Promise<boolean>
  timestamp: number // Date.now()
  chainId: number
  account: Hash
}) => Promise<void>

export type TxResult = { timestamp: number; waitTx: () => Promise<Hash | undefined> } | undefined

type AddTxFunc<T> = (data: T, others: OtherValues, callback?: TxCallback) => TxResult

interface TxContextType {
  txs: Tx[]
  addEthTx: AddTxFunc<NativeData>
  addContractTx: AddTxFunc<SimulateContractParameters>
}

const TxContext = createContext<TxContextType | undefined>(undefined)

export const TxProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { walletAddress, walletClient, onSmartAccount, smartAccountValues } = useWeb3()
  const [txs, setTxs] = useState<Tx[]>([])

  const updateTx = (timestamp: number, newValue: Partial<Tx>) => {
    setTxs(prev => prev.map(o => (o.timestamp === timestamp ? { ...o, ...newValue } : o)))
  }

  // === Native token transfer === //
  const addEthTx: AddTxFunc<NativeData> = (data, others, callback) => {
    const chainId = walletClient?.chain.id
    if (!walletAddress || !chainId || !data.to || !data.value) return

    const timestamp = Date.now() // unique id

    const tx: Tx = {
      timestamp,
      chainId,
      params: data,
      status: TxStatus.Init,
      ...others,
    }

    // add tx to list
    setTxs(prev => [...prev, tx])

    if (data.to && data.value) {
      // send tx
      const txResult = sendEthTx(
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

  const sendEthTx = async (
    timestamp: number,
    data: { to: Hash; value: bigint },
    callback?: TxCallback
  ) => {
    try {
      const client = onSmartAccount ? smartAccountValues.withSponsor?.kernelClient : walletClient
      const chainId = client?.chain.id
      if (!chainId || !client) {
        throw new Error('Wallet not found')
      }

      // Send transaction by smart account
      if (onSmartAccount && isKernelClient(client)) {
        updateTx(timestamp, { status: TxStatus.Pending })

        const result = await sendUserOp(client, { ...data, data: '0x' })

        const { success, transactionHash, userOpHash } = result

        updateTx(timestamp, {
          hash: transactionHash,
          status: success ? TxStatus.Success : TxStatus.Failed,
          error: success ? '' : 'Transaction failed',
        })

        return hash
      }

      const hash = await sendEth(client, data)

      // update tx hash
      updateTx(timestamp, { hash, status: TxStatus.Pending })
      console.log(`Transaction hash: ${hash}`)

      // check tx status
      const waitSuccess = getTxReceipt(timestamp, walletClient, hash)

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
  // === End of native token transfer === //

  // === Contract tx === //
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
    const txResult = sendContractTx(timestamp, data, callback)

    const waitTx = async () => {
      const hash = await txResult
      return hash
    }

    return { waitTx, timestamp }
  }

  const sendContractTx = async (
    timestamp: number,
    data: SimulateContractParameters,
    callback?: TxCallback
  ) => {
    try {
      const chainId = walletClient?.chain.id
      if (!chainId || !walletClient.account) {
        throw new Error('Wallet not found')
      }

      const hash = await writeTx(walletClient, data)

      // update tx hash
      updateTx(timestamp, { hash, status: TxStatus.Pending })
      console.log(`Transaction hash: ${hash}`)

      // check tx status
      const waitSuccess = getTxReceipt(timestamp, walletClient, hash)

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
  // === End of contract tx === //

  const getTxReceipt = async (timestamp: number, walletClient: WalletClient, hash: Hash) => {
    const { success } = await getReceipt(walletClient, hash)

    updateTx(timestamp, {
      status: success ? TxStatus.Success : TxStatus.Failed,
      error: success ? '' : 'Transaction failed',
    })
    return success
  }

  // === Send Eth === //
  const sendEthBySmartAccount = async (client: KernelClient, data: NativeData) => {
    const { userOpHash, wait } = await sendUserOp(client, { ...data, data: '0x' })
    return { userOpHash, wait }
  }

  const sendEthByWallet = async (client: WalletClient, data: NativeData) => {
    const transactionHash = await client.sendTransaction({ ...data, data: '0x' })
    const wait = getReceipt(client.chain.id, transactionHash)
    return { transactionHash, wait }
  }

  return (
    <TxContext.Provider
      value={{
        txs,
        addNativeTx: addEthTx,
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
