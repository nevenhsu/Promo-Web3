import { models, model, Model, Schema } from 'mongoose'
import { SocialMedia } from '@/types/db'
import { customAlphabet } from 'nanoid'
import { cleanup } from '@/utils/helper'
import type { InferSchemaType, CallbackWithoutResultAndOptionalError } from 'mongoose'

// no sensitive data here
const detailSchema = new Schema({
  avatar: String,
})

const linkedAccountsSchema = new Schema({
  userId: { type: String, required: true },
  username: { type: String, required: true },
  platform: { type: String, enum: SocialMedia, required: true },
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
  details: { type: detailSchema, required: true, default: {} },
  linkedAccounts: { type: [linkedAccountsSchema], default: [], required: true },
  createdTime: { type: Date, default: Date.now },
})

// Types for redux store
type LinkedAccounts = InferSchemaType<typeof linkedAccountsSchema>
type TLinkedAccounts = LinkedAccounts & { _id: string }
export type User = InferSchemaType<typeof schema>
export type TUser = Omit<User, 'linkedAccounts'> & {
  _id: string
  linkedAccounts: TLinkedAccounts[]
}

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
