import { models, model, Model, Schema, InferSchemaType } from 'mongoose'

export const schema = new Schema({
  _user: {
    type: Schema.Types.ObjectId,
    ref: 'User', // This should match the name of your user model
    required: true,
    index: true,
  },
  address: { type: String, required: true, index: true },
  walletClientType: { type: String, required: true, index: true }, // privy, zerodev, metamask, rainbow, coinbase_wallet, etc...
  connectorType: { type: String, required: true }, // injected, wallet_connect, coinbase_wallet, embedded, etc...
  supported: { type: Boolean, index: true }, // If this wallet is used by our service
})

export type UserWallet = InferSchemaType<typeof schema>

const name = 'UserWallet'
const UserWalletModel = (models[name] as Model<UserWallet>) || model(name, schema)

export default UserWalletModel
