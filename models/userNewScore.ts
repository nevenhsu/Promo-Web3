import { models, model, Model, Schema, InferSchemaType } from 'mongoose'

export const schema = new Schema({
  _activity: {
    type: Schema.Types.ObjectId,
    ref: 'Activity', // This should match the name of your user model
    required: true,
    index: true,
  },
  _user: {
    type: Schema.Types.ObjectId,
    ref: 'User', // This should match the name of your user model
    required: true,
    index: true,
  },
  newSelfScore: { type: Number, required: true }, // The new score result for the activity
  createdAt: { type: Date, default: Date.now },
  updated: { type: Boolean, default: false, index: true },
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
