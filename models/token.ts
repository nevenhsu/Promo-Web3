import { models, model, Model, Schema, InferSchemaType } from 'mongoose'
import UserTokenModel from '@/models/userToken'

// for save minted token address

export const schema = new Schema({
  _userToken: {
    type: Schema.Types.ObjectId,
    ref: UserTokenModel,
    required: true,
    index: true,
  },
  chainId: { type: Number, required: true },
  contractAddr: String,
  minted: { type: Boolean, default: false, index: true },
  createdAt: { type: Date, default: Date.now, index: true },
})

export type Token = InferSchemaType<typeof schema> & { _id: string }

const name = 'Token'
const TokenModel = (models[name] as Model<Token>) || model(name, schema)

export default TokenModel
