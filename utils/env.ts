// private
export const env = {
  isProd: process.env.NODE_ENV === 'production',

  locales: ['en', 'zh'], // next-intl

  sanityToken: process.env.SANITY_API_READ_TOKEN, // sanity
}

// for browser by prefixing with NEXT_PUBLIC_
export const publicEnv = {
  isProd: process.env.NEXT_PUBLIC_NODE_ENV === 'production',
  baseUrl: getBaseUrl(),
  defaultColorScheme: process.env.NEXT_PUBLIC_COLOR_SCHEME,
  sanity: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-05-03',
    useCdn: toBool(process.env.NEXT_PUBLIC_SANITY_CDN),
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
