import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone', // For Docker deployment

  webpack: (config, { isDev, isServer }) => {
    // Fixes npm packages that depend on `fs` module
    if (!isDev && !isServer) {
      config.resolve.fallback = {
        fs: false,
      };
    }
    return config;
  },

  // Environment variables that should be available on the client
  env: {
    NEXT_PUBLIC_GEMINI_API_KEY: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
};

export default nextConfig;
