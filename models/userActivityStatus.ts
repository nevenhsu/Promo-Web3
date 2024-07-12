import { models, model, Model, Schema, InferSchemaType } from 'mongoose'

export const schema = new Schema({
  _activity: {
    type: Schema.Types.ObjectId,
    ref: 'Activity', // This should match the name of your user model
    required: true,
    index: true,
  },
  _user: {
    type: Schema.Types.ObjectId,
    ref: 'User', // This should match the name of your user model
    required: true,
    index: true,
  },
  status: { type: Number, index: true }, // 0: initial, 1: completed, 2: error
  totalScore: { type: Number, index: true }, // total score ( self + 1st referral + 2nd referral)
  selfScore: Number,
  referral1stScore: Number, // 1st level referral score
  referral2ndScore: Number, // 2nd level referral score
  updatedAt: { type: Date, default: Date.now }, // last updated date
})

export type UserActivityStatus = InferSchemaType<typeof schema>

const name = 'UserActivityStatus'
export default (models[name] as Model<UserActivityStatus>) || model(name, schema)
