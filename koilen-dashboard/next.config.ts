import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Optimize for Vercel deployment
  poweredByHeader: false,

  // Experimental features for Web3 compatibility
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },

  // Webpack configuration for production build (fallback when turbopack not available)
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        encoding: false,
      };
    }
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    return config;
  },
};

export default nextConfig;
