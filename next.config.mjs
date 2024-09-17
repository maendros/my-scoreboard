/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack(config, { isServer }) {
      // Do not modify 'devtool' in development mode to avoid performance issues.
      if (isServer) {
        config.watchOptions = {
          poll: 1000, // Check for changes every second
          aggregateTimeout: 300, // Delay rebuild to avoid multiple restarts
        };
      }
  
      return config;
    },
  };
  
  export default nextConfig;
  