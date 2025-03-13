'use client'

import * as _ from 'lodash-es'
import { useState, useEffect } from 'react'
import { useAsyncFn } from 'react-use'
import { createContract } from '@/wallet/lib/createContract'
import { getPublicClient } from '@/wallet/lib/publicClients'
import { eth, type Erc20 } from '@/contracts/tokens'
import type { WalletClient } from 'viem'

// Get current state from Web3Context
// instead of using this hook directly

type UseBalanceParams = {
  tokens: Erc20[]
  loading: boolean
  chainId?: number
  walletClient?: WalletClient
}

type BalanceList = {
  [symbol: string]:
    | {
        balance: bigint // smallest unit
        decimals: number
        wallet: string
      }
    | undefined
}

export function useBalances({ tokens, chainId, walletClient, loading }: UseBalanceParams) {
  const walletAddress = walletClient?.account?.address
  const notReady = !chainId || !walletAddress || loading
  const symbols = tokens.map(o => o.symbol).join('')

  const [balances, setBalances] = useState<BalanceList>({})

  const fetchEthBalance = async (chainId: number, address: `0x${string}`) => {
    const client = getPublicClient(chainId)
    if (client) {
      try {
        const balance = await client.getBalance({ address })
        return balance
      } catch (err) {
        console.error(err)
      }
    }
  }

  const [updateState, updateBalances] = useAsyncFn(async () => {
    const client = getPublicClient(chainId)
    if (notReady || !client) return

    const contracts = tokens.map(o => ({
      contract: createContract(o, client as any),
      ...o,
    }))

    const newBalances: BalanceList = {}
    const balance = await fetchEthBalance(chainId, walletAddress)
    if (balance) {
      newBalances[eth.symbol] = { balance, decimals: eth.decimals, wallet: walletAddress }
    }

    const chunks = _.chunk(contracts, 100)
    for (const chunk of chunks) {
      await Promise.all(
        chunk.map(async o => {
          try {
            const balance = await o.contract?.read.balanceOf([walletAddress])
            if (typeof balance === 'bigint') {
              const { symbol, decimals } = o
              newBalances[symbol] = { balance, decimals, wallet: walletAddress }
            }
          } catch (err) {
            console.error(err)
          }
        })
      )
    }

    setBalances(newBalances)
  }, [notReady, chainId, walletAddress])

  useEffect(() => {
    // reset balances when loading contracts
    if (loading) {
      setBalances({})
    }
  }, [loading])

  useEffect(() => {
    if (!notReady && walletAddress) {
      updateBalances()
    }
  }, [symbols, walletAddress, chainId, notReady])

  return { notReady, balances, loading: loading || updateState.loading, updateBalances }
}
