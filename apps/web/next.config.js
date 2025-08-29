/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    esmExternals: true,
  },
  transpilePackages: ['@madboat/core', '@madboat/ui', '@madboat/api'],
}

module.exports = nextConfig