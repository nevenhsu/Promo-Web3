'use client'

import * as _ from 'lodash-es'
import React, { createContext, useContext, useState, useEffect } from 'react'
import useContracts from '@/wallet/hooks/useContracts'
import { useWallet } from '@/wallet/hooks/useWallet'
import { toChainId } from './utils/network'
import { defaultChain, supportedChains, type SupportedChainIds } from './variables'
import type { Contracts } from '@/contracts'

type Balances = { [symbol: string]: bigint | undefined }
type Prices = { [symbol: string]: number | undefined }

interface ContractsContextType {
  chainId: SupportedChainIds
  contracts: Contracts
  balances: Balances
  prices: Prices
  updateBalances: () => Promise<void>
  switchChain: (chainId: number) => Promise<void>
}

const ContractContext = createContext<ContractsContextType | undefined>(undefined)

export const ContractProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // states
  const [chainId, setChainId] = useState<SupportedChainIds>(defaultChain.id)
  const [balances, setBalances] = useState<Balances>({})
  const [prices, setPrices] = useState<Prices>({ MOCKT: 1 })

  const wallet = useWallet()
  const { contracts, walletAddress } = useContracts()

  // methods
  const updateBalances = async () => {
    if (!wallet) return

    await Promise.all(
      _.map(contracts.tokens, async (token, symbol) => {
        if (token) {
          const balance = await token.balanceOf(walletAddress)
          setBalances(prev => ({ ...prev, [symbol]: balance }))
          console.log(`Balance of ${symbol}: ${balance}`)
        }
      })
    )
  }

  const switchChain = async (chainId: number) => {
    if (!wallet) return

    try {
      if (_.some(supportedChains, { id: chainId })) {
        await wallet.switchChain(chainId)
        setChainId(chainId as SupportedChainIds)
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
      setChainId(toChainId(wallet.chainId) as SupportedChainIds)
    }
  }, [wallet, contracts.tokens])

  return (
    <ContractContext.Provider
      value={{ chainId, contracts, balances, prices, updateBalances, switchChain }}
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
