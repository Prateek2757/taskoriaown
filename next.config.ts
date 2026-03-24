import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  cacheOnNavigation: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV !== "production",
});

const nextConfig: NextConfig = {
  reactStrictMode: true,

  experimental: {
    optimizeCss: true,
    optimizePackageImports: ["@radix-ui/react-icons", "date-fns"],
  },

  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "eoicjmcyigolwgjantsl.supabase.co",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "avatar.vercel.sh",
        pathname: "/**",
      },
    ],
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  // async headers() {
  //   return [
  //     {
  //       source: "/images/:path*",
  //       headers: [
  //         { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
  //       ],
  //     },
  //     {
  //       source: "/_next/static/:path*",
  //       headers: [
  //         { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
  //       ],
  //     },
  //   ];
  // },

  async rewrites() {
    return [
      { source: "/proposal", destination: "/views/proposal" },
      { source: "/login", destination: "/views/login" },
    ];
  },
};

export default withSerwist(nextConfig);
