import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  typescript: {
    ignoreBuildErrors: true,
  },

  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },

  // Externalize problematic packages that Turbopack tries to compile
  serverExternalPackages: [
    'pino',
    'pino-pretty',
    'thread-stream',
    'sonic-boom',
    'abstract-logging',
    'atomic-sleep',
    'safe-stable-stringify',
    'on-exit-leak-free',
    'pino-abstract-transport',
    'real-require',
    'quick-format-unescaped',
    'lokijs',
    'encoding',
  ],

  // Empty turbopack config to silence the warning
  turbopack: {},
};

export default nextConfig;
