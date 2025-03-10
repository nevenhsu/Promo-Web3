'use client'

import * as _ from 'lodash-es'
import { useMemo } from 'react'
import { tokenManagers } from '@/contracts'
import { computeTokenAddress } from '@/lib/web3/computeTokenAddress'
import { getTokens, type Erc20 } from '@/contracts/tokens'
import { useLoginStatus } from '@/hooks/useLoginStatus'
import { useUserToken } from '@/store/contexts/app/userTokenContext'
import { useTokenBalances } from '@/store/contexts/app/tokenBalanceContext'
import clubTokenJson from '@/contracts/ClubToken.sol/ClubToken.json'

// Get token list from Web3Context
// instead of using this hook directly

type TokenList = {
  defaultTokens: Erc20[]
  userTokens: Erc20[]
  allTokens: Erc20[]
}

export function useTokenList({
  chainId,
  walletAddress,
}: {
  chainId?: number
  walletAddress?: string
}) {
  const { nextAuth } = useLoginStatus()
  const { fetchState } = useTokenBalances()
  const { fetchState: fetchUserTokenState } = useUserToken()

  const loading = !nextAuth || !fetchState.value || !fetchUserTokenState.value

  const values = useMemo<TokenList>(() => {
    const defaultTokens = getTokens(chainId)
    const manager = tokenManagers[chainId || 0]

    const userTokens: Erc20[] = _.filter(fetchUserTokenState.value, o => o.chainId === chainId).map(
      o => ({
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
      })
    )

    if (!walletAddress || !manager) return { defaultTokens, userTokens, allTokens: defaultTokens }

    const clubTokens: Erc20[] = _.filter(
      fetchState.value,
      o => o.chainId === chainId && o._wallet.address === walletAddress
    ).map(o => ({
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

    const allTokens = clubTokens.length
      ? [...defaultTokens, ...clubTokens]
      : [...defaultTokens, ...userTokens]

    return {
      defaultTokens,
      userTokens,
      allTokens,
    }
  }, [chainId, walletAddress, fetchState, fetchUserTokenState])

  return { ...values, loading }
}
