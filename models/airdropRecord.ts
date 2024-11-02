import { models, model, Model, Schema, InferSchemaType } from 'mongoose'
import UserModel from './user'
import TokenModel from '@/models/token'

const schema = new Schema({
  _user: {
    type: Schema.Types.ObjectId,
    ref: UserModel,
    required: true,
    index: true,
  },
  _token: {
    // Only for Club token
    type: Schema.Types.ObjectId,
    ref: TokenModel,
  },
  symbol: { type: String, required: true, index: true },
  amount: { type: String, required: true },
  createdTime: { type: Date, default: Date.now, index: true },
})

export type AirdropRecord = InferSchemaType<typeof schema>

const name = 'AirdropRecord'
const AirdropRecordModel = (models[name] as Model<AirdropRecord>) || model(name, schema)

export default AirdropRecordModel
