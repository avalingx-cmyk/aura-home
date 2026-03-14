/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'st.hzcdn.com',
      },
    ],
  },
  // Ensure consistent build output for Vercel with route groups
  generateBuildId: async () => {
    return 'aura-home-build'
  },
}

module.exports = nextConfig