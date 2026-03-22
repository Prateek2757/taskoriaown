import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  cacheOnNavigation: true,
  reloadOnOnline: true,
  disable: false,
});

const nextConfig: NextConfig = {
  reactStrictMode: true,

  experimental: {
    optimizeCss: true,
    optimizePackageImports: [
      "lucide-react",
      "@radix-ui/react-icons",
      "date-fns",
    ],
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
    ignoreBuildErrors: false,
  },

  async headers() {
	return [
	  {
		source: "/", 
		headers: [
		  {
			key: "Link",
			value: [
			  "</_next/static/css/de6a02220cea8ecc.css>; rel=preload; as=style",
			  "</_next/static/css/acf30a8ef1da2597.css>; rel=preload; as=style",
			].join(", "),
		  },
		],
	  },
	  {
		source: "/_next/static/:path*",
		headers: [
		  {
			key: "Cache-Control",
			value: "public, max-age=31536000, immutable",
		  },
		],
	  },
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
