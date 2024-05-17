import { models, model, Model, Schema, InferSchemaType, Document } from 'mongoose'
import { nanoid } from 'nanoid'

const detailSchema = new Schema({
  avatar: String,
})

export const userSchema = new Schema({
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
export type TUser = User & { _id: string }

const name = 'User'
export default (models[name] as Model<User>) || model(name, userSchema)

// Function to generate a random string
function randomUsername() {
  return nanoid()
}
