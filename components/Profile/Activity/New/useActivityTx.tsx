'use client'

import { getUnixTime } from 'date-fns'
import { useWeb3 } from '@/wallet/Web3Context'
import { useTx } from '@/wallet/TxContext'
import { getTokenManager, getActivityManager } from '@/contracts'
import { permitToken } from '@/lib/web3/eip712'
import { formatAmount } from '@/utils/math'
import { isKernelClient } from '@/wallet/utils/helper'
import type { TxCallback, TxErrorHandle } from '@/wallet/TxContext'
import type { ActivityData } from '@/models/activity'

export function useActivityTx() {
  const { addTx } = useTx()
  const { currentClient, tokenListValues } = useWeb3()
  const { userTokens } = tokenListValues

  const activityManager = currentClient ? getActivityManager(currentClient) : undefined

  const createAndDepositWithPermit = async (
    data: Pick<ActivityData, 'airdrop' | 'startTime' | 'endTime'>,
    callback?: TxCallback,
    errorHandle?: TxErrorHandle
  ) => {
    const { airdrop, startTime, endTime } = data
    const { symbol, amount } = airdrop

    if (!activityManager) throw new Error('Activity manager not found')
    if (!currentClient) throw new Error('Wallet client not found')

    const tokenManager = getTokenManager(currentClient)
    if (!tokenManager) throw new Error('Token manager not found')

    const token = userTokens.find(token => token.symbol === symbol)
    if (!token) throw new Error(`Token ${symbol} not found`)

    const startT = getUnixTime(startTime)
    const endT = getUnixTime(endTime)
    const rawAmount = formatAmount(amount, token.decimals)

    // FIXME: permitToken should only be called by EOASignerClient

    const { v, r, s } = await permitToken(
      walletClient,
      token.address,
      activityManager.address,
      BigInt(rawAmount.toString()),
      BigInt(endT)
    )

    const owner = walletClient.account.address

    const result = addTx(
      {
        address: activityManager.address,
        functionName: 'createAndDepositWithPermit',
        args: [owner, startT, endT, token.address, rawAmount, endT, Number(v), r, s],
        abi: activityManager.abi,
      },
      {
        description: `Create activity and deposit ${amount} ${symbol}`,
      },
      callback,
      errorHandle
    )

    return result
  }

  return {
    createAndDepositWithPermit,
  }
}
