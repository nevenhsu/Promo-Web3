import { models, model, Model, Schema, InferSchemaType } from 'mongoose'
import { AdminRole } from '@/types/db'
import type { TUser } from '@/models/user'

export const schema = new Schema({
  _user: {
    type: Schema.Types.ObjectId,
    ref: 'User', // This should match the name of your user model
    required: true,
    unique: true, // Ensures that each user can only be an admin once
    index: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
  role: {
    type: Number,
    required: true,
    enum: AdminRole,
  },
})

export type Admin = InferSchemaType<typeof schema>
export type TAdmin = Omit<Admin, '_user'> & { _user: TUser } // with populated _user

const name = 'Admin'
export default (models[name] as Model<Admin>) || model(name, schema)
