'use client'

import { getUnixTime } from 'date-fns'
import { useWeb3 } from '@/wallet/Web3Context'
import { useUserToken } from '@/store/contexts/app/userToken'
import { useTx } from '@/wallet/TxContext'
import { getTokenManager, getActivityManager } from '@/contracts'
import { getTokens } from '@/contracts/tokens'
import { permitToken } from '@/lib/web3/eip712'
import { computeTokenAddress } from '@/lib/web3/computeTokenAddress'
import { formatAmount } from '@/utils/math'
import type { TxCallback, TxErrorHandle } from '@/wallet/TxContext'
import type { ActivityData } from '@/models/activity'

export function useActivityTx() {
  const { chainId, walletClient } = useWeb3()
  const { txs, addTx } = useTx()
  const { tokens } = useUserToken()

  const activityManager = walletClient ? getActivityManager(walletClient) : undefined

  const createAndDepositWithPermit = async (
    data: ActivityData,
    callback?: TxCallback,
    errorHandle?: TxErrorHandle
  ) => {
    const { airdrop, startTime, endTime } = data
    const { symbol, amount } = airdrop

    if (!activityManager) throw new Error('Activity manager not found')
    if (!walletClient) throw new Error('Wallet client not found')

    const tokenManager = getTokenManager(walletClient)
    if (!tokenManager) throw new Error('Token manager not found')

    const defaultTokens = getTokens(chainId)
    const defaultToken = defaultTokens.find(token => token.symbol === symbol)

    let tokenAddress = '' as any
    let decimals = 0

    if (defaultToken) {
      tokenAddress = defaultToken.address
      decimals = defaultToken.decimals
    } else {
      const token = tokens?.find(token => token.symbol === symbol)
      if (!token) throw new Error('Token not found')

      tokenAddress = computeTokenAddress({
        contract: tokenManager.address,
        owner: token._wallet.address,
      })
      decimals = 6
    }

    if (!tokenAddress) throw new Error('Token address not found')

    const startT = getUnixTime(startTime)
    const endT = getUnixTime(endTime)

    const { v, r, s } = await permitToken(
      walletClient,
      tokenAddress,
      activityManager.address,
      BigInt(airdrop.amount),
      BigInt(endT)
    )

    const owner = walletClient.account.address
    const rawAmount = formatAmount(amount, decimals)

    const result = addTx(
      {
        address: activityManager.address,
        functionName: 'createAndDepositWithPermit',
        args: [owner, startT, endT, tokenAddress, owner, rawAmount, endT, Number(v), r, s],
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
