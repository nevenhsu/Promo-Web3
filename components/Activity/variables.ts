import { ActivityType, ActivityErrorCode } from '@/types/db'

export const chips = [
  { label: 'All', value: `${ActivityType.None}` },
  { label: 'Repost', value: `${ActivityType.Repost}` },
]

export const getActionLabel = (type: number) => {
  switch (type) {
    case ActivityType.Repost:
      return 'Repost'
    default:
      return ''
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
