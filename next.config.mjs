/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
       {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'omzwdzmfjyknwdeljlct.supabase.co',
      }
    ],
    dangerouslyAllowSVG: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  }
}

export default nextConfig
