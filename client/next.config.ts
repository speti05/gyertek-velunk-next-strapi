import type { NextConfig } from "next";
import { isDev } from "@clientRoot/env";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

const nextConfig = {
  output: isDev ? undefined : "standalone",
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `frame-ancestors 'self' ${STRAPI_URL}`,
          },
        ],
      },
    ];
  },
  images: {
    unoptimized: isDev,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/uploads/**",
      },
      // Add your VPS IP or domain here for production image loading:
      // { protocol: "http", hostname: "YOUR_VPS_IP_OR_DOMAIN", port: "1337", pathname: "/uploads/**" },
    ],
  },
};

export default nextConfig as NextConfig;
