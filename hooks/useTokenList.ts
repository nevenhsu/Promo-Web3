'use client'

import * as _ from 'lodash-es'
import { useMemo } from 'react'
import { tokenManagers } from '@/contracts'
import { computeTokenAddress } from '@/lib/web3/computeTokenAddress'
import { getTokens, type Erc20 } from '@/contracts/tokens'
import { useLoginStatus } from '@/hooks/useLoginStatus'
import { useWeb3 } from '@/wallet/Web3Context'
import { useUserToken } from '@/store/contexts/app/userTokenContext'
import { useTokenBalances } from '@/store/contexts/app/tokenBalanceContext'
import clubTokenJson from '@/contracts/ClubToken.sol/ClubToken.json'

type TokenList = {
  defaultTokens: Erc20[]
  userTokens: Erc20[]
  allTokens: Erc20[]
}

export function useTokenList() {
  const { chainId, walletAddress, loading: web3Loading } = useWeb3()
  const { bothAuth, loading: authLoading } = useLoginStatus()
  const { tokenBalances, fetchState } = useTokenBalances()
  const { tokens, fetchState: fetchUserTokenState } = useUserToken()

  const loading = web3Loading || authLoading || fetchState.loading || fetchUserTokenState.loading

  const values = useMemo<TokenList>(() => {
    const defaultTokens = getTokens(chainId)

    const userTokens: Erc20[] = _.map(tokens, o => ({
      chainId: o.chainId,
      symbol: o.symbol,
      name: o.name,
      decimals: o.decimals,
      address: computeTokenAddress({
        contract: manager.address,
        owner: o._wallet.address,
      }),
      icon: o.icon || '',
      abi: clubTokenJson.abi,
      version: '1',
    }))

    const manager = tokenManagers[chainId || 0]
    if (!bothAuth || !chainId || !manager || !walletAddress)
      return { defaultTokens, userTokens, allTokens: [...defaultTokens, ...userTokens] }

    const allTokens: Erc20[] = tokenBalances
      .filter(o => o.chainId === chainId && o._wallet.address === walletAddress)
      .map(o => ({
        chainId: o.chainId,
        symbol: o.symbol,
        name: o._userToken.name,
        decimals: o._userToken.decimals,
        address: computeTokenAddress({
          contract: manager.address,
          owner: o._userToken._wallet.address,
        }),
        icon: o._userToken.icon || '',
        abi: clubTokenJson.abi,
        version: '1',
      }))

    return { defaultTokens, userTokens, allTokens: [...defaultTokens, ...allTokens] }
  }, [bothAuth, chainId, walletAddress, tokenBalances, tokens])

  return { ...values, loading }
}
