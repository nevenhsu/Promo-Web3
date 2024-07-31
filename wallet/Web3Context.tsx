'use client'

import * as _ from 'lodash-es'
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react'
import useContracts from '@/wallet/hooks/useContracts'
import { useWallet } from '@/wallet/hooks/useWallet'
import { supportedChains } from './variables'
import { getTokens, type Erc20 } from '@/contracts/tokens'
import type, { Contracts, Contract } from '@/wallet/hooks/useContracts'

type Balances = { [symbol: string]: bigint | undefined }
type Prices = { [symbol: string]: number | undefined }

interface Web3ContextType {
  chainId?: number
  walletAddress: string
  isSmartAccount: boolean
  tokens: Erc20[]
  contracts: Contracts
  balances: Balances
  prices: Prices
  loading: boolean
  updateBalances: () => Promise<void>
  switchChain: (chainId: number) => Promise<void>
  getContract: (address?: string) => Contract | undefined
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined)

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // states
  const [balances, setBalances] = useState<Balances>({})
  const [prices, setPrices] = useState<Prices>({ USDC: 1 })
  const [loading, setLoading] = useState(false)

  const wallet = useWallet()
  const { chainId, contracts, walletAddress, isSmartAccount, ready, getContract } = useContracts()

  const tokens = useMemo(() => getTokens(chainId), [chainId])

  // methods
  const updateBalances = async () => {
    if (!walletAddress) return

    setLoading(true)

    await Promise.all(
      _.map(tokens, async token => {
        try {
          const contract = getContract(token.address)
          if (!contract) throw new Error(`Contract not found: ${token.symbol}`)

          const balance = await contract.balanceOf(walletAddress)
          setBalances(prev => ({ ...prev, [token.symbol]: balance }))
          console.log(`Balance of ${token.symbol}: ${balance}`)
        } catch (err) {
          console.error(err)
        }
      })
    )

    setLoading(false)
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
    if (ready) {
      updateBalances()
    }
  }, [contracts, ready])

  return (
    <Web3Context.Provider
      value={{
        chainId,
        walletAddress,
        isSmartAccount,
        tokens,
        contracts,
        balances,
        prices,
        loading,
        getContract,
        updateBalances,
        switchChain,
      }}
    >
      {children}
    </Web3Context.Provider>
  )
}

export const useWeb3 = (): Web3ContextType => {
  const context = useContext(Web3Context)
  if (context === undefined) {
    throw new Error('useWeb3 must be used within an Web3Provider')
  }
  return context
}
