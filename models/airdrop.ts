import { models, model, Model, Schema, InferSchemaType } from 'mongoose'

const schema = new Schema({
  _user: {
    type: Schema.Types.ObjectId,
    ref: 'User', // This should match the name of your user model
    required: true,
    index: true,
  },
  symbol: { type: String, required: true },
  receivedAmount: { type: String, default: '0' }, // Base unit, not wei, ex: 10 USDC
  pendingAmount: { type: String, default: '0' }, // Base unit, not wei, ex: 10 USDC
})

schema.index({ _user: 1, symbol: 1 }, { unique: true }) // unique index for user and symbol

export type Airdrop = InferSchemaType<typeof schema>

const name = 'Airdrop'
const AirdropModel = (models[name] as Model<Airdrop>) || model(name, schema)

export default AirdropModel
