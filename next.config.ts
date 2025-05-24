import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export', // This line tells Next.js to export as static HTML
  // Optional: If you need to make sure images are handled correctly for GitHub Pages sub-directories
  // basePath: '/studio', // Uncomment and set if your GitHub Pages URL ends up being like example.github.io/studio
  // assetPrefix: '/studio/', // Uncomment and set if your GitHub Pages URL ends up being like example.github.io/studio
};

export default nextConfig;