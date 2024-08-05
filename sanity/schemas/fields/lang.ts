import { defineField } from 'sanity'
import { env } from '@/utils/env'

export const lang = defineField({
  name: 'lang',
  type: 'string',
  options: {
    list: env.locales.map(value => ({ title: value, value })),
  },
})
