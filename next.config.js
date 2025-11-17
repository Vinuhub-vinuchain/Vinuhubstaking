/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['photos.pinksale.finance'],
    unoptimized: true,
  },
}

module.exports = nextConfig
