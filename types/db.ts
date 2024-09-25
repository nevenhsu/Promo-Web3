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

  // X
  Repost = 4,

  // Instagram
  Story = 11,
}

export enum ActivitySettingType {
  None = '0',
  A = '1',
}

export enum LinkAccountPlatform {
  Google = 'google',
  X = 'x',
  Instagram = 'instagram',
}

export enum SocialMedia {
  X = 'x',
  Instagram = 'instagram',
}

export enum ReferralLevel {
  First = 1,
  Second = 2,
}

export enum ActivityStatus {
  Unjoined = -1, // Created by referees
  Initial = 0,
  Completed = 1,
  WaitList = 2, // Waiting for more remaining score
  Error = 4,
}

export enum ActivityErrorCode {
  None = 0,
  Invalid = 1, // Invalid data, invalid user, etc
  NotFound = 2, // Post not found, user not found, etc
  NotFulfilled = 3, // Not enough followers, friends, etc
  Error = 4, // Error in processing
}

export enum TxType {
  Native = 'Native', // ETH
  ERC20 = 'ERC20',
}

export enum TxStatus {
  Init = -3, // not yet called
  Pending = -2, // called but not yet confirmed
  Confirming = -1, // waiting for confirmations
  Failed = 0,
  Success = 1,
  Error = 4, // ex: no contract, no function
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
