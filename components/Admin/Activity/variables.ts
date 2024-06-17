import { ActivityType } from '@/types/db'

export const activityTypes = [
  { label: 'None', value: ActivityType.None },
  { label: 'Mention in Post', value: ActivityType.MentionInPost },
  { label: 'Mention in Comment', value: ActivityType.MentionInComment },
  { label: 'Follow', value: ActivityType.Follow },
  { label: 'Repost', value: ActivityType.Repost },
  { label: 'Like', value: ActivityType.Like },
  { label: 'Comment', value: ActivityType.Comment },
]
