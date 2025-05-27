/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove 'output: export' as it's incompatible with server actions
  // output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;
