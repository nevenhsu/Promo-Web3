'use client'

import * as _ from 'lodash-es'
import React, { createContext, useContext, useState, useEffect } from 'react'
import useContracts from '@/wallet/hooks/useContracts'
import { useWallet } from '@/wallet/hooks/useWallet'
import type { Contracts } from '@/contracts'

type Balances = { [symbol: string]: bigint | undefined }
type Prices = { [symbol: string]: number | undefined }

interface ContractsContextType {
  from?: string // signer address
  contracts: Contracts
  balances: Balances
  prices: Prices
  updateBalances: () => Promise<void>
}

const ContractContext = createContext<ContractsContextType | undefined>(undefined)

export const ContractProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const contracts = useContracts()
  const wallet = useWallet()

  // states
  const [balances, setBalances] = useState<Balances>({})
  const [prices, setPrices] = useState<Prices>({ MOCKT: 1 })

  // methods
  const updateBalances = async () => {
    if (!wallet) return

    await Promise.all(
      _.map(contracts.tokens, async (token, symbol) => {
        if (token) {
          const balance = await token.balanceOf(wallet.address)
          setBalances(prev => ({ ...prev, [symbol]: balance }))
          console.log(`Balance of ${symbol}: ${balance}`)
        }
      })
    )
  }

  useEffect(() => {
    if (wallet) updateBalances()
  }, [wallet, contracts.tokens])

  return (
    <ContractContext.Provider
      value={{ from: wallet?.address, contracts, balances, prices, updateBalances }}
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
