/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true
  },
  i18n: {
    locales: ['fa'],
    defaultLocale: 'fa',
    localeDetection: true,
  }
}

module.exports = nextConfig