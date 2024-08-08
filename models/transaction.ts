import { models, model, Model, Schema } from 'mongoose'
import { TxStatus, TxType } from '@/types/db'
import { unifyAddress } from '@/wallet/utils/helper'
import type { InferSchemaType, CallbackWithoutResultAndOptionalError } from 'mongoose'

const tokenSchema = new Schema({
  symbol: { type: String, required: true },
  amount: { type: String, required: true }, // Base unit, not wei, ex: 10 USDC
})

export const schema = new Schema({
  // required
  chainId: { type: Number, required: true, index: true },
  hash: { type: String, required: true, index: true },
  from: { type: String, required: true, index: true }, // non user wallet address
  type: { type: String, enum: TxType, required: true, index: true }, // TxType
  // optional
  to: { type: String, index: true }, // non user wallet address
  contract: { type: String, index: true }, // contract address
  _fromWallet: {
    type: Schema.Types.ObjectId,
    ref: 'UserWallet', // This should match the name of your wallet model
    index: true,
  },
  _toWallet: {
    type: Schema.Types.ObjectId,
    ref: 'UserWallet', // This should match the name of your wallet model
    index: true,
  },
  status: { type: Number, enum: TxStatus, index: true, default: TxStatus.Pending },
  isAirdrop: { type: Boolean, default: false, index: true },
  createdAt: { type: Date, default: Date.now, index: true },
  // details
  token: { type: tokenSchema },
  details: { type: Object }, // Additional details
})

export type Transaction = InferSchemaType<typeof schema>
export type TTransaction = Transaction & {
  _id: string
  isSender: boolean
  isReceiver: boolean
  createdAt: string
}
export type TransactionData = Omit<Transaction, '_fromWallet' | '_toWallet' | 'isAirdrop'>

// Middleware before saving
schema.pre<Transaction>('save', async function (next) {
  this.hash = unifyAddress(this.hash)
  this.from = unifyAddress(this.from)
  if (this.to) {
    this.to = unifyAddress(this.to)
  }
  if (this.contract) {
    this.contract = unifyAddress(this.contract)
  }

  /* @ts-expect-error */
  await this.validate()
  next()
})

// Middleware before updating
const handleUpdate = async function (next: CallbackWithoutResultAndOptionalError) {
  /* @ts-expect-error */
  const update = this.getUpdate()
  if (update && update.hash) {
    update.hash = unifyAddress(update.hash)
  }
  if (update && update.from) {
    update.from = unifyAddress(update.from)
  }
  if (update && update.to) {
    update.to = unifyAddress(update.to)
  }
  if (update && update.contract) {
    update.contract = unifyAddress(update.contract)
  }

  /* @ts-expect-error */
  await this.validate()
  next()
}

schema.pre<Transaction>('findOneAndUpdate', handleUpdate)
schema.pre<Transaction>('updateOne', handleUpdate)
schema.pre<Transaction>('updateMany', handleUpdate)

const name = 'Transaction'
const TransactionModel = (models[name] as Model<Transaction>) || model(name, schema)

export default TransactionModel
