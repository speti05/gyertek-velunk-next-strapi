import type { NextConfig } from "next";
import { isDev } from "@clientRoot/env";

const nextConfig = {
  output: isDev ? undefined : "standalone",
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
