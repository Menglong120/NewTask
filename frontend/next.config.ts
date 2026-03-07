import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/upload/:path*',
        destination: 'http://localhost:3030/upload/:path*',
      },
      {
        source: '/storage/:path*',
        destination: 'http://localhost:3030/storage/:path*',
      },
      {
        source: '/img/:path*',
        destination: 'http://localhost:3030/img/:path*',
      },
      {
        source: '/vendor/:path*',
        destination: 'http://localhost:3030/vendor/:path*',
      },
      {
        source: '/css/:path*',
        destination: 'http://localhost:3030/css/:path*',
      },
      {
        source: '/js/:path*',
        destination: 'http://localhost:3030/js/:path*',
      },
    ];
  },
};

export default nextConfig;
