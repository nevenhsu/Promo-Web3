import { ActivityType, ActivityErrorCode } from '@/types/db'
import type { TPublicActivity } from '@/models/activity'

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

export function getErrorText(errorCode?: number) {
  switch (errorCode) {
    case ActivityErrorCode.NotFound: {
      const title = 'Activity not found'
      const message = 'Please make your account public to see this activity and hit confirm again.'
      return { title, message }
    }
    case ActivityErrorCode.Invalid: {
      const title = 'Invalid account'
      const message = 'Make sure linked account is valid and hit confirm again.'
      return { title, message }
    }
    case ActivityErrorCode.NotFulfilled: {
      const title = 'Requirements not met'
      const message = 'Make sure you reach the requirements and hit confirm again.'
      return { title, message }
    }
    case ActivityErrorCode.None:
    default:
      const title = 'Error occurred'
      const message = 'Something went wrong. Please hit confirm again later.'
      return { title, message }
  }
}
