import { locales } from '@/utils/env'

export type Lang<T> = {
  lang: {
    [key in (typeof locales)[number]]: T
  }
}
