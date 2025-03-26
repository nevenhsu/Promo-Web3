'use client'

import { getUnixTime } from 'date-fns'
import { useWeb3 } from '@/wallet/Web3Context'
import { useTx, type AddTxReturn } from '@/wallet/TxContext'
import { getTokenManager, getActivityManager, getTokenContractByAddress } from '@/contracts'
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

  const createAndDeposit = async (
    data: Pick<ActivityData, 'airdrop' | 'startTime' | 'endTime'>,
    callback?: TxCallback,
    errorHandle?: TxErrorHandle
  ) => {
    const { airdrop, startTime, endTime } = data

    if (!activityManager) throw new Error('Activity manager not found')
    if (!currentClient) throw new Error('Wallet client not found')

    const tokenManager = getTokenManager(currentClient)
    if (!tokenManager) throw new Error('Token manager not found')

    const token = userTokens.find(token => token.symbol === airdrop.symbol)
    if (!token) throw new Error(`Token ${airdrop.symbol} not found`)
    const tokenContract = getTokenContractByAddress(currentClient, token.address)

    const owner = currentClient.account.address
    const startT = getUnixTime(startTime)
    const endT = getUnixTime(endTime)
    const rawAmount = formatAmount(airdrop.amount, token.decimals)
    const amount = BigInt(rawAmount.toString())
    const description = `Create activity and deposit ${airdrop.amount} ${airdrop.symbol}`

    let result: AddTxReturn

    if (isKernelClient(currentClient)) {
      // Tx1: Approve token to activity manager
      // Tx2: Create activity and deposit
      result = addTx(
        currentClient,
        [
          {
            address: token.address,
            functionName: 'approve',
            args: [activityManager.address, amount],
            abi: tokenContract.abi,
          },
          {
            address: activityManager.address,
            functionName: 'createAndDeposit',
            args: [owner, startT, endT, token.address, amount],
            abi: activityManager.abi,
          },
        ],
        { description },
        callback,
        errorHandle
      )
    } else {
      // Permit token to activity manager
      const { v, r, s } = await permitToken(
        currentClient,
        token.address,
        activityManager.address,
        amount,
        endT
      )

      // Create activity and deposit with permit
      result = addTx(
        currentClient,
        {
          address: activityManager.address,
          functionName: 'createAndDepositWithPermit',
          args: [owner, startT, endT, owner, token.address, amount, endT, v, r, s],
          abi: activityManager.abi,
        },
        { description },
        callback,
        errorHandle
      )
    }

    return result
  }

  return {
    createAndDeposit,
  }
}
