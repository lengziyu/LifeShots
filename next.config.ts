import type { NextConfig } from "next";

const isFastBuild = process.env.FAST_BUILD === "1";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    // Optional for release speed. Use FAST_BUILD=1 npm run build:fast
    ignoreBuildErrors: isFastBuild,
  },
};

export default nextConfig;
