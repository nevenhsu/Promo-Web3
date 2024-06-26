'use client'

import * as _ from 'lodash-es'
import React, { createContext, useContext, useState, useEffect } from 'react'
import useContracts from '@/wallet/hooks/useContracts'
import { useWallet } from '@/wallet/hooks/useWallet'
import { supportedChains } from './variables'
import type { Contracts } from '@/contracts'

type Balances = { [symbol: string]: bigint | undefined }
type Prices = { [symbol: string]: number | undefined }

interface ContractsContextType {
  chainId?: number
  walletAddress: string
  isSmartAccount: boolean
  contracts: Contracts
  balances: Balances
  prices: Prices
  updateBalances: () => Promise<void>
  switchChain: (chainId: number) => Promise<void>
}

const ContractContext = createContext<ContractsContextType | undefined>(undefined)

export const ContractProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // states
  const [balances, setBalances] = useState<Balances>({})
  const [prices, setPrices] = useState<Prices>({ MOCKT: 1 })

  const wallet = useWallet()
  const { chainId, contracts, walletAddress, isSmartAccount } = useContracts()

  // methods
  const updateBalances = async () => {
    if (!walletAddress) return

    await Promise.all(
      _.map(contracts.tokens, async (token, symbol) => {
        if (token) {
          try {
            const balance = await token.balanceOf(walletAddress)
            setBalances(prev => ({ ...prev, [symbol]: balance }))
            console.log(`Balance of ${symbol}: ${balance}`)
          } catch (err) {
            console.error(err)
          }
        }
      })
    )
  }

  const switchChain = async (chainId: number) => {
    if (!wallet) return

    try {
      if (_.some(supportedChains, { id: chainId })) {
        await wallet.switchChain(chainId)
      } else {
        throw new Error('Unsupported chain')
      }
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    if (wallet) {
      updateBalances()
    }
  }, [wallet, chainId, walletAddress])

  return (
    <ContractContext.Provider
      value={{
        chainId,
        walletAddress,
        isSmartAccount,
        contracts,
        balances,
        prices,
        updateBalances,
        switchChain,
      }}
    >
      {children}
    </ContractContext.Provider>
  )
}

export const useContractContext = (): ContractsContextType => {
  const context = useContext(ContractContext)
  if (context === undefined) {
    throw new Error('useContractContext must be used within an ContractProvider')
  }
  return context
}
