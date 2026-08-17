import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import {
  CacheFirst,
  NetworkFirst,
  StaleWhileRevalidate,
  Serwist,
} from "serwist";
import { ExpirationPlugin } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: WorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    {
      matcher: /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
      handler: new StaleWhileRevalidate({
        cacheName: "google-fonts-stylesheets",
        plugins: [
          new ExpirationPlugin({ maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 }), // 1 year
        ],
      }),
    },

    {
      matcher: /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
      handler: new CacheFirst({
        cacheName: "google-fonts-webfonts",
        plugins: [
          new ExpirationPlugin({
            maxEntries: 30,
            maxAgeSeconds: 60 * 60 * 24 * 365, 
          }),
        ],
      }),
    },

    {
      matcher: /\.(?:eot|otf|ttc|ttf|woff|woff2|font\.css)$/i,
      handler: new StaleWhileRevalidate({
        cacheName: "static-font-assets",
        plugins: [
          new ExpirationPlugin({ maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 30 }), // 30 days
        ],
      }),
    },

    {
      // These files are deployed with year-long immutable cache headers. A
      // stale-while-revalidate strategy still starts a network request on
      // every view, which needlessly warms Vercel's origin/CDN path again.
      matcher: /\.(?:avif|jpg|jpeg|gif|png|svg|ico|webp)$/i,
      handler: new CacheFirst({
        cacheName: "static-image-assets",
        plugins: [
          new ExpirationPlugin({
            maxEntries: 200,                         
            maxAgeSeconds: 60 * 60 * 24 * 30,       
          }),
        ],
      }),
    },

    {
      matcher: /\/_next\/image\?url=.+$/i,
      handler: new CacheFirst({
        cacheName: "next-image",
        plugins: [
          new ExpirationPlugin({
            maxEntries: 100,
            maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
          }),
        ],
      }),
    },

    {
      matcher: /\.(?:mp3|wav|ogg)$/i,
      handler: new CacheFirst({
        cacheName: "static-audio-assets",
        plugins: [
          new ExpirationPlugin({ maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 30 }),
        ],
      }),
    },

    {
      matcher: /\.(?:mp4|webm)$/i,
      handler: new CacheFirst({
        cacheName: "static-video-assets",
        plugins: [
          new ExpirationPlugin({ maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 30 }),
        ],
      }),
    },

    {
      // Only cache Next's content-hashed build assets cache-first. Do not
      // catch dynamic JavaScript endpoints such as /api/runtime-config.js.
      matcher: /\/_next\/static\/.*\.js$/i,
      handler: new CacheFirst({
        cacheName: "static-js-assets",
        plugins: [
          new ExpirationPlugin({
            maxEntries: 100,
            maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
          }),
        ],
      }),
    },

    {
      matcher: /\/_next\/static\/.*\.(?:css|less)$/i,
      handler: new CacheFirst({
        cacheName: "static-style-assets",
        plugins: [
          new ExpirationPlugin({
            maxEntries: 50,
            maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
          }),
        ],
      }),
    },

    {
      matcher: /\/_next\/data\/.+\/.+\.json$/i,
      handler: new StaleWhileRevalidate({
        cacheName: "next-data",
        plugins: [
          new ExpirationPlugin({
            maxEntries: 100,
            maxAgeSeconds: 60 * 60 * 24, 
          }),
        ],
      }),
    },

    {
      matcher: /\/api\/.*$/i,
      handler: new NetworkFirst({
        cacheName: "apis",
        networkTimeoutSeconds: 10,
        plugins: [
          new ExpirationPlugin({
            maxEntries: 100,

            maxAgeSeconds: 60 * 5,
          }),
        ],
      }),
      method: "GET",
    },

    {
      matcher: /.*/i,
      handler: new NetworkFirst({
        cacheName: "others",
        networkTimeoutSeconds: 10,
        plugins: [
          new ExpirationPlugin({
            maxEntries: 50,
            maxAgeSeconds: 60 * 60 * 24, // 24 hours
          }),
        ],
      }),
    },
  ],
});

serwist.addEventListeners();
