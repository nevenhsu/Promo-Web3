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

export const getActionLabel = (type: number) => {
  switch (type) {
    case ActivityType.Follow:
      return 'Follow'
    case ActivityType.Repost:
      return 'Repost'
    case ActivityType.Like:
      return 'Like'
    case ActivityType.Comment:
      return 'Comment'
    case ActivityType.MentionInPost:
      return '@ in Post'
    case ActivityType.MentionInComment:
      return '@ in Comment'
    default:
      return 'All'
  }
}
