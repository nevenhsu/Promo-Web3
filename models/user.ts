import { models, model, Model, Schema, InferSchemaType, Types } from 'mongoose'
import { nanoid } from 'nanoid'

const detailSchema = new Schema({
  avatar: String,
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
    required: true,
    unique: true,
    index: true,
    default: randomUsername,
  },
  name: String,
  email: String,
  details: detailSchema,
  createdTime: { type: Date, default: Date.now },
})

export type User = InferSchemaType<typeof userSchema>
export type TUser = Omit<User, '_id'> & { _id: string }

const name = 'User'
export default (models[name] as Model<User>) || model(name, userSchema)

// Function to generate a random string
function randomUsername() {
  return nanoid()
}
