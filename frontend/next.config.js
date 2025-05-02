// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, 
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https', 
        hostname: 'pixabay.com', 
        port: '', 
        pathname: '/get/**', 
      },
      {
        protocol: 'https',
        hostname: 'randomuser.me',
        port: '',
        pathname: '/api/portraits/**',
      },
    ],
  },

  webpack: (config, { isServer, dev }) => {
    if (dev && !isServer) { 
        config.watchOptions = {
            poll: 500, 
            aggregateTimeout: 300,
        };
    }
    return config;
  },

}; 

module.exports = nextConfig;