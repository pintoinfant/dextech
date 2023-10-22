/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@uniswap/widgets", "@uniswap/conedison"],
  reactDevOverlay: false,
  async redirects() {
    return [
      {
        source: "/",
        destination: "/swap",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
