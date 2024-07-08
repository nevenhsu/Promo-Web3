import { models, model, Model, Schema, InferSchemaType } from 'mongoose'
import { ActivityType, SocialMedia } from '@/types/db'

const detailSchema = new Schema({
  link: String, // post id
  coverUrl: String,
  thumbnailUrl: String,
  participants: Number,
  totalScore: Number,
})

export const schema = new Schema({
  index: { type: Number, required: true, unique: true, index: true },
  startTime: { type: Date, required: true, index: true },
  endTime: { type: Date, required: true, index: true },
  title: String,
  description: String,
  points: Number,
  activityType: { type: Number, enum: ActivityType, required: true },
  socialMedia: { type: String, enum: SocialMedia, required: true },
  details: detailSchema,
})

export type Activity = InferSchemaType<typeof schema>
export type ActivityDetail = InferSchemaType<typeof detailSchema>
export type TActivity = {
  index: number // auto increase
  startTime: string // ISO 8601 date string
  endTime: string // ISO 8601 date string
  title: string
  description: string
  points: number
  activityType: number // ActivityType
  socialMedia: string // SocialMedia
  details: ActivityDetail
}

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
