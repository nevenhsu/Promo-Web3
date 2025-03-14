import { NextResponse, type NextRequest } from 'next/server'
import { withAuth } from 'next-auth/middleware'
import { getToken, type JWT } from 'next-auth/jwt'
import createIntlMiddleware from 'next-intl/middleware'
import { routing } from '@/i18n/routing'
import { env } from '@/utils/env'

export const publicPages = ['/', '/page(/.*)?', '/activity(/.*)?', '/u(/.*)?']

const intlMiddleware = createIntlMiddleware(routing)

const authMiddleware = withAuth(
  // Note that this callback is only invoked if
  // the `authorized` callback has returned `true`
  // and not for pages listed in `pages`.
  function onSuccess(req) {
    return intlMiddleware(req)
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        if (isAdminPage(req.nextUrl.pathname)) {
          return isAdmin(token)
        }

        // Only supports the "jwt" session strategy
        // FIXME: Bug in NextAuth.js: 4.24.7
        return true // Boolean(token)
      },
    },
    pages: {
      signIn: '/',
      signOut: '/',
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
      if (!isAdmin(token)) {
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

export function isPublicPage(pathname: string) {
  const { locales } = routing

  const publicPathnameRegex = RegExp(
    `^(/(${locales.join('|')}))?(${publicPages
      .flatMap(p => (p === '/' ? ['', '/'] : p))
      .join('|')})/?$`,
    'i'
  )
  return publicPathnameRegex.test(pathname)
}

function isAdminPage(pathname: string) {
  const pages = ['/admin']
  const locales = ['en', 'zh']

  const adminPathnameRegex = RegExp(
    `^(/(${locales.join('|')}))?(${pages.flatMap(p => [p, `${p}/.*`]).join('|')})/?$`,
    'i'
  )

  return adminPathnameRegex.test(pathname)
}

function isAdmin(token: JWT | null) {
  return token?.user?.isAdmin ?? env.dev.isAdmin ?? false
}
