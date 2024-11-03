import { models, model, Model, Schema } from 'mongoose'
import { unifyAddress } from '@/wallet/utils/helper'
import UserModel, { type User } from '@/models/user'
import type { InferSchemaType, CallbackWithoutResultAndOptionalError } from 'mongoose'

export const schema = new Schema({
  _user: {
    type: Schema.Types.ObjectId,
    ref: UserModel,
    required: true,
    index: true,
  },
  address: { type: String, required: true, index: true },
  walletClientType: { type: String, required: true, index: true }, // privy, zerodev, metamask, rainbow, coinbase_wallet, etc...
  connectorType: { type: String, required: true }, // injected, wallet_connect, coinbase_wallet, embedded, etc...
  supported: { type: Boolean, index: true }, // If this wallet is used by our service
})

export type UserWallet = InferSchemaType<typeof schema> & { _id: string }
export type TUserWallet = UserWallet & { _user: User }

// Middleware before saving
schema.pre<UserWallet>('save', async function (next) {
  this.address = unifyAddress(this.address)

  /* @ts-expect-error */
  await this.validate()
  next()
})

// Middleware before updating
const handleUpdate = async function (next: CallbackWithoutResultAndOptionalError) {
  /* @ts-expect-error */
  const update = this.getUpdate()
  if (update && update.address) {
    update.address = unifyAddress(update.address)
    /* @ts-expect-error */
    this.setUpdate(update)
  }

  /* @ts-expect-error */
  await this.validate()
  next()
}

schema.pre<UserWallet>('findOneAndUpdate', handleUpdate)
schema.pre<UserWallet>('updateOne', handleUpdate)
schema.pre<UserWallet>('updateMany', handleUpdate)

const name = 'UserWallet'
const UserWalletModel = (models[name] as Model<UserWallet>) || model(name, schema)

export default UserWalletModel
