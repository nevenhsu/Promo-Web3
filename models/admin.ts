import { models, model, Model, Schema, InferSchemaType, Types } from 'mongoose'
import { AdminRole } from '@/types/db'

export const schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User', // This should match the name of your user model
    required: true,
    unique: true, // Ensures that each user can only be an admin once
    index: true,
  },
  active: {
    type: Boolean,
    required: true,
    default: true,
  },
  role: {
    type: Number,
    required: true,
    enum: AdminRole,
  },
})

export type Admin = InferSchemaType<typeof schema>

const name = 'Admin'
export default (models[name] as Model<Admin>) || model(name, schema)
