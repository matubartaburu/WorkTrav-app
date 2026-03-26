/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['d3-geo', 'd3-selection', 'd3-zoom', 'topojson-client'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
}

module.exports = nextConfig
