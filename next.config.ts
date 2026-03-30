import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  cacheOnNavigation: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV !== "production",
});

const securityHeaders = [
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "object-src 'none'",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data: https:",
      "style-src 'self' 'unsafe-inline' https:",
      "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com",
      "connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com https://vitals.vercel-insights.com https:",
      "frame-src 'self'",
      "upgrade-insecure-requests",
    ].join('; '),
  },
]

const nextConfig: NextConfig = {
  reactStrictMode: true,

  poweredByHeader: false,

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

  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      // {
      //   // Long-lived cache for static assets (your original commented-out code)
      //   source: "/_next/static/:path*",
      //   headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      // },
      // {
      //   source: "/images/:path*",
      //   headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      // },
    ];
  },

  async rewrites() {
    return [
      { source: "/proposal", destination: "/views/proposal" },
      { source: "/login", destination: "/views/login" },
    ];
  },
};

export default withSerwist(nextConfig);