import { NextResponse, type NextRequest } from 'next/server'
import { withAuth } from 'next-auth/middleware'
import { getToken } from 'next-auth/jwt'
import createIntlMiddleware from 'next-intl/middleware'
import { i18nConfig } from './i18n'
import { env } from '@/utils/env'

const intlMiddleware = createIntlMiddleware(i18nConfig)

const authMiddleware = withAuth(
  // Note that this callback is only invoked if
  // the `authorized` callback has returned `true`
  // and not for pages listed in `pages`.
  function onSuccess(req) {
    return intlMiddleware(req)
  },
  {
    callbacks: {
      authorized: ({ token }) => token != null,
    },
    pages: {
      signIn: '/',
      error: '/',
    },
  }
)

export default async function middleware(req: NextRequest) {
  // auth
  const token = await getToken({ req })

  if (req.nextUrl.pathname.startsWith('/api')) {
    // check user token
    if (req.nextUrl.pathname.startsWith('/api/u')) {
      const userId = token?.user?.id
      if (!userId) {
        return NextResponse.json({ error: 'No user id in token' }, { status: 400 })
      }
    }

    // check admin auth
    if (req.nextUrl.pathname.startsWith('/api/private')) {
      const adminRole = token?.user?.adminRole ?? env.dev.adminRole
      if (adminRole === undefined) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    }

    const response = NextResponse.next()
    return response
  }

  // next-intl
  const isPublic = isPublicPage(req.nextUrl.pathname)
  if (isPublic) {
    return intlMiddleware(req)
  }

  return (authMiddleware as any)(req)
}

export const config = {
  matcher: [
    // Match all pathnames except for
    // - … if they start with `/_next`, `/_vercel` or '/studio'
    // - … the ones containing a dot (e.g. `favicon.ico`)
    '/((?!studio|_next|_vercel|.*\\..*).*)',
  ],
}

function isPublicPage(pathname: string) {
  const publicPages = ['/']
  const { locales } = i18nConfig

  const publicPathnameRegex = RegExp(
    `^(/(${locales.join('|')}))?(${publicPages
      .flatMap(p => (p === '/' ? ['', '/'] : p))
      .join('|')})/?$`,
    'i'
  )
  return publicPathnameRegex.test(pathname)
}
