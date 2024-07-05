import { models, model, Model, Schema, InferSchemaType } from 'mongoose'

const schema = new Schema({
  postId: { type: String, required: true, index: true }, // Twitter post id
  byUserId: { type: String, required: true }, // Twitter user id
})

export type TwitterRepost = InferSchemaType<typeof schema>

const name = 'TwitterRepost'
const TwitterRepost = (models[name] as Model<TwitterRepost>) || model(name, schema)

export default TwitterRepost
