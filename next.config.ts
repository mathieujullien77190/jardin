import type { NextConfig } from 'next';

// GitHub Pages serves the site under /<repo>; keep it empty in dev.
const basePath = process.env.NODE_ENV === 'production' ? '/jardin' : '';

const nextConfig: NextConfig = {
  output: 'export',
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  turbopack: {
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },
};

export default nextConfig;
