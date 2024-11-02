import { models, model, Model, Schema, InferSchemaType } from 'mongoose'
import UserModel from '@/models/user'
import UserWalletModel, { UserWallet } from '@/models/userWallet'

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
    ref: UserWalletModel,
    required: true,
  },
  name: { type: String, required: true, index: true },
  symbol: { type: String, required: true, index: true },
  icon: String,
  minted: { type: Boolean, default: false },
})

export type UserToken = InferSchemaType<typeof schema> & { _id: string }
export type TUserToken = Omit<UserToken, '_wallet'> & { _wallet: UserWallet }

const name = 'UserToken'
const UserTokenModel = (models[name] as Model<UserToken>) || model(name, schema)

export default UserTokenModel
