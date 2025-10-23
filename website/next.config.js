/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '**',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    unoptimized: false,
  },
  // Optimization for better performance
  compress: true,
  poweredByHeader: false,
  
  // For static export (if needed)
  // output: 'export',
}

module.exports = nextConfig
