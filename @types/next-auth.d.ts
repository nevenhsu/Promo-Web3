import { Session } from 'next-auth'
import { JWT } from 'next-auth/jwt'

type User = { id: string; privyId: string; isAdmin?: boolean; adminRole?: number }

declare module 'next-auth' {
  interface Session {
    user?: User
  }
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    /** OpenID ID Token */
    name?: string
    user?: User
  }
}
