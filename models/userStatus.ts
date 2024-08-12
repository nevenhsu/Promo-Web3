import { models, model, Model, Schema, InferSchemaType } from 'mongoose'
import UserModel from '@/models/user'

export const schema = new Schema({
  _user: {
    type: Schema.Types.ObjectId,
    ref: UserModel,
    required: true,
    index: true,
    unique: true,
  },
  // referral number
  referral1stNumber: { type: Number, default: 0 }, // 1st level referral number
  referral2ndNumber: { type: Number, default: 0 }, // 2nd level referral number
  // score
  totalScore: { type: Number, default: 0.0, index: true }, // total score ( self + 1st referral + 2nd referral)
  selfScore: { type: Number, default: 0.0 },
  // referral score
  referral1stScore: { type: Number, default: 0.0 }, // 1st level referral score
  referral2ndScore: { type: Number, default: 0.0 }, // 2nd level referral score
})

export type UserStatus = InferSchemaType<typeof schema>

const name = 'UserStatus'
export default (models[name] as Model<UserStatus>) || model(name, schema)
