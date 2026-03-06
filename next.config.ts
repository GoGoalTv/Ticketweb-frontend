import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8005",
        pathname: "/static/**",
      },
      // Keep your wildcard for production/other sources if needed
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
