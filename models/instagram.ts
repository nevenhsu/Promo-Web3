import { models, model, Model, Schema, InferSchemaType } from 'mongoose'
import UserModel, { type TUser } from '@/models/user'

export const schema = new Schema({
  _user: {
    type: Schema.Types.ObjectId,
    ref: UserModel,
    required: true,
    unique: true, // one user one instagram
    index: true,
  },
  uid: { type: String, required: true }, // api id, not ig_id
  accessToken: { type: String, required: true }, // long-lived access token
  expiredAt: { type: Date, required: true },
  refreshAt: { type: Date, index: true, default: Date.now },
})

export type Instagram = InferSchemaType<typeof schema>
export type TInstagram = Omit<Instagram, '_user'> & { _user: TUser } // with populated _user

const name = 'Instagram'
const InstagramModel = (models[name] as Model<Instagram>) || model(name, schema)

export default InstagramModel
