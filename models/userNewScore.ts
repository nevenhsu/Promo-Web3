import { models, model, Model, Schema, InferSchemaType } from 'mongoose'
import ActivityModel from '@/models/activity'
import UserModel from '@/models/user'

export const schema = new Schema({
  _activity: {
    type: Schema.Types.ObjectId,
    ref: ActivityModel,
    required: true,
    index: true,
  },
  _user: {
    type: Schema.Types.ObjectId,
    ref: UserModel,
    required: true,
    index: true,
  },
  newSelfScore: { type: Number, required: true }, // The new score result for the activity
  updated: { type: Boolean, default: false, index: true }, // Whether the user has updated the score
  createdAt: { type: Date, default: Date.now },
})

schema.index({ _activity: 1, _user: 1, updated: 1 })

// Middleware before saving
schema.pre<UserNewScore>('save', async function (next) {
  // Should use findOneAndUpdate to insert or update the score
  const notUpdated = await UserNewScoreModel.findOne({
    _activity: this._activity,
    _user: this._user,
    updated: false,
  })

  if (notUpdated) {
    // If the user has not updated the previous score, throw an error
    throw new Error('Still have not updated the previous score')
  }

  /* @ts-expect-error */
  await this.validate()
  next()
})

export type UserNewScore = InferSchemaType<typeof schema>

const name = 'UserNewScore'
const UserNewScoreModel = (models[name] as Model<UserNewScore>) || model(name, schema)

export default UserNewScoreModel
