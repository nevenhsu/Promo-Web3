import UserWalletModel from '@/models/userWallet'
import { unifyAddress } from '@/wallet/utils/helper'
import type { WalletData } from '@/models/userWallet'

export async function getUserWallets(userId: string, supported = true) {
  const wallets = await UserWalletModel.find({ _user: userId, supported }).lean()
  return wallets
}

export async function getUserWallet(address: string, supported = true) {
  const wallet = await UserWalletModel.findOne({ address: unifyAddress(address), supported }).lean()
  return wallet
}

export async function updateUserWallet(userId: string, values: WalletData) {
  values.address = unifyAddress(values.address)
  const doc = await UserWalletModel.findOneAndUpdate(
    {
      _user: userId,
      address: values.address,
    },
    values,
    {
      upsert: true,
      new: true,
    }
  )

  return doc
}
