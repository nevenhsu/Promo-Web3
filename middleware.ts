import createMiddleware from 'next-intl/middleware'
import { i18nConfig } from './i18n'

export default createMiddleware(i18nConfig)

export const config = {
  matcher: [
    // Match all pathnames except for
    // - … if they start with `/_next` or `/_vercel`
    // - … or `/api`, `/studio`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    '/((?!api|studio|_next|_vercel|.*\\..*).*)',
  ],
}
