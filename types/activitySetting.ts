import { ActivitySettingType } from './db'

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
