'use client'

import * as _ from 'lodash-es'
import React, { createContext, useContext, useState, useEffect } from 'react'
import useContracts from '@/wallet/hooks/useContracts'
import { useWallet } from '@/wallet/hooks/useWallet'
import type { Contracts } from '@/contracts'

type Balances = { [symbol: string]: bigint | undefined }

interface ContractsContextType {
  contracts?: Contracts
  balances: Balances
  updateBalances: () => void
}

const ContractContext = createContext<ContractsContextType | undefined>(undefined)

export const ContractProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const contracts = useContracts()
  const wallet = useWallet()
  const [balances, setBalances] = useState<Balances>({})

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
    <ContractContext.Provider value={{ contracts, balances, updateBalances }}>
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
