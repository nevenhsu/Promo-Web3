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

export enum SocialMedia {
  Instagram = 'instagram',
  X = 'x',
}

export const levelPoints = {
  0: { min: 0, max: 25000 },
  1: { min: 25000, max: 50000 },
  2: { min: 50000, max: 75000 },
  3: { min: 75000, max: 100000 },
  4: { min: 100000, max: Infinity },
} as const
