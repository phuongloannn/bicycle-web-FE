import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
  
  // 🟢 THÊM PROXY REWRITES VÀO ĐÂY
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/:path*',
      },
      {
        source: '/customers/:path*', 
        destination: 'http://localhost:3001/customers/:path*',
      },
    ];
  },
};

export default nextConfig;