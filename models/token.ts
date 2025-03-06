import { models, model, Model, Schema, InferSchemaType } from 'mongoose'
import UserModel from '@/models/user'
import UserTokenModel from '@/models/userToken'
import type { UserToken } from '@/models/userToken'

// make sure to user with only one token on one chain

export const schema = new Schema({
  _user: { type: Schema.Types.ObjectId, ref: UserModel, required: true, index: true },
  _userToken: { type: Schema.Types.ObjectId, ref: UserTokenModel, required: true, index: true },
  updatedAt: { type: Date, index: true },
  totalBalance: {
    // Base unit, not wei, ex: 10 USDC
    type: Schema.Types.Decimal128,
    get: (v: Schema.Types.Decimal128) => v.toString(),
    index: true,
    default: '0',
  },
})

schema.index({ _user: 1, _userToken: 1 }, { unique: true })

export type TokenDoc = InferSchemaType<typeof schema> & { _id: string }
export type TTokenDoc = Omit<TokenDoc, '_userToken'> & { _userToken: UserToken }

const name = 'Token'
const TokenModel = (models[name] as Model<TokenDoc>) || model(name, schema)

export default TokenModel
