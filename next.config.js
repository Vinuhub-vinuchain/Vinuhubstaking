/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['photos.pinksale.finance'],
    unoptimized: true
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
