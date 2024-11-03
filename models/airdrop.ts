import { models, model, Model, Schema, InferSchemaType } from 'mongoose'
import UserModel from '@/models/user'
import UserTokenModel from '@/models/userToken'

const schema = new Schema({
  _user: {
    type: Schema.Types.ObjectId,
    ref: UserModel,
    required: true,
    index: true,
  },
  _userToken: {
    // Only for Club token
    type: Schema.Types.ObjectId,
    ref: UserTokenModel,
  },
  chainId: { type: Number, required: true, index: true },
  symbol: { type: String, required: true, index: true },
  receivedAmount: {
    // Base unit, not wei, ex: 10 USDC
    type: Schema.Types.Decimal128,
    get: (v: Schema.Types.Decimal128) => v.toString(),
  },
  pendingAmount: {
    // Base unit, not wei, ex: 10 USDC
    type: Schema.Types.Decimal128,
    get: (v: Schema.Types.Decimal128) => v.toString(),
    index: true,
  },
})

schema.index({ _user: 1, symbol: 1, chainId: 1 }, { unique: true }) // unique index for user, symbol and chainId

export type Airdrop = InferSchemaType<typeof schema> & { _id: string }
export type TAirdrop = Airdrop & {
  receivedAmount: string
  pendingAmount: string
}

const name = 'Airdrop'
const AirdropModel = (models[name] as Model<Airdrop>) || model(name, schema)

export default AirdropModel
