/** @type {import('next').NextConfig} */
const nextConfig = {};

// frontend/next.config.js
module.exports = {
    webpackDevMiddleware: config => {
      config.watchOptions = {
        poll: 500, // בדיקה כל שנייה
        aggregateTimeout: 300,
      };
      return config;
    },
  };
  