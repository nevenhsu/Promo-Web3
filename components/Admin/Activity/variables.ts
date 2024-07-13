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

export function createSlug(text: string): string {
  return text
    .toLowerCase() // 转换为小写
    .trim() // 去除首尾空格
    .replace(/[^a-z0-9 -]/g, '') // 移除特殊字符
    .replace(/\s+/g, '-') // 将空格替换为连字符
    .replace(/-+/g, '-') // 移除多余的连字符
}
