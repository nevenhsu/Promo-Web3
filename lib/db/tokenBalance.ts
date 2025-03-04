import { Types } from 'mongoose'
import TokenBalanceModel from '@/models/tokenBalance'
import type { UserWallet } from '@/models/userWallet'
import type { TUserToken } from '@/models/userToken'

export async function getBalancesOfAll(userId: string) {
  const tokens = await TokenBalanceModel.find({ _user: userId })
    .lean()
    .populate<{ _wallet: UserWallet; _userToken: TUserToken }>([
      '_wallet',
      { path: '_userToken', populate: { path: '_wallet' } },
    ])

  return tokens.map(o => ({ ...o, _userToken: { ...o._userToken, decimals: 6 } }))
}

export async function getBalancesOfToken(userId: string, userTokenId: string) {
  const tokens = await TokenBalanceModel.find({ _user: userId, _userToken: userTokenId })
    .lean()
    .populate<{ _wallet: UserWallet; _userToken: TUserToken }>([
      '_wallet',
      { path: '_userToken', populate: { path: '_wallet' } },
    ])

  return tokens.map(o => ({ ...o, _userToken: { ...o._userToken, decimals: 6 } }))
}

export function updateTokenBalance(
  userId: string,
  walletId: string,
  userTokenId: string,
  chainId: number,
  symbol: string,
  balance: string
) {
  return TokenBalanceModel.findOneAndUpdate(
    { _user: userId, _wallet: walletId, symbol, chainId },
    {
      _userToken: userTokenId,
      balance: Types.Decimal128.fromString(balance),
      updatedAt: new Date(),
    },
    { upsert: true, new: true }
  )
}

export function addTokenBalance(
  userId: string,
  walletId: string,
  userTokenId: string,
  chainId: number,
  symbol: string
) {
  return TokenBalanceModel.findOneAndUpdate(
    { _user: userId, _wallet: walletId, symbol, chainId },
    {
      _userToken: userTokenId,
    },
    { upsert: true, new: true }
  )
}
