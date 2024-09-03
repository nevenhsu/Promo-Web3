import { models, model, Model, Schema } from 'mongoose'
import { LinkAccountPlatform } from '@/types/db'
import { customAlphabet } from 'nanoid'
import { cleanup } from '@/utils/helper'
import type { LeanDocumentArray } from '@/types/db'
import type { InferSchemaType, CallbackWithoutResultAndOptionalError } from 'mongoose'

// no sensitive data here
const detailSchema = new Schema({
  avatar: String,
})

const linkedAccountSchema = new Schema({
  subject: { type: String, required: true },
  platform: { type: String, enum: LinkAccountPlatform, required: true },
  username: String,
  userId: String,
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
  details: { type: detailSchema, default: {} },
  linkedAccounts: { type: [linkedAccountSchema], default: [] },
  createdTime: { type: Date, default: Date.now },
})

// Types for redux store
export type LinkedAccount = InferSchemaType<typeof linkedAccountSchema>
export type User = InferSchemaType<typeof schema>
export type TUser = LeanDocumentArray<User> & { _id: string }

// Function to generate a random string
function randomUsername() {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789'
  const nanoid = customAlphabet(alphabet, 8)
  return nanoid()
}

// Middleware before saving
schema.pre<User>('save', async function (next) {
  const cleaned = cleanup(this.username)
  this.username = await uniqueUsername(cleaned)

  /* @ts-expect-error */
  await this.validate()
  next()
})

// Middleware before updating
const handleUpdate = async function (next: CallbackWithoutResultAndOptionalError) {
  /* @ts-expect-error */
  const update = this.getUpdate()
  if (update && update.username) {
    const cleaned = cleanup(update.username)

    if (cleaned.length < 2) {
      throw new Error('Invalid username')
    }

    update.username = cleaned
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
const UserModel = (models[name] as Model<User>) || model(name, schema)

export default UserModel

// Middleware to ensure unique username
async function uniqueUsername(username: string) {
  try {
    const user = await UserModel.findOne({ username })
    if (!user) return username

    throw new Error('Username already exists')
  } catch {
    const name = randomUsername()
    return uniqueUsername(name)
  }
}
