import { notFound } from 'next/navigation'
import { getRequestConfig } from 'next-intl/server'
import { env } from '@/utils/env'

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!env.locales.includes(locale as any)) notFound()

  return {
    messages: (await import(`./messages/${locale}.json`)).default,
  }
})

export const i18nConfig = {
  // A list of all locales that are supported
  locales: env.locales,

  // Used when no locale matches
  defaultLocale: 'en',

  localePrefix: 'as-needed',

  // all pathnames that should be localized
  pathnames: {
    '/': '/',
    '/home': '/home',
    '/level': '/level',
    '/profile': '/profile',

    // activity
    '/activity': '/activity',
    '/activity/[activityId]': '/activity/[activityId]',

    // wallet
    '/wallet': '/wallet',
    '/wallet/send': '/wallet/send',
    '/wallet/receive': '/wallet/receive',
    '/wallet/history': '/wallet/history',
    '/wallet/buy': '/wallet/buy',
    '/wallet/receive/link': '/wallet/receive/link',
  },
} as const
