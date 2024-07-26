import type mongoose from 'mongoose'
import { TUser } from '@/models/user'

export type PublicUser = Pick<TUser, 'name' | 'username' | 'details'>

export type Nullable<T> = T | null

export enum BucketType {
  avatar = 'avatar',
  cover = 'cover',
}

export enum AdminRole {
  SuperAdmin = 0,
  DevAdmin = 1,
}

export enum ActivityType {
  // Default for all
  None = 0,

  // User Interactions
  MentionInPost = 1,
  MentionInComment = 2,
  Follow = 3,

  // Content Interactions
  Repost = 4,
  Like = 5,
  Comment = 6,
}

export enum LinkAccountPlatform {
  Google = 'google',
  X = 'x',
}

export enum SocialMedia {
  Instagram = 'instagram',
  X = 'x',
}

export enum ReferralLevel {
  First = 1,
  Second = 2,
}

export enum ActivityStatus {
  Unjoined = -1, // Created by referees
  Initial = 0,
  Completed = 1,
  Error = 4,
}

export enum ActivityErrorCode {
  None = 0,
  Invalid = 1, // Invalid data, invalid user, etc
  NotFound = 2, // Post not found, user not found, etc
  NotFulfilled = 3, // Not enough followers, friends, etc
  Error = 4, // Error in processing
}

export type LeanDocumentArray<MySchema extends Record<string, any>> = {
  [K in keyof MySchema]: MySchema[K] extends mongoose.Types.DocumentArray<infer ArrayType>
    ? LeanDocumentArray<Omit<ArrayType, keyof mongoose.Types.Subdocument>>[]
    : MySchema[K] extends
          | number
          | string
          | boolean
          | Date
          | mongoose.Schema.Types.ObjectId
          | mongoose.Types.ObjectId
      ? MySchema[K]
      : LeanDocumentArray<MySchema[K]>
}
