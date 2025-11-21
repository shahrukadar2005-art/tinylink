/** @type {import('next').NextConfig} */
module.exports = {
  experimental: {
    serverComponentsExternalPackages: ['typeorm'],
  },
  productionBrowserSourceMaps: false,
  devIndicators: false,
};
