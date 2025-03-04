import Decimal from 'decimal.js'
import { getPublicClient } from '@/wallet/lib/publicClients'
import { getBalancesOfToken, updateTokenBalance } from './db/tokenBalance'
import { updateTokenDoc } from './db/token'
import { getTokenContractByPublic } from '@/contracts'
import { formatAmount, formatBalance } from '@/utils/math'

export async function updateBalance(userId: string, userTokenId: string) {
  const tokens = await getBalancesOfToken(userId, userTokenId)

  if (!tokens.length) {
    return []
  }

  const { chainId, _wallet: owner } = tokens[0]._userToken
  const publicClient = getPublicClient(chainId)

  if (!publicClient) {
    throw new Error(`No public client found for chainId: ${chainId}`)
  }

  if (!owner?.address) {
    throw new Error(`No wallet found for userToken: ${userTokenId}`)
  }

  const tokenManager = getTokenContractByPublic(publicClient, owner.address as any)

  // get onchain balances
  const balances = await Promise.all(
    tokens.map(o => tokenManager.read.balanceOf([o._wallet.address as any]))
  )
  const totalBalance = balances.reduce((acc, cur) => acc.add(formatBalance(cur, 6)), new Decimal(0))

  // compare onchain balances with offchain balances
  const isSame = tokens.every(
    (o, i) => formatAmount(o.balance.toString(), 6).toString() === balances[i].toString()
  )

  if (isSame) {
    return tokens.map(o => ({ ...o, balance: o.balance.toString() }))
  }

  const newTokens = tokens.map((o, i) => {
    return {
      ...o,
      balance: formatBalance(balances[i].toString(), 6).toString(),
    }
  })

  // update new balances
  await Promise.all(
    newTokens.map((o, i) =>
      updateTokenBalance(
        o._user.toString(),
        o._wallet._id,
        o._userToken._id,
        chainId,
        o.symbol,
        o.balance.toString()
      )
    )
  )

  // update total balance
  await updateTokenDoc(userId, userTokenId, totalBalance.toString())

  return newTokens
}
