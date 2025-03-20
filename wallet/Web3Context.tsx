'use client'

import * as _ from 'lodash-es'
import React, { createContext, useContext } from 'react'
import { useAppSelector } from '@/hooks/redux'
import { useWallet } from '@/wallet/hooks/useWallet'
import { useSmartAccount } from '@/wallet/hooks/useSmartAccount'
import { useBalances } from '@/wallet/hooks/useBalances'
import { usePrices } from '@/wallet/hooks/usePrices'
import { useTokenList } from '@/wallet/hooks/useTokenList'
import { toChainId } from '@/wallet/utils/network'
import { getPublicClient } from '@/wallet/lib/publicClients'
import { supportedChains } from './variables'
import type { Hash } from 'viem'
import type { PublicClient, SignerClient } from '@/types/wallet'

type WalletValues = ReturnType<typeof useWallet>
type SmartAccountValues = ReturnType<typeof useSmartAccount>
type BalancesValues = ReturnType<typeof useBalances>
type PricesValues = ReturnType<typeof usePrices>
type tokenListValues = ReturnType<typeof useTokenList>

type Web3ContextType = {
  loading: boolean
  chainId?: number
  publicClient?: PublicClient
  walletClient?: SignerClient
  walletAddress?: Hash
  walletValues: WalletValues
  smartAccountValues: SmartAccountValues
  balancesValues: BalancesValues
  pricesValues: PricesValues
  tokenListValues: tokenListValues
  onSmartAccount: boolean
  switchChain: (chainId: number) => Promise<void>
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined)

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { walletLoading, onSmartAccount } = useAppSelector(state => state.wallet)

  // Get wallet values
  const walletValues = useWallet()
  const { wallet } = walletValues

  // Select smart account
  const smartAccountValues = useSmartAccount()
  const loading = walletLoading || smartAccountValues.loading

  // Current wallet value
  const walletClient = !loading
    ? onSmartAccount
      ? smartAccountValues.kernelClient
      : walletValues.walletClient
    : undefined
  const walletAddress = walletClient?.account?.address

  const chainId = toChainId(walletClient?.chain.id)
  const publicClient = getPublicClient(chainId)

  // hooks
  const tokenListValues = useTokenList({ chainId, walletAddress })
  const balancesValues = useBalances({
    chainId,
    walletAddress,
    tokens: tokenListValues.allTokens,
    loading: loading || tokenListValues.loading,
  })
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

  // TODO: auto switch chain

  return (
    <Web3Context.Provider
      value={{
        loading,
        chainId,
        publicClient,
        walletClient,
        walletAddress,
        walletValues,
        smartAccountValues,
        balancesValues,
        pricesValues,
        tokenListValues,
        onSmartAccount,
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
