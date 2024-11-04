import { models, model, Model, Schema, InferSchemaType } from 'mongoose'
import UserModel from '@/models/user'
import UserTokenModel from '@/models/userToken'
import { ActivityType, SocialMedia, ActivitySettingType } from '@/types/db'

const detailSchema = new Schema({
  link: { type: String, required: true }, // post id, ex: post_id
  fullLink: { type: String, default: '' }, // full post link, ex: https://twitter.com/username/status/post_id
  externalLink: { type: String, default: '' }, // external link, ex: https://example.com
  participants: { type: Number, default: 0 },
  totalScore: { type: Number, default: 0.0 },
  coverUrl: String,
  thumbnailUrl: String,
})

const airdropSchema = new Schema({
  _userToken: {
    // Only for Club token
    type: Schema.Types.ObjectId,
    ref: UserTokenModel,
  },
  symbol: { type: String, required: true },
  finalized: { type: Boolean, default: false, index: true }, // airdrop share finalized
  // base unit, not wei
  amount: { type: String, required: true }, // only by admin
})

const settingSchema = new Schema({
  data: { type: Object, default: { minFollowers: 100 } }, // custom settings
  type: { type: String, enum: ActivitySettingType, default: ActivitySettingType.None, index: true },
})

const nftSchema = new Schema({
  nftId: { type: Number, required: true, index: true },
  distributed: { type: Boolean, default: false, index: true },
  // base unit, not wei
  totalAmount: String,
  distributedAmount: String,
  refundedAmount: String,
  feeAmount: String,
})

export const schema = new Schema({
  _user: {
    type: Schema.Types.ObjectId,
    ref: UserModel,
    index: true,
  },
  chainId: { type: Number, required: true, index: true },
  startTime: { type: Date, required: true, index: true },
  endTime: { type: Date, required: true, index: true },
  slug: { type: String, unique: true, index: true, default: '' },
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  activityType: { type: Number, enum: ActivityType, required: true },
  socialMedia: { type: String, enum: SocialMedia, required: true },
  setting: {
    type: settingSchema,
    default: {
      data: { minFollowers: 100 },
      type: ActivitySettingType.None,
    },
  }, // custom settings
  details: { type: detailSchema, required: true },
  airdrop: { type: airdropSchema, required: true },
  nft: { type: nftSchema },
  published: { type: Boolean, default: false, index: true },
  ended: { type: Boolean, default: false, index: true }, // for settling activity
})

export type Activity = InferSchemaType<typeof schema>
export type ActivityDetail = InferSchemaType<typeof detailSchema>
export type ActivityAirdrop = InferSchemaType<typeof airdropSchema>
export type ActivityNFT = InferSchemaType<typeof nftSchema>
export type ActivityData = Omit<Activity, '_user' | 'nft' | 'details' | 'airdrop' | 'ended'> & {
  details: Omit<ActivityDetail, 'participants' | 'totalScore'>
  airdrop: Omit<ActivityAirdrop, '_userToken' | 'finalized'>
}
export type TActivity = Omit<Activity, 'startTime' | 'endTime'> & {
  _id: string
  startTime: string // ISO 8601 date string
  endTime: string // ISO 8601 date string
}
export type TPublicActivity = TActivity & { joined: boolean }

const name = 'Activity'
const ActivityModel = (models[name] as Model<Activity>) || model(name, schema)

export default ActivityModel
