import { models, model, Model, Schema, InferSchemaType } from 'mongoose'
import { TxStatus } from '@/types/db'

const tokenSchema = new Schema({
  symbol: { type: String, required: true },
  amount: { type: String, required: true }, // Base unit, not wei, ex: 10 USDC
})

export const schema = new Schema({
  chainId: { type: Number, required: true, index: true },
  hash: { type: String, index: true, required: true },
  contract: { type: String, index: true }, // contract address
  _fromWallet: {
    type: Schema.Types.ObjectId,
    ref: 'Wallet', // This should match the name of your wallet model
    index: true,
  },
  _toWallet: {
    type: Schema.Types.ObjectId,
    ref: 'Wallet', // This should match the name of your wallet model
    index: true,
  },
  from: { type: String, index: true }, // non user wallet address
  to: { type: String, index: true }, // non user wallet address
  status: { type: Number, enum: TxStatus, index: true, default: TxStatus.Pending },
  isAirdrop: { type: Boolean, index: true, default: false },
  createdAt: { type: Date, default: Date.now, index: true },
  token: { type: tokenSchema },
  details: { type: Object }, // Additional details
})

export type Transaction = InferSchemaType<typeof schema>

const name = 'Transaction'
const TransactionModel = (models[name] as Model<Transaction>) || model(name, schema)

export default TransactionModel
