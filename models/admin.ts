import { models, model, Model, Schema, InferSchemaType } from 'mongoose'
import { AdminRole } from '@/types/db'
import UserModel, { type TUser } from '@/models/user'

export const schema = new Schema({
  _user: {
    type: Schema.Types.ObjectId,
    ref: UserModel,
    required: true,
    unique: true, // Ensures that each user can only be an admin once
    index: true,
  },
  active: {
    type: Boolean,
    default: true,
    index: true,
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
const AdminModel = (models[name] as Model<Admin>) || model(name, schema)

export default AdminModel
