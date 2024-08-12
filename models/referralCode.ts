import { models, model, Model, Schema, InferSchemaType } from 'mongoose'
import { customAlphabet } from 'nanoid'
import UserModel from '@/models/user'

export const schema = new Schema({
  _user: {
    type: Schema.Types.ObjectId,
    ref: UserModel,
    required: true,
    index: true,
  },
  code: {
    type: String,
    index: true,
    unique: true,
    default: randomCode,
  },
})

export type ReferralCode = InferSchemaType<typeof schema>

// Function to generate a random string
function randomCode() {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const nanoid = customAlphabet(alphabet, 6)
  return nanoid()
}

// Middleware before saving
schema.pre<ReferralCode>('save', async function (next) {
  this.code = await uniqueCode(this.code)

  /* @ts-expect-error */
  await this.validate()
  next()
})

const name = 'ReferralCode'
const ReferralCodeModel = (models[name] as Model<ReferralCode>) || model(name, schema)

export default ReferralCodeModel

// Middleware to ensure unique code
async function uniqueCode(code: string) {
  try {
    const doc = await ReferralCodeModel.findOne({ code })
    if (!doc) return code

    throw new Error('Username already exists')
  } catch {
    const code = randomCode()
    return uniqueCode(code)
  }
}
