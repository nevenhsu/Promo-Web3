import { models, model, Model, Schema, InferSchemaType } from 'mongoose'
import { ActivityStatus, ActivityErrorCode } from '@/types/db'

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
  status: { type: Number, enum: ActivityStatus, index: true, required: true },
  error: { type: Number, enum: ActivityErrorCode }, // error code if status is error
  totalScore: { type: Number, index: true, default: 0 }, // total score ( self + 1st referral + 2nd referral)
  selfScore: { type: Number, default: 0 },
  referral1stScore: { type: Number, default: 0 }, // 1st level referral score
  referral2ndScore: { type: Number, default: 0 }, // 2nd level referral score
  updatedAt: { type: Date, default: Date.now }, // last updated date
  finalized: { type: Boolean, default: false, index: true }, // airdrop share finalized
})

schema.index({ _activity: 1, _user: 1 }, { unique: true }) // unique index for activity and user

export type UserActivityStatus = InferSchemaType<typeof schema>
export type TUserActivityStatus = Omit<UserActivityStatus, 'updatedAt'> & { updatedAt: string } // ISO 8601 date string

const name = 'UserActivityStatus'
const UserActivityStatusModel = (models[name] as Model<UserActivityStatus>) || model(name, schema)

export default UserActivityStatusModel
