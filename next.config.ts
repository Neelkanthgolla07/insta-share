import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.ccbp.in',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
