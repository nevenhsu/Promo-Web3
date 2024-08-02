'use client'

import * as _ from 'lodash-es'
import React, { createContext, useContext, useState, useMemo } from 'react'
import { useWallet } from '@/wallet/hooks/useWallet'
import { useSmartAccount } from '@/wallet/hooks/useSmartAccount'
import { useWalletProvider } from '@/wallet/hooks/useWalletProvider'
import { useContracts } from '@/wallet/hooks/useContracts'
import { useBalances } from '@/wallet/hooks/useBalances'
import { useWalletClient } from '@/wallet/hooks/useWalletClient'
import { supportedChains } from './variables'
import { toChainId } from '@/wallet/utils/network'
import { getTokens, type Erc20 } from '@/contracts/tokens'
import type { WalletClient } from 'viem'

type SmartAccountValues = ReturnType<typeof useSmartAccount>
type WalletProviderValues = ReturnType<typeof useWalletProvider>
type ContractsValues = ReturnType<typeof useContracts>
type BalancesValues = ReturnType<typeof useBalances>

type Prices = { [symbol: string]: number | undefined }

interface Web3ContextType {
  chainId?: number
  tokens: Erc20[]
  walletAddress?: string
  walletClient?: WalletClient
  smartAccountValues: SmartAccountValues
  walletProviderValues: WalletProviderValues
  contractsValues: ContractsValues
  balancesValues: BalancesValues
  prices: Prices
  switchChain: (chainId: number) => Promise<void>
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined)

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const wallet = useWallet()
  const chainId = toChainId(wallet?.chainId)
  const tokens = useMemo(() => getTokens(chainId), [chainId])

  // hooks
  const smartAccountValues = useSmartAccount(chainId)
  const walletProviderValues = useWalletProvider(smartAccountValues)
  const { walletAddress, provider } = walletProviderValues
  const { walletClient } = useWalletClient({ chainId, provider })
  const contractsValues = useContracts({ chainId, walletClient })
  const balancesValues = useBalances({ chainId, walletAddress, contractsValues })

  // TODO: usePrices
  const [prices, setPrices] = useState<Prices>({ USDC: 1 })

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
        chainId,
        tokens,
        walletAddress,
        walletClient,
        smartAccountValues,
        walletProviderValues,
        contractsValues,
        balancesValues,
        prices,
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
