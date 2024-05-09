export type Nullable<T> = T | null

export enum BucketType {
  avatar = 'avatar',
  cover = 'cover',
}

export enum UserField {
  username = 'username',
  name = 'name',
  // detail
  avatar = 'avatar',
  about = 'about',
  covers = 'covers',
  links = 'links',
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
