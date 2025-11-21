import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // TypeORM must be externalized in Next 16
  serverExternalPackages: ["typeorm"],

  // Optional but fine to keep things quiet
  productionBrowserSourceMaps: false,
};

export default nextConfig;
