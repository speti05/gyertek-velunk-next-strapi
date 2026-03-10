import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const nextConfig = {
  images: {
    unoptimized: isDev,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig as NextConfig;
