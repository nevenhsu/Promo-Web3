import { models, model, Model, Schema, InferSchemaType, Types } from 'mongoose'

const detailSchema = new Schema({
  avatar: String,
  about: String,
  covers: [String],
  links: [String],
})

export const userSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    default: new Types.ObjectId(),
  },
  privyId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  username: {
    type: String,
    required: false,
    unique: true,
    index: true,
  },
  name: String,
  email: String,
  details: detailSchema,
  createdTime: { type: Date, default: Date.now },
})

export type User = InferSchemaType<typeof userSchema>

const name = 'User'
export default (models[name] as Model<User>) || model(name, userSchema)
