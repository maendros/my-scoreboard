/** @type {import('next').NextConfig} */
const nextConfig = {
  staticPageGenerationTimeout: 180, // 3 minutes
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
  images: {
    domains: ["crests.football-data.org"], // Add this if you're using team crests
  },
};

export default nextConfig;
