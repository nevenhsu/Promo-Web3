import mongoose from 'mongoose'

const url = process.env.MONGO_URL
const dbName = process.env.DB_NAME

if (!url || !dbName) {
  throw new Error('no MONGO_URL or DB_NAME')
}

const options: mongoose.ConnectOptions = {
  dbName,
  retryWrites: true,
  bufferCommands: false,
  w: 'majority',
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(url, options).then(mongoose => mongoose)
  }

  try {
    cached.conn = await cached.promise
    console.log('🟢 Mongo connected')
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}

export default dbConnect
