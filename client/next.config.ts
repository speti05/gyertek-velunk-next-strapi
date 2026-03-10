import type { NextConfig } from "next";
import { isDev } from "@clientRoot/env";

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
