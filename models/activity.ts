import { models, model, Model, Schema, InferSchemaType } from 'mongoose'
import { ActivityType, SocialMedia, ActivitySettingType } from '@/types/db'

const detailSchema = new Schema({
  link: { type: String, required: true }, // post id, ex: post_id
  fullLink: { type: String, default: '' }, // full post link, ex: https://twitter.com/username/status/post_id
  participants: { type: Number, default: 0 },
  totalScore: { type: Number, default: 0.0 },
  coverUrl: String,
  thumbnailUrl: String,
})

const airdropSchema = new Schema({
  symbol: { type: String, required: true },
  amount: { type: String, required: true }, // Base unit, not wei, ex: 10 USDC
  finalized: { type: Boolean, default: false, index: true }, // airdrop share finalized
})

const bonusSchema = new Schema({
  data: { type: Object, default: { _: '' } }, // custom bonus data
  finalized: { type: Boolean, default: false, index: true }, // bonus share finalized
})

const settingSchema = new Schema({
  data: { type: Object, default: { _: '' } }, // custom settings
  type: { type: String, enum: ActivitySettingType, default: ActivitySettingType.None, index: true },
})

export const schema = new Schema({
  nftId: { type: Number, unique: true, index: true },
  startTime: { type: Date, required: true, index: true },
  endTime: { type: Date, required: true, index: true },
  slug: { type: String, required: true, unique: true, index: true },
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  activityType: { type: Number, enum: ActivityType, required: true },
  socialMedia: { type: String, enum: SocialMedia, required: true },
  setting: { type: settingSchema, default: {} }, // custom settings
  details: { type: detailSchema, required: true },
  airdrop: { type: airdropSchema, required: true },
  bonus: { type: bonusSchema, default: {} },
  published: { type: Boolean, default: false, index: true },
})

export type Activity = InferSchemaType<typeof schema>
export type ActivityDetail = InferSchemaType<typeof detailSchema>
export type ActivityAirdrop = InferSchemaType<typeof airdropSchema>
export type ActivityData = Omit<Activity, 'nftId' | 'details' | 'airdrop' | 'bonus'> & {
  details: Omit<ActivityDetail, 'participants' | 'totalScore'>
  airdrop: Omit<ActivityAirdrop, 'finalized'>
  bonus: Omit<InferSchemaType<typeof bonusSchema>, 'finalized'>
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
