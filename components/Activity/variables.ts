import { ActivityType } from '@/types/db'

export const chips = [
  { label: 'All', value: `${ActivityType.None}` },
  { label: 'Follow', value: `${ActivityType.Follow}` },
  { label: 'Repost', value: `${ActivityType.Repost}` },
  { label: 'Like', value: `${ActivityType.Like}` },
  { label: 'Comment', value: `${ActivityType.Comment}` },
  { label: '@ in Post', value: `${ActivityType.MentionInPost}` },
  { label: '@ in Comment', value: `${ActivityType.MentionInComment}` },
]
