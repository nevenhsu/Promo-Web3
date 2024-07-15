import { models, model, Model, Schema, InferSchemaType } from 'mongoose'
import { ActivityStatus } from '@/types/db'

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
  status: { type: Number, enum: ActivityStatus, index: true },
  totalScore: { type: Number, index: true }, // total score ( self + 1st referral + 2nd referral)
  selfScore: Number,
  referral1stScore: Number, // 1st level referral score
  referral2ndScore: Number, // 2nd level referral score
  updatedAt: { type: Date, default: Date.now }, // last updated date
})

export type UserActivityStatus = InferSchemaType<typeof schema>

const name = 'UserActivityStatus'
const UserActivityStatusModel = (models[name] as Model<UserActivityStatus>) || model(name, schema)

export default UserActivityStatusModel
