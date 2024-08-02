'use client'

import * as _ from 'lodash-es'
import { useState, useEffect } from 'react'
import { useAsyncFn } from 'react-use'
import { getTokens } from '@/contracts/tokens'
import { formatBalance } from '@/utils/math'
import { getContract, type Contracts } from '@/wallet/lib/getContracts'
import type { WalletProviderValues } from '@/wallet/lib/getWalletProvider'

type UseBalanceParams = {
  chainId?: number
  contracts?: Contracts
  walletProviderValues?: WalletProviderValues
  loading: boolean
}
type Balances = { [symbol: string]: bigint | undefined }

export function useBalances({
  chainId,
  contracts,
  walletProviderValues,
  loading,
}: UseBalanceParams) {
  const { walletAddress } = walletProviderValues || {}
  const notReady = !chainId || !walletAddress || _.isEmpty(contracts) || loading

  const [balances, setBalances] = useState<Balances>({})

  const [updateState, updateBalances] = useAsyncFn(async () => {
    const tokens = getTokens(chainId)
    if (notReady) return

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

    const newBalances = results.reduce((acc, result) => {
      if (result) {
        const { symbol, decimal, balance } = result
        acc[symbol] = balance
        console.log(`${symbol} balance:`, formatBalance(balance, decimal).toDP(2).toString())
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
