import { models, model, Model, Schema, InferSchemaType } from 'mongoose'
import { ActivityStatus, ActivityErrorCode } from '@/types/db'
import ActivityModel, { type Activity } from '@/models/activity'
import UserModel from '@/models/user'
import UserTokenModel from '@/models/userToken'
import { SocialMedia } from '@/types/db'

const airdropSchema = new Schema({
  _userToken: {
    // Only for Club token
    type: Schema.Types.ObjectId,
    ref: UserTokenModel,
  },
  symbol: { type: String, default: '', index: true }, // Token symbol, ex: USDC
  amount: { type: String, default: '' }, // Base unit, not wei, ex: 10 USDC
  airdropped: { type: Boolean, default: false, index: true },
})

export const schema = new Schema({
  _user: {
    type: Schema.Types.ObjectId,
    ref: UserModel,
    required: true,
    index: true,
  },
  _activity: {
    type: Schema.Types.ObjectId,
    ref: ActivityModel,
    required: true,
    index: true,
  },
  chainId: { type: Number, required: true, index: true },
  socialMedia: { type: String, enum: SocialMedia, required: true, index: true }, // social media type for activity
  status: {
    type: Number,
    enum: ActivityStatus,
    index: true,
    default: ActivityStatus.Unjoined,
  },
  error: { type: Number, enum: ActivityErrorCode }, // error code if status is error
  totalScore: { type: Number, index: true, default: 0.0 }, // total score ( self + 1st referral + 2nd referral)
  selfScore: { type: Number, default: 0.0 },
  referral1stScore: { type: Number, default: 0.0 }, // 1st level referral score
  referral2ndScore: { type: Number, default: 0.0 }, // 2nd level referral score
  details: { type: Object }, // additional details
  updatedAt: { type: Date, default: Date.now, index: true }, // last updated date
  finalized: { type: Boolean, default: false, index: true }, // airdrop amount finalized
  airdrop: { type: airdropSchema, default: { amount: '', airdropped: false } }, // airdrop amount
})

schema.index({ _activity: 1, _user: 1 }, { unique: true }) // unique index for activity and user

export type UserActivityStatus = InferSchemaType<typeof schema>
export type TUserActivityStatus = Omit<UserActivityStatus, 'updatedAt'> & { updatedAt: string } // ISO 8601 date string
export type TUserActivityStatusData = TUserActivityStatus & { _id: string; _activity: Activity }

const name = 'UserActivityStatus'
const UserActivityStatusModel = (models[name] as Model<UserActivityStatus>) || model(name, schema)

export default UserActivityStatusModel
