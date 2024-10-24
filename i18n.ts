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
    '/record': '/record',

    // activity
    '/activity': '/activity',
    '/activity/[slug]': '/activity/[slug]',

    // user
    '/u': '/u',
    '/u/[username]': '/u/[username]',

    // wallet
    '/wallet': '/wallet',
    '/wallet/send': '/wallet/send',
    '/wallet/receive': '/wallet/receive',
    '/wallet/airdrop': '/wallet/airdrop',
    '/wallet/history': '/wallet/history',
    '/wallet/history/[tx]': '/wallet/history/[tx]',

    // admin
    '/admin': '/admin',
    '/admin/user': '/admin/user',
    '/admin/epoch': '/admin/epoch',
    '/admin/activity': '/admin/activity',

    // profile
    '/profile': '/profile',
    '/profile/info': '/profile/info',
    '/profile/account': '/profile/account',
    '/profile/token': '/profile/token',
    '/profile/token/info': '/profile/token/info',
    '/profile/nft': '/profile/nft',
    '/profile/activity': '/profile/activity',
    '/profile/donation': '/profile/donation',

    // refer
    '/refer': '/refer',
    '/refer/list': '/refer/list',
    '/refer/code': '/refer/code',
  },
} as const
