'use client'

import * as _ from 'lodash-es'
import { useState, useEffect } from 'react'
import { useAsyncFn } from 'react-use'
import { getTokens, eth } from '@/contracts/tokens'
import { formatBalance } from '@/utils/math'
import { createContract } from '@/wallet/lib/createContract'
import { publicClients } from '@/wallet/lib/publicClients'
import type { WalletClient } from 'viem'

// TODO: get user's token list

// Get current wallet values from Web3Context
// instead of using this hook directly

type UseBalanceParams = {
  chainId?: number
  loading: boolean
  walletClient?: WalletClient
}

type Balances = { [symbol: string]: bigint | undefined } // smallest unit

export function useBalances({ chainId, walletClient, loading }: UseBalanceParams) {
  const walletAddress = walletClient?.account?.address
  const notReady = !chainId || !walletAddress || loading

  const [balances, setBalances] = useState<Balances>({})

  const fetchEthBalance = async (chainId: number, address: `0x${string}`) => {
    const client = publicClients[chainId]
    if (client) {
      try {
        const balance = await client.getBalance({ address })
        if (typeof balance === 'bigint') {
          return {
            balance,
            ...eth,
          }
        }
      } catch (err) {
        console.error(err)
      }
    }
  }

  const [updateState, updateBalances] = useAsyncFn(async () => {
    const tokens = getTokens(chainId)
    if (notReady) return

    // eth balance
    const eth = await fetchEthBalance(chainId, walletAddress)

    // erc20 balance
    const results = await Promise.all(
      tokens.map(async o => {
        try {
          const contract = createContract(o, walletClient)
          if (contract) {
            const balance = await contract.read.balanceOf([walletAddress])
            if (typeof balance === 'bigint') {
              const { symbol, decimals } = o
              return { symbol, decimals, balance }
            }
          }
        } catch (err) {
          console.error(err)
        }
      })
    )

    const newBalances = [...results, eth].reduce((acc, result) => {
      if (result) {
        const { symbol, decimals, balance } = result
        acc[symbol] = balance
        console.log(`${symbol} balance:`, formatBalance(balance, decimals).toFixed(2))
      }
      return acc
    }, {} as Balances)

    setBalances(newBalances)
  }, [notReady, chainId, walletAddress])

  useEffect(() => {
    // reset balances when loading contracts
    if (loading) {
      setBalances({})
    }
  }, [loading])

  useEffect(() => {
    if (notReady) return

    // auto update balances
    updateBalances()
  }, [notReady, chainId, walletAddress])

  return { notReady, balances, loading: loading || updateState.loading, updateBalances }
}
