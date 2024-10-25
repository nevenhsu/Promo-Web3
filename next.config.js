const createNextIntlPlugin = require('next-intl/plugin')

const withNextIntl = createNextIntlPlugin()

const isProd = process.env.NODE_ENV === 'production'
const compiler = isProd ? { removeConsole: true } : {}

/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler,
  images: {
    domains: ['cdn.sanity.io'],
  },
  experimental: {
    optimizePackageImports: ['@mantine/core', '@mantine/hooks'],
  },
}

module.exports = withNextIntl(nextConfig)
