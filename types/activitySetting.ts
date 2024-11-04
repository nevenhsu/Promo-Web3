import { ActivitySettingType } from './db'

export type ActivityData = {
  title: string
  description: string
  details: {
    externalLink: string
  }
  setting: {
    data: {
      maxTotalScore: number
      minFollowers: number
    }
  }
  published: boolean
}

export type ActivitySettingTypeNone = {
  type?: ActivitySettingType.None
  data?: {
    minFollowers: number
  }
}

export type ActivitySettingTypeA = {
  type: ActivitySettingType.A
  data: {
    maxTotalScore: number
    minFollowers: number
    maxSelfScore: number
  }
}

export function isTypeNone(setting?: any): setting is ActivitySettingTypeNone {
  return !setting || !setting.type
}

export function isTypeA(setting?: any): setting is ActivitySettingTypeA {
  return setting?.type === ActivitySettingType.A
}
