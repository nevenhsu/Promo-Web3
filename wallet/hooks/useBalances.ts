'use client'

import * as _ from 'lodash-es'
import { useState, useEffect } from 'react'
import { useAsyncFn } from 'react-use'
import { getTokens } from '@/contracts/tokens'
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
  const [balances, setBalances] = useState<Balances>({})

  const [{ loading }, updateBalances] = useAsyncFn(async () => {
    if (!walletAddress) return

    const tokens = getTokens(chainId)

    for (const token of tokens) {
      try {
        const contract = getContract(token.address)
        if (!contract) throw new Error(`Contract not found: ${token.symbol}`)

        const balance = await contract.balanceOf(walletAddress)
        setBalances(prev => ({ ...prev, [token.symbol]: balance }))
        console.log(`Balance of ${token.symbol}: ${balance}`)
      } catch (err) {
        console.error(err)
      }
    }
  }, [chainId, walletAddress, getContract])

  // Update balances when contracts are ready
  useEffect(() => {
    if (ready && walletAddress) {
      updateBalances()
    } else {
      // Clear balances when wallet is disconnected
      setBalances({})
    }
  }, [ready, walletAddress])

  return { balances, loading, updateBalances }
}
