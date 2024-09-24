import { ActivitySettingType } from './db'

export type ActivitySettingTypeNone = {
  type?: ActivitySettingType.None
  data?: {}
}

export type ActivitySettingTypeA = {
  type: ActivitySettingType.A
  data: {
    maxTotalScore: number
    maxSelfScore: number
  }
}

export function isTypeNone(setting?: any): setting is ActivitySettingTypeNone {
  return !setting || !setting.type
}

export function isTypeA(setting?: any): setting is ActivitySettingTypeA {
  return setting?.type === ActivitySettingType.A
}
