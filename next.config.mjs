/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  eslint: {
    dirs: ['app', 'components', 'hooks', 'lib', 'test', 'types', 'util'],
  },
}

export default nextConfig
