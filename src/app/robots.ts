import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
      {
        // Block known AI training, assistant, and AI-search crawlers while
        // continuing to allow conventional search engines.
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "OAI-SearchBot",
          "ClaudeBot",
          "Claude-Web",
          "anthropic-ai",
          "Google-Extended",
          "CCBot",
          "Bytespider",
          "PerplexityBot",
          "Perplexity-User",
          "Applebot-Extended",
          "cohere-ai",
          "Meta-ExternalAgent",
          "meta-externalfetcher",
          "Amazonbot",
          "YouBot",
          "Diffbot",
          "ImagesiftBot",
          "omgili",
          "omgilibot",
        ],
        disallow: "/",
      },
    ],
    sitemap: "https://www.taskoria.com/sitemap.xml",
  };
}
