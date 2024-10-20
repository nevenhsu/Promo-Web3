// private
const isProd = process.env.NODE_ENV === 'production'

// public
export const locales = ['en', 'zhTW'] as const // next-intl

export const env = {
  isProd,
  locales,
  sanityToken: process.env.SANITY_API_READ_TOKEN, // sanity
  // only for dev
  dev: isProd
    ? {}
    : {
        isAdmin: true,
        adminRole: process.env.DEV_ADMIN_ROLE ? Number(process.env.DEV_ADMIN_ROLE) : undefined,
      },
  gcp: {
    projectId: process.env.GCP_PROJECT_ID,
    bucketName: process.env.GCP_BUCKET_NAME,
    clientEmail: process.env.GCP_CLIENT_EMAIL,
    privateKey: process.env.GCP_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
}

// for browser by prefixing with NEXT_PUBLIC_
export const publicEnv = {
  locales,
  isProd: process.env.NEXT_PUBLIC_NODE_ENV === 'production',
  timezone: process.env.NEXT_PUBLIC_TIME_ZONE,
  baseUrl: getBaseUrl(),
  defaultColorScheme: process.env.NEXT_PUBLIC_COLOR_SCHEME,
  chainTestnet: toBool(process.env.NEXT_PUBLIC_CHAIN_TESTNET),
  sanity: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-05-03',
    useCdn: toBool(process.env.NEXT_PUBLIC_SANITY_CDN),
  },
  api: {
    infuraKey: process.env.NEXT_PUBLIC_INFURA_KEY,
    alchemyKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY,
  },
}

// methods

function toBool(value: any) {
  if (value == undefined) {
    return undefined
  }

  if (value === true || Number(value) >= 1 || `${value}`.toLowerCase() === 'true') {
    return true
  }

  return false
}

function getBaseUrl() {
  const url = process.env.NEXT_PUBLIC_BASE_URL
  if (!url) throw new Error('invalid NEXT_PUBLIC_BASE_URL')
  const hasSlash = url.slice(-1) === '/'
  return hasSlash ? url.slice(0, -1) : url
}
