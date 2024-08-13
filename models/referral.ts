import { models, model, Model, Schema, InferSchemaType } from 'mongoose'
import { ReferralLevel, PublicUser } from '@/types/db'
import UserModel from '@/models/user'

export const schema = new Schema({
  _referrer: {
    type: Schema.Types.ObjectId,
    ref: UserModel,
    required: true,
    index: true,
  },
  _referee: {
    type: Schema.Types.ObjectId,
    ref: UserModel,
    required: true,
    index: true,
  },
  level: {
    type: Number,
    enum: ReferralLevel,
    required: true,
    index: true,
  },
  score: { type: Number, default: 0.0 }, // The score the referrer gets for this referral
  createdAt: { type: Date, default: Date.now, index: true },
})

schema.index({ _referrer: 1, _referee: 1 }, { unique: true }) // unique index for referrer and referee

export type Referral = InferSchemaType<typeof schema>
export type TReferral = {
  _id: string
  _referrer: string
  _referee: string
  level: number
  score: number
  createdAt: string // ISO 8601 date string
}
export type TReferee = Omit<TReferral, '_referee'> & { referee: PublicUser }

const name = 'Referral'
const ReferralModel = (models[name] as Model<Referral>) || model(name, schema)

export default ReferralModel
