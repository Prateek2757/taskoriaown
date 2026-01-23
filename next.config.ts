import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  cacheOnNavigation: true,
  reloadOnOnline: true,
  disable: false, // Enable PWA in all environments
});
const nextConfig: NextConfig = {
	reactStrictMode: true,
	images: {
	  formats: ['image/webp', 'image/avif'],
	  domains: ["eoicjmcyigolwgjantsl.supabase.co"],

	  remotePatterns: [
		{
		  protocol: 'https',
		  hostname: 'source.unsplash.com',
		  port: '',
		  pathname: '/**',
		},
		{
		  protocol: 'https',
		  hostname: 'images.unsplash.com',
		  port: '',
		  pathname: '/**',
		},
		{
		  protocol: 'https',
		  hostname: 'avatar.vercel.sh',
		  port: '',
		  pathname: '/**',
		},
		{
		  protocol: 'https',
		  hostname: 'plus.unsplash.com',
		  port: '',
		  pathname: '/**',
		},
	  ],
	},
	typescript: {
		ignoreBuildErrors: true,
	},
	
	 // Disable Strict Mode
	env: {
		ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
		ENCRYPTION_IV: process.env.ENCRYPTION_IV,
	},
	async rewrites() {
		return [
			{
				source: "/proposal", // The route you want to rewrite
				destination: "/views/proposal", // The actual route that handles the request
			},
			{ source: "/login", destination: "/views/login" },
		];
	},
	/* config options here */
};

export default withSerwist(nextConfig);
