import type { NextConfig } from "next";
import { isDev } from "@clientRoot/env";

// Public Strapi origin - the one the browser and the image optimizer can reach.
// Baked in at build time, so it must be passed as a build arg in Docker.
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const strapiOrigin = new URL(STRAPI_URL);

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
        protocol: strapiOrigin.protocol.replace(":", "") as "http" | "https",
        hostname: strapiOrigin.hostname,
        port: strapiOrigin.port,
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
    ],
  },
};

export default nextConfig as NextConfig;
