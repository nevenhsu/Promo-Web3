import { format, toZonedTime, fromZonedTime } from 'date-fns-tz'
import { publicEnv } from '@/utils/env'

const { timezone } = publicEnv

export function cleanup(val: string, toLowerCase = true) {
  // only keep a-z 0-9
  // allow special characters: . _ -
  const str = toLowerCase ? val.toLowerCase() : val
  return str.replace(/[^a-zA-Z0-9._-]/g, '')
}

export function cleanCode(val: string) {
  return val.replace(/[^a-zA-Z0-9]/g, '')
}

export function getGMT(date: string | number | Date) {
  const time = toZonedTime(date, timezone)
  const formattedDate = format(time, 'h:mm aa zzz', { timeZone: timezone })
  return formattedDate
}

export function formateDate(date: string | number | Date, formatStr = 'dd MMM yyyy') {
  const time = toZonedTime(date, timezone)
  const formattedDate = format(time, formatStr, { timeZone: timezone })
  return formattedDate
}

export function getStartOfDate(date: string | number | Date) {
  const d = format(date, 'yyyy-MM-dd')
  return fromZonedTime(d, timezone)
}

export function toUpper(str: string) {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word[0].toUpperCase() + word.substring(1))
    .join(' ')
}
