/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  // Ensure consistent build output for Vercel with route groups
  generateBuildId: async () => {
    return 'aura-home-build'
  },
}

module.exports = nextConfig