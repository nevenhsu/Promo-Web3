'use client'

import * as _ from 'lodash-es'
import { useState, useEffect } from 'react'
import { useAsyncFn } from 'react-use'
import { getTokens } from '@/contracts/tokens'
import { formatBalance } from '@/utils/math'
import { getContract, type Contracts } from '@/wallet/lib/getContracts'
import { publicClients } from '@/wallet/lib/publicClients'
import type { WalletProviderValues } from '@/wallet/lib/getWalletProvider'

type UseBalanceParams = {
  chainId?: number
  contracts?: Contracts
  walletProviderValues?: WalletProviderValues
  loading: boolean
}

type Balances = { [symbol: string]: bigint | undefined } // smallest unit

export function useBalances({
  chainId,
  contracts,
  walletProviderValues,
  loading,
}: UseBalanceParams) {
  const { walletAddress } = walletProviderValues || {}
  const notReady = !chainId || !walletAddress || _.isEmpty(contracts) || loading

  const [balances, setBalances] = useState<Balances>({})

  const fetchEthBalance = async (chainId: number, address: `0x${string}`) => {
    const client = publicClients[chainId]
    if (client) {
      try {
        const balance = await client.getBalance({ address })
        if (typeof balance === 'bigint') {
          return {
            symbol: 'ETH',
            balance,
            decimal: 18,
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
      tokens.map(async ({ address, symbol, decimal }) => {
        try {
          const contract = getContract(address, contracts)
          if (contract) {
            const balance = await contract.read.balanceOf([walletAddress])
            if (typeof balance === 'bigint') {
              return { symbol, decimal, balance }
            }
          }
        } catch (err) {
          console.error(err)
        }
      })
    )

    const newBalances = [...results, eth].reduce((acc, result) => {
      if (result) {
        const { symbol, decimal, balance } = result
        acc[symbol] = balance
        console.log(`${symbol} balance:`, formatBalance(balance, decimal).toFixed(2))
      }
      return acc
    }, {} as Balances)

    setBalances(newBalances)
  }, [notReady, chainId, walletAddress, contracts])

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
  }, [notReady, chainId, walletAddress, contracts])

  return { notReady, balances, loading: loading || updateState.loading, updateBalances }
}
