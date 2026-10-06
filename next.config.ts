import type { NextConfig } from 'next';

const nextConfig: NextConfig =
  process.env.GITHUB_PAGES === 'true'
    ? {
        output: 'export',
        basePath: '/Portfolio',
        assetPrefix: '/Portfolio/',
        images: { unoptimized: true },
      }
    : {};

export default nextConfig;
