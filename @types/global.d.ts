import type { Mongoose } from 'mongoose'
import en from '../messages/en.json'

type Messages = typeof en // for next-intl

declare global {
  interface IntlMessages extends Messages {}

  var mongoose: {
    promise: Promise<Mongoose> | null
    conn: Mongoose | null
  }

  namespace NodeJS {
    interface ProcessEnv {
      // Private
      MONGO_URL: string
      DB_NAME: string
      PRIVY_APP_SECRET: string
      SANITY_API_READ_TOKEN: string

      // Next Auth
      NEXTAUTH_SECRET: string
      NEXTAUTH_URL: string
      DEV_ADMIN_ROLE: string

      // Public
      NEXT_PUBLIC_NODE_ENV: 'development' | 'production' | 'test'
      NEXT_PUBLIC_TIME_ZONE: string
      NEXT_PUBLIC_BASE_URL: string
      NEXT_PUBLIC_COLOR_SCHEME: 'dark' | 'light' | 'auto'
      NEXT_PUBLIC_PRIVY_APP_ID: string
      NEXT_PUBLIC_GOOGLE_ANALYTICS: string

      /// sanity
      NEXT_PUBLIC_SANITY_PROJECT_ID: string
      NEXT_PUBLIC_SANITY_DATASET: string
      NEXT_PUBLIC_SANITY_API_VERSION: string
      NEXT_PUBLIC_SANITY_CDN: 'true' | 'false'

      /// Contracts
      NEXT_PUBLIC_TOKEN: string
    }
  }
}
