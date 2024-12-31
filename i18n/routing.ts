import { defineRouting } from 'next-intl/routing'
import { createNavigation } from 'next-intl/navigation'
import { env } from '@/utils/env'

export const routing = defineRouting({
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
    '/profile/setting': '/profile/setting',
    '/profile/info': '/profile/info',
    '/profile/account': '/profile/account',
    '/profile/token': '/profile/token',
    '/profile/token/info': '/profile/token/info',
    '/profile/activity': '/profile/activity',
    '/profile/activity/new': '/profile/activity/new',

    // refer
    '/refer': '/refer',
    '/refer/list': '/refer/list',
    '/refer/code': '/refer/code',
  },
})

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter } = createNavigation(routing)
