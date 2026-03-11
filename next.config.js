/** @type {import('next').NextConfig} */

const nextConfig = {
  // Image optimization for production
  images: {
    domains: [
      'source.unsplash.com',
      'images.unsplash.com',
      'localhost',
      'vercel.app',
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year
  },

  // Font optimization
  fonts: {
    fontFaceCallbacks: true,
  },

  // Redirects for better routing
  redirects: async () => [
    {
      source: '/login',
      destination: '/auth/signin',
      permanent: true,
    },
    {
      source: '/register',
      destination: '/auth/signup',
      permanent: true,
    },
  ],

  // Headers for security and performance
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        {
          key: 'X-DNS-Prefetch-Control',
          value: 'on',
        },
        {
          key: 'X-Frame-Options',
          value: 'SAMEORIGIN',
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block',
        },
        {
          key: 'Referrer-Policy',
          value: 'strict-origin-when-cross-origin',
        },
        {
          key: 'Permissions-Policy',
          value: 'geolocation=(), microphone=(), camera=()',
        },
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
  ],

  // Webpack configuration for optimization
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            // Vendor chunk for node_modules
            vendor: {
              filename: 'chunks/vendor.js',
              test: /node_modules/,
              priority: 10,
              reuseExistingChunk: true,
              enforce: true,
            },
            // Common chunk for shared modules
            common: {
              minChunks: 2,
              priority: 5,
              reuseExistingChunk: true,
              enforce: true,
            },
          },
        },
      }
    }
    return config
  },

  // Optimize production builds
  productionBrowserSourceMaps: false,
  compress: true,
  generateEtags: true,

  // Poweredby header removal for security
  poweredByHeader: false,

  // Trailing slashes
  trailingSlash: false,

  // ESLint during build
  eslint: {
    ignoreDuringBuilds: false,
  },

  // TypeScript configuration
  typescript: {
    tsconfigPath: './tsconfig.json',
    ignoreBuildErrors: false,
  },

  // Turbopack settings (for dev)
  turbo: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },

  // Increase timeout for long-running builds
  serverRuntimeConfig: {
    PROJECT_ROOT: __dirname,
  },

  // Swc minification (default and better than Terser)
  swcMinify: true,

  // Environment variables
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
}

module.exports = nextConfig
