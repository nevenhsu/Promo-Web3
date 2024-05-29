import { models, model, Model, Schema, InferSchemaType } from 'mongoose'

export const schema = new Schema({
  index: { type: Number, required: true, unique: true, index: true },
  startTime: { type: Date, required: true, index: true },
  endTime: { type: Date, required: true, index: true },
})

export type Epoch = InferSchemaType<typeof schema>
export type TEpoch = {
  index: number // auto increase
  startTime: string // ISO 8601 date string
  endTime: string // ISO 8601 date string
}

schema.set('validateBeforeSave', false)

// Middleware to auto-increment the `index` field
schema.pre<Epoch>('save', async function (next) {
  const last = await EpochModel.findOne().sort({ index: -1 })
  this.index = last ? last.index + 1 : 0

  /* @ts-expect-error */
  await this.validate()
  next()
})

const name = 'Epoch'
const EpochModel = (models[name] as Model<Epoch>) || model(name, schema)
export default EpochModel
