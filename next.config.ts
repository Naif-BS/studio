import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export', // 👈 Enables static export
  distDir: 'out',   // 👈 Output folder name (used for GitHub Pages)

  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true, // 👈 Required for static export if you're using <Image />
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
