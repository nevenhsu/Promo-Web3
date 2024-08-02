'use client'

import * as _ from 'lodash-es'
import React, { createContext, useContext, useState, useEffect, useRef } from 'react'
import { useWeb3 } from '@/wallet/Web3Context'
import { getPublicClient } from '@/wallet/publicClients'
import { wait } from '@/wallet/utils/helper'
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
  contractAddress: string
  fnName: string
  status: TxStatus
  hash?: Hash
  description?: string
  error?: string
}

interface TxContextType {
  txs: Tx[]
  addTx: (
    contractAddress: string,
    fnName: string,
    args: any[],
    description?: string
  ) => { waitTx: () => Promise<Hash | undefined>; timestamp: number } | undefined
}

const TxContext = createContext<TxContextType | undefined>(undefined)

export const TxProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { chainId, contractsValues } = useWeb3()
  const { getContract } = contractsValues

  const [txs, setTxs] = useState<Tx[]>([])
  const txsRef = useRef<{ [hash: string]: boolean }>({}) // hash: isHandled

  const addTx = (contractAddress: string, fnName: string, args: any[], description?: string) => {
    const contract = getContract(contractAddress)

    if (!chainId || !contract) return

    const simulateFn = contract.simulate[fnName]
    const writeFn = contract.write[fnName]

    const status = contract && Boolean(simulateFn) ? TxStatus.Init : TxStatus.Error
    const timestamp = Date.now() // unique id

    const tx: Tx = {
      timestamp,
      chainId,
      contractAddress,
      fnName,
      status,
      description,
    }

    // add tx to list
    setTxs(prev => [...prev, tx])

    // send tx
    const txResult = sendTx(timestamp, {
      simulateFn,
      writeFn,
      args,
    })

    const waitTx = async () => {
      const hash = await txResult
      return hash
    }

    return { timestamp, waitTx }
  }

  const sendTx = async (
    timestamp: number,
    values: { simulateFn: SimulateFn; writeFn: WriteFn; args: any[] }
  ) => {
    const { simulateFn, writeFn, args } = values
    try {
      await simulateFn(args)
      const hash = await writeFn(args)

      // update tx hash
      updateTx(timestamp, { hash, status: TxStatus.Pending })
      console.log(`Transaction hash: ${hash}`)

      return hash
    } catch (err) {
      console.error(err)

      const msg = _.get(err, 'details') || _.get(err, 'message', 'Unknown error')
      const error = msg.includes('gas') ? 'Insufficient gas. Please try again later.' : msg
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
