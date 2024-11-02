import { models, model, Model, Schema, InferSchemaType } from 'mongoose'
import UserModel from '@/models/user'
import UserWallet from '@/models/userWallet'

export const schema = new Schema({
  _user: {
    type: Schema.Types.ObjectId,
    ref: UserModel,
    required: true,
    index: true,
    unique: true,
  },
  _wallet: {
    type: Schema.Types.ObjectId,
    ref: UserWallet,
    required: true,
  },
  name: { type: String, required: true },
  symbol: { type: String, required: true },
  icon: String,
  minted: { type: Boolean, default: false },
})

export type UserToken = InferSchemaType<typeof schema>

const name = 'UserToken'
const UserTokenModel = (models[name] as Model<UserToken>) || model(name, schema)

export default UserTokenModel
