'use client'

import * as _ from 'lodash-es'
import React, { createContext, useContext, useState, useEffect, useRef } from 'react'
import { useWeb3 } from '@/wallet/Web3Context'
import { getPublicClient } from '@/wallet/lib/publicClients'
import { wait } from '@/wallet/utils/helper'
import { getContract } from '@/wallet/lib/getContracts'
import type { Hash, SimulateContractReturnType, WriteContractReturnType } from 'viem'

type SimulateFn = (...args: any[]) => Promise<SimulateContractReturnType>
type WriteFn = (...args: any[]) => Promise<WriteContractReturnType>

export enum TxStatus {
  Init = 'init', // not yet called
  Pending = 'pending', // called but not yet confirmed
  Confirming = 'confirming', // waiting for confirmations
  Success = 'success',
  Failed = 'failed',
  Error = 'error', // ex: no contract, no function
}

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

type TxCallback = (hash: Hash) => void

interface TxContextType {
  txs: Tx[]
  addTx: (
    values: AddTxValues,
    callback?: TxCallback
  ) => { waitTx: () => Promise<Hash | undefined>; timestamp: number } | undefined
}

const TxContext = createContext<TxContextType | undefined>(undefined)

export const TxProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { chainId, contracts } = useWeb3()

  const [txs, setTxs] = useState<Tx[]>([])
  const txsRef = useRef<{ [hash: string]: boolean }>({}) // hash: isHandled

  const addTx = (values: AddTxValues, callback?: TxCallback) => {
    const { contractAddr, fnName, fnArgs, description } = values
    const contract = getContract(contractAddr, contracts)

    if (!chainId) return

    const simulateFn = contract?.simulate[fnName]
    const writeFn = contract?.write[fnName]

    const valid = contract && simulateFn && writeFn

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
      const txResult = sendTx(
        timestamp,
        {
          simulateFn,
          writeFn,
          fnArgs,
        },
        callback
      )

      const waitTx = async () => {
        const hash = await txResult
        return hash
      }

      return { timestamp, waitTx }
    }
  }

  const sendTx = async (
    timestamp: number,
    values: { simulateFn: SimulateFn; writeFn: WriteFn; fnArgs: any[] },
    callback?: TxCallback
  ) => {
    const { simulateFn, writeFn, fnArgs } = values
    try {
      await simulateFn(fnArgs)
      const hash = await writeFn(fnArgs)

      // update tx hash
      updateTx(timestamp, { hash, status: TxStatus.Pending })
      console.log(`Transaction hash: ${hash}`)

      if (callback) {
        callback(hash)
      }

      return hash
    } catch (err) {
      console.error(err)

      const msg = _.get(err, 'details') || _.get(err, 'message', 'Unknown error')
      const error = msg.includes('gas') ? 'Exceed gas limit. Please try again later.' : msg
      updateTx(timestamp, { status: TxStatus.Failed, error })
    }
  }

  const updateTx = (timestamp: number, newValue: Partial<Tx>) => {
    setTxs(prev => prev.map(o => (o.timestamp === timestamp ? { ...o, ...newValue } : o)))
  }

  const handleTxStatus = async (tx: Tx, hash: Hash) => {
    const success = await checkTxStatus(tx.chainId, hash)
    updateTx(tx.timestamp, {
      status: success ? TxStatus.Success : TxStatus.Failed,
      error: success ? '' : 'Transaction failed',
    })
  }

  useEffect(() => {
    if (_.some(txs, o => o.status === TxStatus.Pending)) {
      setTxs(prev =>
        prev.map(o => {
          if (o.status === TxStatus.Pending && o.hash) {
            // handle tx status only once
            if (!txsRef.current[o.hash]) {
              txsRef.current[o.hash] = true
              handleTxStatus(o, o.hash)
            }

            return { ...o, status: TxStatus.Confirming }
          }
          return o
        })
      )
    }
  }, [txs])

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

    const receipt = await client.getTransactionReceipt({ hash })
    return receipt.status === 'success'
  } catch (err) {
    console.log('Transaction not found or not yet mined.', err)

    await wait(1000)
    return checkTxStatus(chainId, hash)
  }
}
