'use client'

import * as _ from 'lodash-es'
import React, { createContext, useContext, useMemo, useEffect } from 'react'
import { useAsyncFn } from 'react-use'
import { useWallet } from '@/wallet/hooks/useWallet'
import { getSmartAccount, type SmartAccountValues } from '@/wallet/lib/getSmartAccount'
import { getWalletProvider, type WalletProviderValues } from '@/wallet/lib/getWalletProvider'
import { getWalletClient } from '@/wallet/lib/getWalletClient'
import { getContracts, type Contracts } from '@/wallet/lib/getContracts'
import { useBalances } from '@/wallet/hooks/useBalances'
import { usePrices } from '@/wallet/hooks/usePrices'
import { supportedChains } from './variables'
import { toChainId } from '@/wallet/utils/network'
import { getTokens, type Erc20 } from '@/contracts/tokens'
import type { WalletClient } from 'viem'

type BalancesValues = ReturnType<typeof useBalances>
type PricesValues = ReturnType<typeof usePrices>

type Web3ContextType = {
  loading: boolean
  chainId?: number
  tokens: Erc20[]
  walletAddress?: string
  smartAccountValues?: SmartAccountValues
  walletProviderValues?: WalletProviderValues
  walletClient?: WalletClient
  contracts?: Contracts
  balancesValues: BalancesValues
  pricesValues: PricesValues
  switchChain: (chainId: number) => Promise<void>
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined)

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const wallet = useWallet()
  const chainId = toChainId(wallet?.chainId)
  const tokens = useMemo(() => getTokens(chainId), [chainId])

  // setup
  const [valuesState, setupValues] = useAsyncFn(async () => {
    if (!chainId || !wallet) return
    // get values
    const smartAccountValues = await getSmartAccount(chainId, wallet)
    const walletProviderValues = await getWalletProvider(wallet, smartAccountValues)
    const walletClient = getWalletClient(chainId, walletProviderValues)
    const contracts = walletClient ? getContracts(chainId, walletClient) : {}
    console.log('Current wallet: ', {
      walletAddress: walletProviderValues.walletAddress,
      isSmartAccount: walletProviderValues.isSmartAccount,
    })
    return { contracts, smartAccountValues, walletProviderValues, walletClient }
  }, [chainId, wallet])

  // state
  const { value, loading } = valuesState
  const { contracts, smartAccountValues, walletProviderValues, walletClient } = value || {}
  const { walletAddress } = walletProviderValues || {}

  // hooks
  const balancesValues = useBalances({ chainId, contracts, walletProviderValues, loading })
  const pricesValues = usePrices()

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
    if (chainId && wallet) {
      setupValues()
    }
  }, [chainId, wallet])

  return (
    <Web3Context.Provider
      value={{
        loading,
        chainId,
        tokens,
        walletAddress,
        walletClient,
        smartAccountValues,
        walletProviderValues,
        contracts,
        balancesValues,
        pricesValues,
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
