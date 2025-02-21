import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "3441c44ci2.ufs.sh",
        pathname: "/f/*",
      },
    ],
  },
  /* config options here */
};

export default nextConfig;
