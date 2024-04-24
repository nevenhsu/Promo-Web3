const createNextIntlPlugin = require('next-intl/plugin')

const withNextIntl = createNextIntlPlugin()

const isProd = process.env.NODE_ENV === 'production'
const compiler = isProd ? { removeConsole: true } : {}

/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler,
  webpack: (config, options) => {
    // svgr
    config.module.rules.map(rule => {
      if (rule.test && rule.test.source && rule.test.source.includes('|svg|')) {
        rule.test = new RegExp(rule.test.source.replace('|svg|', '|'))
      }
    })
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    })
    // mongoose: https://github.com/Automattic/mongoose/issues/13402#issuecomment-1548826056
    Object.assign(config.resolve.alias, {
      '@mongodb-js/zstd': false,
      '@aws-sdk/credential-providers': false,
      snappy: false,
      aws4: false,
      'mongodb-client-encryption': false,
      kerberos: false,
      'supports-color': false,
    })
    return config
  },
  images: {
    domains: ['cdn.sanity.io'],
  },
  experimental: {
    optimizePackageImports: ['@mantine/core', '@mantine/hooks'],
  },
}

module.exports = withNextIntl(nextConfig)
