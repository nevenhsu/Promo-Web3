'use client'

import * as _ from 'lodash-es'
import React, { createContext, useContext, useState, useEffect, useRef } from 'react'
import { useWallet } from '@/wallet/hooks/useWallet'
import { useWeb3 } from '@/wallet/Web3Context'
import { unifyAddress, wait } from '@/wallet/utils/helper'
import type { ContractTransactionResponse } from 'ethers'
import type { ConnectedWallet } from '@privy-io/react-auth'
import type { Web3Provider } from '@ethersproject/providers'

// TODO: use viem

type TxFunction = (...arg: any[]) => Promise<ContractTransactionResponse>

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
  hash?: string
  description?: string
}

interface TxContextType {
  txs: Tx[]
  // addTx: (
  //   contractAddress: string,
  //   fnName: string,
  //   args: any[],
  //   description?: string
  // ) => { timestamp: number } | undefined
}

const TxContext = createContext<TxContextType | undefined>(undefined)

export const TxProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const wallet = useWallet()
  const { chainId } = useWeb3()
  // const { getContract } = contractsValues

  const [txs, setTxs] = useState<Tx[]>([])
  const txsRef = useRef<{ [hash: string]: boolean }>({}) // hash: isHandled

  const addTx = (contractAddr: string, fnName: string, args: any[], description?: string) => {
    if (!chainId) return

    const contractAddress = unifyAddress(contractAddr)
    // const contract = getContract(contractAddr)
    // const fn = _.get(contract, [fnName])
    // const status = contract && fn ? TxStatus.Init : TxStatus.Error
    // const timestamp = Date.now() // unique id

    // const tx: Tx = {
    //   timestamp,
    //   chainId,
    //   contractAddress,
    //   fnName,
    //   status,
    //   description,
    // }

    // add tx to list
    // setTxs(prev => [...prev, tx])

    // // call tx function
    // const txFn = fn as TxFunction
    // callTx(timestamp, txFn, args)

    // return { timestamp }
  }

  const callTx = async (timestamp: number, txFn: TxFunction, args: any[]) => {
    try {
      // update tx hash
      const { hash } = await txFn(...args)
      updateTx(timestamp, { hash, status: TxStatus.Pending })
      console.log(`Transaction hash: ${hash}`)
    } catch (err) {
      // update tx status
      console.error(err)
      updateTx(timestamp, { status: TxStatus.Failed })
    }
  }

  const updateTx = (timestamp: number, newValue: Partial<Tx>) => {
    setTxs(prev => prev.map(o => (o.timestamp === timestamp ? { ...o, ...newValue } : o)))
  }

  const handleTxStatus = async (timestamp: number, hash: string) => {
    if (!wallet) return

    const success = await checkTxStatus(wallet, hash)
    updateTx(timestamp, { status: success ? TxStatus.Success : TxStatus.Failed })
  }

  useEffect(() => {
    if (wallet) {
      if (_.some(txs, o => o.status === TxStatus.Pending)) {
        setTxs(prev =>
          prev.map(o => {
            if (o.status === TxStatus.Pending && o.hash) {
              // handle tx status only once
              if (!txsRef.current[o.hash]) {
                txsRef.current[o.hash] = true
                handleTxStatus(o.timestamp, o.hash)
              }

              return { ...o, status: TxStatus.Confirming }
            }
            return o
          })
        )
      }
    }
  }, [wallet, txs])

  return (
    <TxContext.Provider
      value={{
        txs,
        // addTx,
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

async function checkTxStatus(wallet: ConnectedWallet, hash: string) {
  const provider = await wallet.getEthersProvider()
  return checkTx(provider, hash)
}

async function checkTx(provider: Web3Provider, hash: string) {
  const receipt = await provider.getTransactionReceipt(hash)

  if (receipt === null) {
    console.log('Transaction not found or not yet mined.')
    await wait(2000)
    return checkTx(provider, hash)
  }

  // Check if the transaction was successful
  if (receipt.status === 1) {
    console.log(`Transaction was successful! ${hash}`)
    return true
  }

  console.log(`Transaction failed! ${hash}`)
  return false
}
