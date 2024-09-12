'use client'

import * as _ from 'lodash-es'
import React, { createContext, useContext, useMemo, useState } from 'react'
import { useWallet } from '@/wallet/hooks/useWallet'
import { useSmartAccount } from '@/wallet/hooks/useSmartAccount'
import { useBalances } from '@/wallet/hooks/useBalances'
import { usePrices } from '@/wallet/hooks/usePrices'
import { supportedChains } from './variables'
import { toChainId } from '@/wallet/utils/network'
import { getTokens, type Erc20 } from '@/contracts/tokens'
import type { WalletClient, Hash } from 'viem'

type WalletValues = ReturnType<typeof useWallet>
type SmartAccountValues = ReturnType<typeof useSmartAccount>
type BalancesValues = ReturnType<typeof useBalances>
type PricesValues = ReturnType<typeof usePrices>

type Web3ContextType = {
  loading: boolean
  chainId?: number
  tokens: Erc20[]
  walletAddress?: Hash
  walletClient?: WalletClient
  walletValues: WalletValues
  smartAccountValues: SmartAccountValues
  balancesValues: BalancesValues
  pricesValues: PricesValues
  onSmartAccount: boolean
  setOnSmartAccount: (newValue: boolean) => void
  switchChain: (chainId: number) => Promise<void>
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined)

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Get wallet values
  const walletValues = useWallet()
  const { wallet, currentWalletType } = walletValues
  const chainId = toChainId(wallet?.chainId)
  const tokens = useMemo(() => getTokens(chainId), [chainId])

  // Select smart account
  const smartAccountValues = useSmartAccount()
  const [_onSmartAccount, setOnSmartAccount] = useState(true)
  const onSmartAccount = _onSmartAccount && currentWalletType === 'privy' // only for privy
  const loading = walletValues.loading || smartAccountValues.loading

  // Current wallet value

  const walletClient = !loading
    ? onSmartAccount
      ? smartAccountValues.smartClientWithSponsor
      : walletValues.walletClient
    : undefined
  const walletAddress = walletClient?.account?.address

  // hooks
  const balancesValues = useBalances({ chainId, walletClient, loading })
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

  return (
    <Web3Context.Provider
      value={{
        loading,
        chainId,
        tokens,
        walletAddress,
        walletClient,
        walletValues,
        smartAccountValues,
        balancesValues,
        pricesValues,
        onSmartAccount,
        setOnSmartAccount,
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
