'use client'

import * as _ from 'lodash-es'
import { useEffect } from 'react'
import { useAsyncFn } from 'react-use'
import { useLoginStatus } from '@/hooks/useLoginStatus'
import { useWeb3 } from '@/wallet/Web3Context'
import { useTokenBalances } from '@/store/contexts/app/tokenBalanceContext'
import { clearTokenUpdatedAt } from '@/services/token'
import { isAddressEqual } from '@/wallet/utils/helper'
import { formatAmount, formatBalance } from '@/utils/math'

export function useSyncTokenBal() {
  const { bothAuth } = useLoginStatus()
  const { tokenBalances, overwriteTokenBal } = useTokenBalances()
  const { walletAddress, balancesValues, chainId } = useWeb3()
  const { balances } = balancesValues

  const [clearState, clear] = useAsyncFn(async (userTokenIds: string[]) => {
    if (!userTokenIds.length) return
    const result = await clearTokenUpdatedAt({ userTokenIds })
    return result
  }, [])

  useEffect(() => {
    if (
      !bothAuth ||
      !walletAddress ||
      !chainId ||
      _.isEmpty(balances) ||
      _.isEmpty(tokenBalances)
    ) {
      return
    }

    // compare balances and tokenBalances
    const values = tokenBalances
      .filter(o => o.chainId === chainId)
      .filter(o => {
        const bal = balances[o.symbol]
        if (!bal || !isAddressEqual(o._wallet.address, bal.wallet)) return false

        const docBal = formatAmount(o.balance, o._userToken.decimals)
        return !docBal.eq(bal.balance.toString())
      })
      .map(o => ({
        userTokenId: o._userToken._id,
        symbol: o.symbol,
        chainId: o.chainId,
        wallet: o._wallet.address,
        balance: formatBalance(
          balances[o.symbol]!.balance,
          balances[o.symbol]!.decimals
        ).toString(),
      }))

    if (values.length) {
      overwriteTokenBal(values) // update tokenBalances
      clear(values.map(o => o.userTokenId)) // clear updatedAt
    }
  }, [bothAuth, walletAddress, chainId, balances, tokenBalances])

  return null
}
