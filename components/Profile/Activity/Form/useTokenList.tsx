'use client'

import * as _ from 'lodash-es'
import { useMemo } from 'react'
import { getTokens } from '@/contracts/tokens'
import { useWeb3 } from '@/wallet/Web3Context'
import { useUserToken } from '@/store/contexts/app/userTokenContext'

type Token = {
  symbol: string
  name: string
  decimals: number
}

export function useTokenList() {
  const { chainId } = useWeb3()
  const { tokens } = useUserToken()

  const list = useMemo(() => {
    const defaultTokens = getTokens(chainId)
    const userTokens = _.filter(tokens, { chainId })
    const list = _.concat<Token>(defaultTokens, userTokens)
    return list || []
  }, [chainId, tokens])

  return list
}
