import { models, model, Model, Schema, InferSchemaType } from 'mongoose'
import { ActivityType, ActivitySettingType, SocialMedia } from '@/types/db'

const detailSchema = new Schema({
  link: { type: String, required: true }, // post id
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
  data: { type: Object, default: {} }, // custom bonus data
  finalized: { type: Boolean, default: false, index: true }, // bonus share finalized
})

const settingSchema = new Schema({
  data: { type: Object }, // custom settings
  type: { type: Number, enum: ActivitySettingType },
})

export const schema = new Schema({
  index: { type: Number, required: true, unique: true, index: true },
  startTime: { type: Date, required: true, index: true },
  endTime: { type: Date, required: true, index: true },
  slug: { type: String, required: true, unique: true, index: true },
  title: String,
  description: String,
  activityType: { type: Number, enum: ActivityType, required: true },
  socialMedia: { type: String, enum: SocialMedia, required: true },
  setting: { type: settingSchema }, // custom settings
  details: { type: detailSchema, required: true },
  airdrop: { type: airdropSchema, required: true },
  bonus: { type: bonusSchema, default: {} },
  published: { type: Boolean, default: false, index: true },
})

export type Activity = InferSchemaType<typeof schema>
export type ActivityDetail = InferSchemaType<typeof detailSchema>
export type ActivitySetting = InferSchemaType<typeof settingSchema>
export type ActivityAirDrop = InferSchemaType<typeof airdropSchema>
export type ActivityBonus = InferSchemaType<typeof bonusSchema>
export type ActivityData = Omit<Activity, 'index' | 'details' | 'setting' | 'bonus'>
export type NewActivityData = ActivityData & { details: ActivityDetail }
export type TActivity = {
  index: number // auto increase
  startTime: string // ISO 8601 date string
  endTime: string // ISO 8601 date string
  slug: string
  title: string
  description: string
  activityType: number // ActivityType
  socialMedia: string // SocialMedia
  setting: ActivitySetting
  details: ActivityDetail
  airdrop: ActivityAirDrop
  bonus: ActivityBonus
  published: boolean // for public view
}
export type TPublicActivity = TActivity & { joined: boolean }

schema.set('validateBeforeSave', false)

// Middleware to auto-increment the `index` field
schema.pre<Activity>('save', async function (next) {
  const last = await ActivityModel.findOne().sort({ index: -1 })
  this.index = last ? last.index + 1 : 0

  /* @ts-expect-error */
  await this.validate()
  next()
})

const name = 'Activity'
const ActivityModel = (models[name] as Model<Activity>) || model(name, schema)

export default ActivityModel
