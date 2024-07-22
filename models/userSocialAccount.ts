import { models, model, Model, Schema, InferSchemaType } from 'mongoose'
import { SocialMedia } from '@/types/db'

// Save social media account data

const detailSchema = new Schema({
  avatar: String,
})

export const schema = new Schema({
  _user: {
    type: Schema.Types.ObjectId,
    ref: 'User', // This should match the name of your user model
    required: true,
    index: true,
  },
  socialMedia: { type: String, enum: SocialMedia, index: true, required: true },
  userId: { type: String, required: true, index: true }, // from social media
  name: { type: String, default: '' },
  username: { type: String, default: '' },
  postsCount: { type: Number, default: 0 },
  friendsCount: { type: Number, default: 0 },
  followersCount: { type: Number, default: 0, index: true }, // for sorting
  verified: { type: Boolean, default: false },
  details: { type: detailSchema, default: {} },
  createdAt: Date, // from social media
  updateAt: { type: Date, default: Date.now },
})

schema.index({ _user: 1, socialMedia: 1 }, { unique: true }) // unique index for user and social media

export type UserSocialAccount = InferSchemaType<typeof schema>

const name = 'UserSocialAccount'
const UserSocialAccountModel = (models[name] as Model<UserSocialAccount>) || model(name, schema)

export default UserSocialAccountModel
