'use client'

import * as _ from 'lodash-es'
import React, { createContext, useContext, useState } from 'react'
import { useWeb3 } from '@/wallet/Web3Context'
import { unifyAddress } from '@/wallet/utils/helpers'
import type { ContractTransactionResponse } from 'ethers'

type TxFunction = (...arg: any[]) => Promise<ContractTransactionResponse>

enum TxStatus {
  Pending = 'pending',
  Success = 'success',
  Failed = 'failed',
  Error = 'error', // ex: no contract, no function
}

type Tx = {
  chainId: number
  contractAddress: string
  fnName: string
  status: TxStatus
  timestamp: number
  hash?: string
  description?: string
}

interface TxContextType {
  txs: Tx[]
  addTx: (
    contractAddress: string,
    fnName: string,
    args: any[],
    description?: string
  ) => Promise<boolean>
}

const TxContext = createContext<TxContextType | undefined>(undefined)

export const TxProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { chainId, contracts } = useWeb3()
  const [txs, setTxs] = useState<Tx[]>([])

  const addTx = async (contractAddr: string, fnName: string, args: any[], description?: string) => {
    if (!chainId) return false

    const contractAddress = unifyAddress(contractAddr)
    const contract = contracts[contractAddress]
    const fn = _.get(contract, [fnName])
    const status = contract && fn ? TxStatus.Pending : TxStatus.Error
    const timestamp = Date.now()

    const tx: Tx = {
      chainId,
      contractAddress,
      fnName,
      status,
      timestamp,
      description,
    }

    setTxs(prev => [...prev, tx])

    if (contract && fn) {
      try {
        const txFn = fn as TxFunction

        // update tx hash
        const { hash } = await txFn(...args)
        updateTx(timestamp, { hash })
        console.log(`Transaction hash: ${hash}`)

        // TODO: update tx status
        // await wait()

        updateTx(timestamp, { status: TxStatus.Success })

        return true
      } catch (err) {
        // update tx status
        console.error(`Call ${fnName} on ${contractAddress}`, err)
        updateTx(timestamp, { status: TxStatus.Failed })
      }
    }

    return false
  }

  const updateTx = (timestamp: number, newValue: Partial<Tx>) => {
    setTxs(prev => prev.map(o => (o.timestamp === timestamp ? { ...o, ...newValue } : o)))
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
