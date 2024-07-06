import { models, model, Model, Schema, InferSchemaType } from 'mongoose'

export const schema = new Schema({
  _activityId: {
    type: Schema.Types.ObjectId,
    ref: 'Activity', // This should match the name of your user model
    required: true,
    index: true,
  },
  _userId: {
    type: Schema.Types.ObjectId,
    ref: 'User', // This should match the name of your user model
    required: true,
    index: true,
  },
  newSelfScore: { type: Number, required: true }, // The new self score added for the activity
  createdAt: { type: Date, default: Date.now },
  updated: { type: Boolean, default: false, index: true },
})

export type ActivityUserStatus = InferSchemaType<typeof schema>

const name = 'userNewScore'
export default (models[name] as Model<ActivityUserStatus>) || model(name, schema)
