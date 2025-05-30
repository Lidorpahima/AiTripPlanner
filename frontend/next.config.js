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

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin-allow-popups' },
          { key: 'Cross-Origin-Embedder-Policy', value: 'unsafe-none' },
          { key: 'Access-Control-Allow-Origin', value:  'https://aitripplanner-production.up.railway.app'
            || 'http://localhost:8000' 
            || 'https://conversations-widget.brevo.com' 
            || 'https://accounts.google.com' 
            ||  process.env.NEXT_PUBLIC_API_URL },
            
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization, X-CSRF-Token' },
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
        ],
      },
    ];
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