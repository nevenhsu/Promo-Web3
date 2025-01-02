import { models, model, Model, Schema, InferSchemaType } from 'mongoose'
import UserModel from '@/models/user'
import UserWalletModel, { UserWallet } from '@/models/userWallet'

export const schema = new Schema({
  _user: {
    type: Schema.Types.ObjectId,
    ref: UserModel,
    required: true,
    index: true,
  },
  _wallet: {
    type: Schema.Types.ObjectId,
    ref: UserWalletModel,
    required: true,
    index: true,
  },
  chainId: { type: Number, required: true, index: true },
  name: { type: String, required: true, index: true },
  symbol: { type: String, required: true, index: true },
  icon: String,
  verified: { type: Boolean, default: false, index: true }, // for etherscan
})

schema.index({ _user: 1, _wallet: 1, chainId: 1 }, { unique: true })

export type UserToken = InferSchemaType<typeof schema> & { _id: string }
export type TUserToken = Omit<UserToken, '_wallet'> & { _wallet: UserWallet }

const name = 'UserToken'
const UserTokenModel = (models[name] as Model<UserToken>) || model(name, schema)

export default UserTokenModel
