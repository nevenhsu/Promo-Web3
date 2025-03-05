'use client'

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react'
import { useAsyncFn } from 'react-use'
import { useLoginStatus } from '@/hooks/useLoginStatus'
import { getBalancesOfAll, updateTokenBalance } from '@/services/tokenBalance'
import type { AsyncState } from 'react-use/lib/useAsyncFn'
import type { TTokenBalance } from '@/models/tokenBalance'

type OverwriteValue = {
  symbol: string
  chainId: number
  balance: string // base unit, not wei
}

type UpdateValue = {
  symbol: string
  chainId: number
}

interface TokenBalanceContextType {
  tokenBalances: TTokenBalance[]
  overwriteTokenBal: (value: OverwriteValue) => void
  fetchState: AsyncState<{ tokens: TTokenBalance[] }>
  fetchTokenBal: () => Promise<{ tokens: TTokenBalance[] }>
  updateState: AsyncState<{ tokens: TTokenBalance[] }>
  updateTokenBal: (value: UpdateValue) => Promise<{ tokens: TTokenBalance[] }>
}

const TokenBalanceContext = createContext<TokenBalanceContextType | undefined>(undefined)

export const TokenBalanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { bothAuth } = useLoginStatus() // Check if user is logged in
  const [overwrites, setOverwrites] = useState<OverwriteValue[]>([])

  const overwriteTokenBal = (value: OverwriteValue) => {
    setOverwrites(prev => {
      const index = prev.findIndex(o => o.symbol === value.symbol && o.chainId === value.chainId)
      if (index === -1) {
        return [...prev, value]
      }
      const newOverwrites = [...prev]
      newOverwrites[index] = value
      return newOverwrites
    })
  }

  const [fetchState, fetchTokenBal] = useAsyncFn(async () => {
    const data = await getBalancesOfAll()
    return data
  }, [])

  const tokenBalances = useMemo(() => {
    // merge overwrites with fetched data
    if (fetchState.value) {
      return fetchState.value.tokens.map(token => {
        const overwrite = overwrites.find(
          o => o.symbol === token.symbol && o.chainId === token.chainId
        )
        return overwrite ? { ...token, ...overwrite } : token
      })
    }

    return []
  }, [fetchState.value, overwrites])

  const [updateState, updateTokenBal] = useAsyncFn(async (value: UpdateValue) => {
    const { tokens } = await updateTokenBalance(value)
    return { tokens }
  }, [])

  useEffect(() => {
    if (bothAuth) {
      fetchTokenBal()
    }
  }, [bothAuth])

  return (
    <TokenBalanceContext.Provider
      value={{
        tokenBalances,
        overwriteTokenBal,
        fetchState,
        fetchTokenBal,
        updateState,
        updateTokenBal,
      }}
    >
      {children}
    </TokenBalanceContext.Provider>
  )
}

export function useTokenBalances() {
  const context = useContext(TokenBalanceContext)
  if (!context) {
    throw new Error('useTokenBalances must be used within a TokenBalanceProvider')
  }
  return context
}
