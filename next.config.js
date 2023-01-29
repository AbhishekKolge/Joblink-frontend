const { PHASE_DEVELOPMENT_SERVER } = require("next/constants");

/** @type {import('next').NextConfig} */
const nextConfig = (phase) => {
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    return {
      reactStrictMode: false,
      images: {
        domains: ["res.cloudinary.com"],
      },
      env: {
        NEXT_PUBLIC_URL:
          "https://jolink-backend-production.up.railway.app/api/v1",
        NEXT_API_URL: "/api/v1",
      },
      async rewrites() {
        return [
          {
            source: "/api/v1/:path*",
            destination: "http://localhost:5000/api/v1/:path*",
          },
        ];
      },
    };
  }
  return {
    reactStrictMode: true,
    images: {
      domains: ["res.cloudinary.com"],
    },
    env: {
      NEXT_PUBLIC_URL:
        "https://jolink-backend-production.up.railway.app/api/v1",
      NEXT_API_URL: "https://jolink-backend-production.up.railway.app/api/v1",
    },
    eslint: {
      ignoreDuringBuilds: true,
    },
  };
};

module.exports = nextConfig;
