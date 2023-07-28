/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["stardew.me"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "stardew.me",
      },
    ],
  },
};

module.exports = nextConfig;
