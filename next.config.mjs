/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  eslint: {
    dirs: ['app', 'components', 'hooks', 'lib', 'test', 'types', 'util'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'loremflickr.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  serverExternalPackages: ['@whatwg-node'],
}

export default nextConfig
