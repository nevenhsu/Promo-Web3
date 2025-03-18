'use client'

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react'
import { useAsyncFn } from 'react-use'
import { useLoginStatus } from '@/hooks/useLoginStatus'
import { getBalancesOfAll } from '@/services/tokenBalance'
import type { AsyncState } from 'react-use/lib/useAsyncFn'
import type { TTokenBalance } from '@/models/tokenBalance'

export type OverwriteValue = {
  symbol: string
  chainId: number
  balance: string // base unit, not wei
  wallet: string
}

interface TokenBalanceContextType {
  tokenBalances: TTokenBalance[]
  overwriteTokenBal: (values: OverwriteValue[]) => void
  fetchState: AsyncState<TTokenBalance[]>
  fetchTokenBal: () => Promise<TTokenBalance[]>
}

const TokenBalanceContext = createContext<TokenBalanceContextType | undefined>(undefined)

export const TokenBalanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { nextAuth } = useLoginStatus() // Check if user is logged in
  const [overwrites, setOverwrites] = useState<OverwriteValue[]>([])

  const overwriteTokenBal = (values: OverwriteValue[]) => {
    if (!values.length) return

    const isSame = values.every(v => {
      const prev = overwrites.find(
        o => o.symbol === v.symbol && o.chainId === v.chainId && o.wallet === v.wallet
      )
      return prev && prev.balance === v.balance
    })

    if (isSame) return

    setOverwrites(prev => {
      // Merge overwrites with fetched data
      const newOverwrites = [...prev]

      values.forEach(v => {
        const index = newOverwrites.findIndex(o => o.symbol === v.symbol && o.chainId === v.chainId)
        if (index === -1) {
          newOverwrites.push(v)
        } else {
          newOverwrites[index] = v
        }
      })

      return newOverwrites
    })
  }

  const [fetchState, fetchTokenBal] = useAsyncFn(async () => {
    const { tokens } = await getBalancesOfAll()
    return tokens
  }, [])

  const tokenBalances = useMemo(() => {
    // merge overwrites with fetched data
    if (fetchState.value) {
      return fetchState.value.map(token => {
        const overwrite = overwrites.find(
          o => o.symbol === token.symbol && o.chainId === token.chainId
        )
        return overwrite ? { ...token, ...overwrite } : token
      })
    }

    return []
  }, [fetchState.value, overwrites])

  useEffect(() => {
    if (nextAuth) {
      fetchTokenBal()
    }
  }, [nextAuth])

  return (
    <TokenBalanceContext.Provider
      value={{
        tokenBalances,
        overwriteTokenBal,
        fetchState,
        fetchTokenBal,
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
