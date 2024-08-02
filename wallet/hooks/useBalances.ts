'use client'

import * as _ from 'lodash-es'
import { useState, useEffect, useMemo } from 'react'
import { useAsyncFn } from 'react-use'
import { getTokens } from '@/contracts/tokens'
import { formatBalance } from '@/utils/math'
import type { useContracts } from '@/wallet/hooks/useContracts'

type ContractsValues = ReturnType<typeof useContracts>
type UseBalanceParams = {
  chainId?: number
  walletAddress?: string
  contractsValues: ContractsValues
}
type Balances = { [symbol: string]: bigint | undefined }

export function useBalances({ chainId, walletAddress, contractsValues }: UseBalanceParams) {
  const { ready, getContract } = contractsValues

  const tokens = useMemo(() => getTokens(chainId), [chainId])
  const [balances, setBalances] = useState<Balances>({})

  const [{ loading }, updateBalances] = useAsyncFn(async () => {
    if (!ready || !walletAddress) return

    await Promise.all(
      _.map(tokens, async token => {
        try {
          const contract = getContract(token.address)
          if (contract) {
            const data = await contract.read.balanceOf([walletAddress])
            if (typeof data === 'bigint') {
              setBalances(prev => ({ ...prev, [token.symbol]: data }))

              console.log(
                `${token.symbol} balance:`,
                formatBalance(data, token.decimal).toDP(2).toString()
              )
            }
          }
        } catch (err) {
          console.error(err)
        }
      })
    )
  }, [ready, walletAddress, tokens])

  // Update balances when contracts are ready
  useEffect(() => {
    if (!ready || !walletAddress) {
      // Clear balances when wallet is disconnected
      setBalances({})
    }
  }, [ready, walletAddress])

  return { balances, loading, updateBalances }
}
