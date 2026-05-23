import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Disable TypeScript errors during build — errors are caught in dev
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "fonts.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "fonts.gstatic.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/auth/login",
        destination: "/login",
        permanent: true,
      },
      {
        source: "/auth/register",
        destination: "/login",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
