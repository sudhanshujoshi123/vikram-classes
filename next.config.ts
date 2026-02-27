/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  experimental: {
    turbo: {
      enabled: false,
    },
  },
};

module.exports = nextConfig;
