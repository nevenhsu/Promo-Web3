import { models, model, Model, Schema } from 'mongoose'
import { nanoid } from 'nanoid'
import { cleanup } from '@/utils/helper'
import type { InferSchemaType, CallbackWithoutResultAndOptionalError } from 'mongoose'

const detailSchema = new Schema({
  avatar: String,
})

const linkedAccountsSchema = new Schema({
  userId: String,
  username: String,
  platform: String,
})

export const schema = new Schema({
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
  linkedAccounts: linkedAccountsSchema,
  createdTime: { type: Date, default: Date.now },
})

export type User = InferSchemaType<typeof schema>
export type TUser = User & { _id: string }

// Function to generate a random string
function randomUsername() {
  return nanoid()
}

// Middleware before saving
schema.pre<User>('save', async function (next) {
  this.username = cleanup(this.username)

  /* @ts-expect-error */
  await this.validate()
  next()
})

// Middleware before updating
const handleUpdate = async function (next: CallbackWithoutResultAndOptionalError) {
  /* @ts-expect-error */
  const update = this.getUpdate()
  if (update && update.username) {
    update.username = cleanup(update.username)
    /* @ts-expect-error */
    this.setUpdate(update)
  }

  /* @ts-expect-error */
  await this.validate()
  next()
}

schema.pre<User>('findOneAndUpdate', handleUpdate)
schema.pre<User>('updateOne', handleUpdate)
schema.pre<User>('updateMany', handleUpdate)

const name = 'User'
export default (models[name] as Model<User>) || model(name, schema)
