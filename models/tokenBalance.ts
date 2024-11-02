import { models, model, Model, Schema, InferSchemaType } from 'mongoose'
import UserModel from '@/models/user'
import UserTokenModel from '@/models/userToken'

// make sure to user with only one token balance on one chain
// find symbol and chainId to update balance

export const schema = new Schema({
  _user: {
    type: Schema.Types.ObjectId,
    ref: UserModel,
    required: true,
    index: true,
  },
  _userToken: {
    type: Schema.Types.ObjectId,
    ref: UserTokenModel,
    required: true,
    index: true,
  },
  symbol: { type: String, required: true, index: true },
  chainId: { type: Number, required: true, index: true },
  balance: {
    // Base unit, not wei, ex: 10 USDC
    type: Schema.Types.Decimal128,
    get: (v: Schema.Types.Decimal128) => v.toString(),
    index: true,
    required: true,
  },
  updatedAt: { type: Date, default: Date.now, index: true },
})

export type TokenBalance = InferSchemaType<typeof schema> & { _id: string }
export type TTokenBalance = TokenBalance & {
  balance: string
}

const name = 'TokenBalance'
const TokenBalanceModel = (models[name] as Model<TokenBalance>) || model(name, schema)

export default TokenBalanceModel
