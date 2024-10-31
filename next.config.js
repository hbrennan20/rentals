/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'source.unsplash.com' }],
    domains: ['upxrdncrkyezptzfakwf.supabase.co', 'other-domain.com']
  },
  async rewrites() {
    return [
      {
        source: '/auth',
        destination: '/auth/signin'
      },
      {
        source: '/aichat',
        destination: '/aichat/1'
      }
    ];
  },
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;
