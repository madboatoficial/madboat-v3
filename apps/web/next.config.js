/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // esmExternals disabled - can cause webpack issues with React 19
    // esmExternals: true,
    // turbo: {}, // Uncomment to enable Turbopack (faster dev builds)
  },
  transpilePackages: ['@madboat/core', '@madboat/ui', '@madboat/api'],
  // output: 'standalone', // Temporarily disabled to fix build
  trailingSlash: false,
  
  // Additional webpack configuration to handle potential issues
  webpack: (config, { isServer }) => {
    // Resolve potential module loading issues
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    }
    
    return config
  },
}

module.exports = nextConfig